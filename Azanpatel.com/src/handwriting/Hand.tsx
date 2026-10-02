import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { buildOverlay, DEFAULT_TIMING, type Overlay } from './overlay';
import { observe, unobserve } from './observer';
import { enqueue, type QueueHandle } from './queue';
import { acquire, type Slot } from './limiter';
import { fontReady, shouldAnimate } from './env';

export interface HandProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** element to render (span, p, h1, h2, div, ...) — default span (inline-block) */
  as?: ElementType;
  className?: string;
  /** large heading (≥ 44px): displacement + grain filter */
  rough?: boolean;
  /** 28–40px heading: lighter displacement */
  roughSm?: boolean;
  /** false renders plain text (no overlay, never hidden) */
  animate?: boolean;
  /** replay when scrolled out of and back into view */
  once?: boolean;
  /**
   * draw only once per page lifetime: a block with this key that has already
   * been drawn (e.g. the header on a previous route) renders plain
   */
  memo?: string;
  /** blocks sharing a group draw in document order, cascaded ~120–600 ms apart */
  group?: string;
  /** group only: spread the starts of the blocks visible together over at most this many ms (default 2000, 1200 after a scroll) */
  budget?: number;
  /** extra ms before this block starts */
  delay?: number;
  /** pen speed, px/ms (default 0.8) */
  speed?: number;
  /** per-line duration cap in ms (default 1000) */
  maxLine?: number;
  /** fraction of a line still being written when the next line starts (default 0.1) */
  lineOverlap?: number;
  children: ReactNode;
}

type Phase = 'idle' | 'pending' | 'drawing' | 'fading' | 'done';

const WATCHDOG_MS = 5000;
/** hand-off: one cross-dissolve, strokes out while the webfont comes in (index.css hw-fillin / hw-inkout) */
const FADE_MS = 160;
const FOCUSABLE = 'a,button,[tabindex],summary,label';

/** memo keys that have finished drawing in this page lifetime */
const drawn = new Set<string>();

/** draw-duration estimate for the group queue until the overlay is measured */
function estimateTotal(el: Element): number {
  const n = (el.textContent ?? '').replace(/\s+/g, '').length;
  return Math.min(2000, Math.max(400, 300 + 25 * n));
}

/**
 * Wraps REAL text. When it scrolls into view the text is traced stroke by
 * stroke (left to right, in the font's recorded stroke order) by an SVG
 * overlay, then crossfades to the plain webfont text. Steady state is plain,
 * selectable text with no extra DOM.
 */
