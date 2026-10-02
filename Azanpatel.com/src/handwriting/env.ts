/** Runtime gate for every handwriting animation. Computed once, lazily. */
let cached: boolean | null = null;

type NetInfo = { saveData?: boolean };

export function shouldAnimate(): boolean {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const printing = window.matchMedia?.('print').matches ?? false;
  // Windows High Contrast etc.: content wanted immediately, no hidden-until-drawn phase
  const forced = window.matchMedia?.('(forced-colors: active)').matches ?? false;
  const saveData = (navigator as Navigator & { connection?: NetInfo }).connection?.saveData === true;
  cached =
    !reduced &&
    !printing &&
    !forced &&
    !saveData &&
    'IntersectionObserver' in window &&
    typeof document.createRange === 'function' &&
    typeof document.fonts?.load === 'function';
  return cached;
}

export const FONT_FAMILY = '"Shadows Into Light"';

/**
 * How much stroke work may be live at once, page-wide (limiter.ts): a cap on
 * drawing blocks AND on their summed animated paths. The stroke animations are
 * painted on the main thread and every live overlay repaints each frame; at 1x
 * on a desktop that is fine, on a mid/low-end phone (coarse pointer, ≤ 4 cores
 * or ≤ 4 GB) it is a 100–200 ms frame, so phones get a tight budget and a
 * desktop with a fine pointer keeps the designed overlap. For scale: a 64px
 * hero word is ~16 paths, an 11.5px chip ~8, a two-line paragraph ~120.
 */
export function pathBudget(): { paths: number; blocks: number } {
  if (typeof navigator === 'undefined') return { paths: 400, blocks: 6 };
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const fine = window.matchMedia?.('(pointer: fine)').matches ?? false;
  const low = cores <= 4 || mem <= 4;
  if (fine) return low ? { paths: 420, blocks: 6 } : { paths: 640, blocks: 8 };
  return low ? { paths: 260, blocks: 4 } : { paths: 400, blocks: 5 };
}

/** one promise per face: the latin face, and the latin-ext face (unicode-range U+0100…) */
const LATIN_EXT =
  /[\u0100-\u02ba\u02bd-\u02c5\u02c7-\u02cc\u02ce-\u02d7\u02dd-\u02ff\u1d00-\u1dbf\u1e00-\u1e9f\u1ef2-\u1eff\u2020\u20a0-\u20ab\u20ad-\u20c0\u2113\u2c60-\u2c7f\ua720-\ua7ff]/;
const fontPromises = new Map<string, Promise<boolean>>();
/**
 * Resolves once the handwriting face(s) needed for `text` are usable (never
 * rejects). `fonts.load` only fetches the faces whose unicode-range covers the
 * sample text, so pass the block's own text: a latin-ext character (ł, ő, ș)
 * must have its face before the block is Range-measured. Resolves `false` if
 * a face has not loaded within 5 s: the caller must then NOT trace, because
 * the rects would belong to the fallback font.
 */
export function fontReady(text = ''): Promise<boolean> {
  const spec = `16px ${FONT_FAMILY}`;
  // one sample per face keeps the cache to two entries; the test mirrors the latin-ext
  // face's unicode-range in index.css (’ — … are in the latin face: U+2000-206F)
  const sample = LATIN_EXT.test(text) ? ' \u0142' : ' ';
  let p = fontPromises.get(sample);
  if (!p) {
    p = Promise.race([
      document.fonts.load(spec, sample).then(() => true, () => false),
      new Promise<boolean>((r) => setTimeout(() => r(false), 5000)),
    ]).then((loaded) => loaded || (typeof document.fonts.check === 'function' ? document.fonts.check(spec, sample) : true));
    fontPromises.set(sample, p);
  }
  return p;
}
