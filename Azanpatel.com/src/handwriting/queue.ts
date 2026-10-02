/**
 * Group queue: blocks sharing a `group` start in document order, each one
 * starting once the previous block is ~40% through its draw (bounded to
 * [120, 600] ms after the previous start), so a hero full of short blocks
 * reads top-to-bottom as a cascade instead of either a 10-second serial wait
 * or a simultaneous burst.
 *
 * The group is ONE ordered timeline, not a sequence of independent batches:
 * every flush takes all members that have not started yet (whether they were
 * enqueued just now or were already waiting for a slot), sorts them by
 * document position and re-assigns their start times from the cursor, so a
 * block that scrolls into view mid-cascade can never start before an in-view
 * block above it, and nothing above a written block stays blank.
 *
 * Bounds that keep in-view text from sitting invisible:
 *  - the first batch spreads its starts over at most BUDGET ms; once the
 *    cascade is running (the user scrolled on), the re-ordered remainder is
 *    compressed into LATER_BUDGET ms (a member's `budget` lowers either);
 *  - a newcomer (a block enqueued well after the block currently being
 *    written started) waits at most MAX_WAIT ms from its ARRIVAL, not from the
 *    flush, so staggered arrivals cannot push the cascade later and later; a
 *    block that arrived with the current one keeps the designed lead; nothing
 *    waits for a block that has left the viewport;
 *  - members that have scrolled off screen before their turn start right away
 *    and take no slot (nobody is watching them);
 *  - when the last live member of a group cancels or finishes everything is
 *    reset, so a stale schedule cannot survive a route change.
 */
interface Item {
  el: Element;
  /** draw duration in ms; an estimate until the caller's overlay is built (`update`) */
  total: number;
  /** (re)schedules the block: may be called again with a new start while it has not started */
  play: (startAt: number) => void;
  budget?: number;
  cancelled: boolean;
  /** the strokes have actually started (the limiter granted its slot) */
  began: boolean;
  /** enqueue time (performance.now() clock) */
  at: number;
  /** assigned start */
  startAt: number;
  /** when the next block may start after this one (startAt + lead) */
  nextAt: number;
}

export interface QueueHandle {
  /** the block is cancelled or has finished drawing (idempotent) */
  release(): void;
  /** the real draw duration once the overlay has been measured */
  update(total: number): void;
  /**
   * the strokes have started. If that is later than the assigned start (the page-wide
   * limiter made the block wait), the members after it are shifted by the same delay so
   * they keep their lead behind it instead of all being granted together when slots free
   */
  started(): void;
}

interface Group {
  items: Item[];
  live: number;
  flush: number | null;
}

const groups = new Map<string, Group>();
const GAP = 120;
const MAX_LEAD = 600;
/** a newcomer never waits longer than this (from its arrival) for the block being written */
const MAX_WAIT = 400;
/** blocks enqueued within this of the current block's start belong to its batch, not newcomers */
const SAME_BATCH = 100;
/** the starts of the first batch are spread over at most this long */
const BUDGET = 2000;
/** once the cascade runs, everything still pending is re-spread within this (shorter on
 *  phones, where a screen reached by a fling should settle quickly) */
const LATER_BUDGET =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches ? 500 : 900;

function group(name: string): Group {
  let g = groups.get(name);
  if (!g) {
    g = { items: [], live: 0, flush: null };
    groups.set(name, g);
  }
  return g;
}

function inViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

function lead(total: number): number {
  return Math.min(MAX_LEAD, Math.max(GAP, total * 0.4 + 60));
}

const byDocument = (a: Item, b: Item) =>
  a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

function flush(g: Group) {
  g.flush = null;
  const now = performance.now();
  g.items = g.items.filter((i) => !i.cancelled);
  const started = g.items.filter((i) => i.startAt <= now);
  const pending = g.items.filter((i) => i.startAt > now).sort(byDocument);
  if (!pending.length) return;

  // cursor: behind the block being written — but a newcomer waits at most
  // MAX_WAIT from its arrival, and nothing waits for a block that is off screen or gone
  let cursor = now;
  if (started.length) {
    const current = started.reduce((a, b) => (b.startAt > a.startAt ? b : a));
    if (current.el.isConnected && inViewport(current.el)) {
      const nextAt = Math.max(...started.map((i) => i.nextAt));
      const newcomers = pending.filter((i) => i.at > current.startAt + SAME_BATCH);
      const cap = newcomers.length ? Math.min(...newcomers.map((i) => i.at)) + MAX_WAIT : Infinity;
      cursor = Math.max(now, Math.min(nextAt, cap));
    }
  }

  // members that left the viewport before their turn: draw now, take no slot
  const visible: Item[] = [];
  for (const item of pending) {
    if (inViewport(item.el)) visible.push(item);
    else {
      item.startAt = now;
      item.nextAt = now;
      item.play(now);
    }
  }
  if (!visible.length) return;

  // spread: scale the leads so the last visible block starts within the budget
  let budget = started.length ? LATER_BUDGET : BUDGET;
  for (const item of visible) if (item.budget !== undefined) budget = Math.min(budget, item.budget);
  const leads = visible.map((i) => lead(i.total));
  const spread = leads.slice(0, -1).reduce((s, l) => s + l, 0);
  const k = spread > budget ? budget / spread : 1;

  visible.forEach((item, idx) => {
    item.startAt = cursor;
    cursor += leads[idx] * k;
    item.nextAt = cursor;
    item.play(item.startAt);
  });
}

/**
 * Schedules `play(startAt)` for this block. Enqueue SYNCHRONOUSLY when the
 * block intersects (before any await), so every block of one intersection
 * batch lands in the same flush. `play` may be called more than once while
 * the block has not started (a later flush re-ordered the cascade); the
 * caller must replace its pending timer.
 */
export function enqueue(
  name: string,
  el: Element,
  play: (startAt: number) => void,
  opts: { total: number; budget?: number },
): QueueHandle {
  const g = group(name);
  const item: Item = {
    el, play, total: opts.total, budget: opts.budget, cancelled: false, began: false,
    at: performance.now(), startAt: Infinity, nextAt: Infinity,
  };
  g.items.push(item);
  g.live++;
  if (g.flush === null) g.flush = window.setTimeout(() => flush(g), 0);
  let released = false;
  return {
    update(total) { item.total = total; },
    started() {
      if (item.began || item.cancelled) return;
      item.began = true;
      const late = performance.now() - item.startAt;
      if (!(late > 30)) return;
      for (const other of g.items) {
        if (other === item || other.cancelled || other.began || other.startAt === Infinity) continue;
        if (byDocument(item, other) > 0) continue; // only the members after this one
        other.startAt += late;
        other.nextAt += late;
        other.play(other.startAt);
      }
    },
    release() {
      if (released) return;
      released = true;
      item.cancelled = true;
      g.live--;
      if (g.live <= 0) {
        // the group emptied (route change, all blocks drawn): forget the cascade
        g.live = 0;
        g.items = [];
      }
    },
  };
}