export default function Hand({
  as: Tag = 'span',
  className = '',
  rough = false,
  roughSm = false,
  animate = true,
  once = true,
  memo,
  group,
  budget,
  delay = 0,
  speed,
  maxLine,
  lineOverlap,
  children,
  ...rest
}: HandProps) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>(() =>
    animate && shouldAnimate() && !(memo && drawn.has(memo)) ? 'pending' : 'idle',
  );
  // bumped on every re-arm (once=false) so the effect below runs once per draw cycle
  const [cycle, setCycle] = useState(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  // lets the print handler end the current cycle properly (timers, queue, SVG)
  const finishRef = useRef<((fade: boolean) => void) | null>(null);

  // the timing options rarely change; snapshot them per effect run
  const timingRef = useRef({ speed, maxLine, lineOverlap, delay, group, budget, once, memo });
  timingRef.current = { speed, maxLine, lineOverlap, delay, group, budget, once, memo };

  useLayoutEffect(() => {
    if (phaseRef.current !== 'pending') return;
    const el = ref.current;
    if (!el) return;
    // a remount in the same commit as the previous instance's unmount (route change
    // mid-write) renders before that cleanup marks the key drawn: re-check here
    const key = timingRef.current.memo;
    if (key && drawn.has(key)) { setPhase('idle'); return; }

    let overlay: Overlay | null = null;
    let timers: number[] = [];
    let playTimer: number | null = null;
    let queue: QueueHandle | null = null;
    let slot: Slot | null = null;
    /** start assigned by the queue before the overlay was built */
    let scheduledAt: number | null = null;
    let finished = false;
    let armed = true;
    let drawing = false;
    /** the strokes have been attached at least once (drawing, fading or done) */
    let began = false;
    let lastWidth = el.getBoundingClientRect().width;
    // the card/box around this block (data-hw-host) fades its rules in with the first stroke
    const host = el.parentElement?.closest<HTMLElement>('[data-hw-host]') ?? null;
    const markHost = (state: 'pending' | 'drawing' | 'done') => {
      if (!host) return;
      const cur = host.dataset.hwHost;
      if (state === 'pending' ? !cur : cur === 'pending') host.dataset.hwHost = state;
    };
    markHost('pending');

    const clearTimers = () => { timers.forEach((t) => window.clearTimeout(t)); timers = []; };
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

    const dropSvg = () => {
      if (overlay) {
        const svg = overlay.svg;
        overlay = null;
        svg.remove();
      }
    };

    const settle = () => {
      dropSvg();
      setPhase('done');
      const t = timingRef.current;
      if (t.memo) drawn.add(t.memo);
      if (!t.once) rearm();
    };

    /**
     * reveal text; if `fade`, cross-dissolve from the finished strokes to the
     * webfont (both CSS animations run on the `hw-fading` class), then drop the SVG
     */
    const finish = (fade: boolean) => {
      if (finished) return;
      finished = true;
      drawing = false;
      clearTimers();
      queue?.release();
      slot?.release();
      slot = null;
      markHost('done');
      if (fade && overlay && overlay.svg.isConnected) {
        setPhase('fading');
        later(settle, FADE_MS + 40);
      } else {
        settle();
      }
    };
    finishRef.current = finish;

    const rearm = () => {
      // once=false: a fresh cycle re-runs this effect; it re-arms after the block leaves the viewport
      setPhase('pending');
      setCycle((c) => c + 1);
    };

    const build = () => {
      const t = timingRef.current;
      return buildOverlay(el, {
        ...DEFAULT_TIMING,
        speed: t.speed ?? DEFAULT_TIMING.speed,
        maxLine: t.maxLine ?? DEFAULT_TIMING.maxLine,
        lineOverlap: t.lineOverlap ?? DEFAULT_TIMING.lineOverlap,
      });
    };

    /** the block's turn: attach the SVG and run the strokes (called by the limiter) */
    const begin = (visible: boolean) => {
      if (finished || !overlay) return;
      // its turn came after it scrolled out of view: nobody is watching, reveal plainly
      if (!visible) { finish(false); return; }
      // the SVG is attached only now, so a queued block costs nothing until its turn
      if (!overlay.svg.isConnected) el.appendChild(overlay.svg);
      drawing = true;
      began = true;
      queue?.started();
      setPhase('drawing');
      markHost('drawing');
      const total = overlay.total;
      el.dataset.hwTotal = String(total);
      el.dataset.hwStart = performance.now().toFixed(0);
      overlay.last?.addEventListener('animationend', () => finish(true), { once: true });
      // watchdog if animationend never fires; if the strokes are merely
      // running late (paused/throttled animations) give them one more period
      let deferred = false;
      const watchdog = () => {
        const anim = overlay?.last?.getAnimations?.()[0];
        if (anim && anim.playState !== 'finished' && !deferred) {
          deferred = true;
          later(watchdog, total + 1000);
          return;
        }
        finish(true);
      };
      later(watchdog, total + 100);
    };

    /**
     * (re)schedule the draw; the queue may call this again with a new start
     * while we wait (even while the block is already waiting for a limiter
     * slot: that request is withdrawn and re-timed), and may call it before
     * the overlay exists (font still loading): start() then replays the
     * stored start once it is built. When the timer fires the block asks the
     * page-wide limiter for a slot.
     */
    const play = (startAt: number) => {
      if (finished || drawing) return;
      if (slot) { slot.release(); slot = null; }
      scheduledAt = startAt;
      if (!overlay) return;
      if (playTimer !== null) { window.clearTimeout(playTimer); timers = timers.filter((t) => t !== playTimer); }
      const wait = Math.max(0, startAt - performance.now() + (timingRef.current.delay ?? 0));
      playTimer = window.setTimeout(() => {
        playTimer = null;
        if (finished || !overlay || slot) return;
        slot = acquire(el, overlay.paths, begin, !!timingRef.current.group);
      }, wait);
      timers.push(playTimer);
    };

    const start = async () => {
      const t = timingRef.current;
      // claim the group slot now (synchronously), so the whole intersection
      // batch is ordered in one flush; the duration is refined once measured
      if (t.group) queue = enqueue(t.group, el, play, { total: estimateTotal(el), budget: t.budget });
      // the block's own text, so a latin-ext character loads its face before we measure
      const ok = await fontReady(el.textContent ?? '');
      if (finished) return;
      // the face is not usable (slow network): never trace the fallback font
      if (!ok) { finish(false); return; }
      overlay = build();
      if (!overlay) { finish(false); return; }
      lastWidth = el.getBoundingClientRect().width;
      if (queue) {
        queue.update(overlay.total);
        if (scheduledAt !== null) play(scheduledAt);
      } else play(performance.now());
    };

    let observerAlive = false;
    // a re-armed block (once=false) must leave the viewport before it can replay
    armed = cycle === 0;
    observe(el, (entry) => {
      observerAlive = true;
      if (entry.isIntersecting) {
        if (!armed || finished) return;
        armed = false;
        if (timingRef.current.once) unobserve(el);
        clearTimers(); // drop the watchdog
        void start();
      } else {
        armed = true;
      }
    });

    // never leave text invisible: if the observer never reports at all, reveal plainly
    later(() => { if (!observerAlive && !overlay) finish(false); }, WATCHDOG_MS);

    // keyboard focus into (or onto) a pending block reveals it immediately.
    // focusin bubbles up, so listen on the nearest focusable ancestor as well
    // (the hero button is <a><Hand/></a>).
    const onFocus = (e: Event) => {
      const t = e.target as Node | null;
      if (t && (el.contains(t) || (t as Element).contains?.(el))) finish(drawing);
    };
    const focusHost: Element = el.closest(FOCUSABLE) ?? el;
    focusHost.addEventListener('focusin', onFocus);
    // a hover that changes the text colour while the strokes are live (card title
    // -> accent, button -> inverted): keep the strokes in the colour the text ends in
    const onColor = (e: Event) => {
      if ((e as TransitionEvent).propertyName === 'color' && overlay?.svg.isConnected) overlay.recolor();
    };
    focusHost.addEventListener('transitionend', onColor);

    // reflow -> stale rects: while drawing, reveal immediately; a block still
    // waiting for its turn is simply re-measured and keeps its slot
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => {
        const w = el.getBoundingClientRect().width;
        if (Math.abs(w - lastWidth) > 1) {
          if (drawing) finish(false);
          else if (overlay && !finished) {
            dropSvg();
            overlay = build();
            if (!overlay) finish(false);
          }
        }
        lastWidth = w;
      });
      ro.observe(el);
    }

    return () => {
      // unmounted mid-write (route change while the header cascade runs): an
      // interrupted write counts as written, so the remount renders plain
      if (began && timingRef.current.memo) drawn.add(timingRef.current.memo);
      finished = true;
      finishRef.current = null;
      clearTimers();
      queue?.release();
      slot?.release();
      unobserve(el);
      ro?.disconnect();
      focusHost.removeEventListener('focusin', onFocus);
      focusHost.removeEventListener('transitionend', onColor);
      dropSvg();
    };
    // one run per draw cycle; options are read from refs
  }, [cycle]);

  // print: end the cycle and reveal immediately (no stray overlay, no replay)
  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return;
    const onPrint = () => finishRef.current?.(false);
    window.addEventListener('beforeprint', onPrint);
    return () => window.removeEventListener('beforeprint', onPrint);
  }, [phase]);

  const cls = [
    'hw',
    className,
    rough ? 'hw-rough' : '',
    roughSm ? 'hw-rough-sm' : '',
    phase === 'pending' || phase === 'drawing' ? 'hw-pending' : '',
    phase === 'drawing' ? 'hw-drawing' : '',
    phase === 'fading' ? 'hw-fading' : '',
    phase === 'done' ? 'hw-done' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={cls} data-hw={phase} {...rest}>
      {children}
    </Tag>
  );
}
