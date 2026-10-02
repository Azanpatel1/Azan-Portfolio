/**
 * Page-wide budget for how much stroke work is live (drawing) at once. Every
 * intersecting card used to start together: a phone scrolling a card grid
 * could have a dozen overlays (700+ animated paths) painting in the same
 * frames, which on a mid-range phone is a 100–200 ms frame. Each block asks
 * for a slot with its cost (its number of animated paths); while the live cost
 * would exceed the device budget (`pathBudget` in env.ts) the block waits.
 * The budget is in paths rather than blocks so a row of 8-path chips is not
 * serialised behind a 200-path paragraph: small blocks still write together,
 * heavy ones take turns. When a slot frees, the waiting block nearest the top
 * of the viewport goes next (the header and whatever the reader is looking at
 * come before the cards below; ties keep arrival order); a block that has
 * scrolled out of view meanwhile is simply revealed plainly (nobody is
 * watching it) at no cost. A block of a cascade group (`priority`) is exempt from the
 * block cap, not from the path budget: a group writes one or two blocks at a time by
 * design, and without the exemption a page header would wait behind the thirty small
 * card blocks that intersected together with it.
 */
import { pathBudget } from './env';

interface Waiter {
  el: Element;
  cost: number;
  priority: boolean;
  /** called when granted; `visible` is false if the block has left the viewport */
  go: (visible: boolean) => void;
}

let active = 0;
let liveBlocks = 0;
const waiting: Waiter[] = [];
let budget: { paths: number; blocks: number } | null = null;

export interface Slot {
  /** frees the slot (idempotent); also cancels a still-waiting request */
  release(): void;
}

/** a visible waiter may run: something must always be allowed to run, otherwise within budget */
function fits(w: Waiter): boolean {
  return liveBlocks === 0 || (active + w.cost <= budget!.paths && (w.priority || liveBlocks < budget!.blocks));
}

function next(): void {
  while (waiting.length) {
    // the in-view waiters, topmost first (ties: arrival order); off-screen ones only once nothing in view waits
    const inView: { w: Waiter; top: number }[] = [];
    for (const w of waiting) {
      const r = w.el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) inView.push({ w, top: r.top });
    }
    if (!inView.length) {
      // an off-screen block costs nothing (revealed plainly)
      waiting.shift()!.go(false);
      continue;
    }
    inView.sort((a, b) => a.top - b.top);
    // strict top-to-bottom order, except that a cascade block may pass a blocked one above it
    let pick = inView[0].w;
    if (!fits(pick)) {
      const p = inView.find((c) => c.w.priority && fits(c.w));
      if (!p) return;
      pick = p.w;
    }
    waiting.splice(waiting.indexOf(pick), 1);
    pick.go(true);
  }
}

/**
 * Requests a slot for `el` costing `cost` paths; `go(true)` runs (synchronously
 * if the budget allows) when the block may draw, `go(false)` if its turn came
 * after it left the viewport (the caller should then reveal plainly).
 * `priority` (a cascade-group member) is exempt from the block cap.
 */
export function acquire(el: Element, cost: number, go: (visible: boolean) => void, priority = false): Slot {
  if (!budget) budget = pathBudget();
  let granted = false;
  let held = 0;
  let released = false;
  const w: Waiter = {
    el,
    cost,
    priority,
    go: (visible) => {
      granted = true;
      if (visible) { held = cost; active += cost; liveBlocks++; }
      go(visible);
    },
  };
  waiting.push(w);
  next();
  return {
    release() {
      if (released) return;
      released = true;
      if (!granted) {
        const i = waiting.indexOf(w);
        if (i >= 0) waiting.splice(i, 1);
        return;
      }
      if (held) {
        active = Math.max(0, active - held);
        liveBlocks = Math.max(0, liveBlocks - 1);
        held = 0;
        // let the next block start on a fresh task, after this one's hand-off work
        window.setTimeout(next, 0);
      }
    },
  };
}
