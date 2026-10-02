/**
 * Builds the SVG stroke overlay for a wrapper element whose text is set in
 * "Shadows Into Light". The browser owns layout: every character's rect is
 * measured with a DOM Range and a stroke-ordered glyph from sil-strokes.json
 * is placed on top of it. Nothing here affects layout.
 */
import FONT_DATA from './sil-strokes.json';

interface StrokePath { d: string; mx: number; my: number; len: number }
/**
 * `fit` = [kx, ky, ox, oy]: per-glyph affine correction computed at build time so the
 * centerline bbox, inset by half a stroke, coincides with the webfont outline's bbox:
 * x_px = rect.left + (ox + x·kx)·s, y_px = baseline_px + (oy + y·ky)·s.
 */
interface Glyph { ink: [number, number]; lsb: number; adv: number; dsc: number; fit: [number, number, number, number]; paths: StrokePath[] }
interface StrokeFont { upm: number; baseline: number; ascent: number; glyphs: Record<string, Glyph> }

const FONT = FONT_DATA as unknown as StrokeFont;
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Stroke weight in glyph units. The webfont's stems are ≈ 0.05em; small text
 * gets a touch more (legibility while drawing), headings a touch less so the
 * crossfade to the webfont does not visibly thin the letters.
 */
function strokeUnits(fs: number): number {
  if (fs <= 16) return 2.6;
  if (fs >= 40) return 2.3;
  return 2.6 - ((fs - 16) / 24) * 0.3;
}

export interface TimingOptions {
  /** pen speed in px/ms */
  speed: number;
  /** per-line duration clamp (ms) */
  minLine: number;
  maxLine: number;
  /**
   * fraction of a line's duration during which the next line is already being
   * written (0 = strictly one line after another, 0.3 = the next line starts
   * when this one is 70% done)
   */
  lineOverlap: number;
  glyphGap: number;
  strokeGap: number;
  wordGap: number;
}

export const DEFAULT_TIMING: TimingOptions = {
  speed: 0.9,
  minLine: 400,
  maxLine: 1000,
  // one pen: the next line starts only when this one is 90% written
  lineOverlap: 0.1,
  glyphGap: 22,
  strokeGap: 30,
  wordGap: 90,
};

/** characters outside 33..126 that map onto existing strokes */
const SUB: Record<string, string> = {
  '’': "'", '‘': "'", '‚': ',', '′': "'",
  '“': '"', '”': '"', '„': '"', '″': '"',
  '‐': '-', '‑': '-', '−': '-',
  '×': 'x', '•': '.', '·': '.',
  // the strokes of a 'c' land where the c of the © sits; the ring arrives at the hand-off
  '©': 'c',
};
const SPACE = /^[ \t\n\r\u00a0\u2000-\u200b\u202f\u205f\u3000]$/;

interface GlyphUse { g: Glyph; stretch?: boolean; repeat?: number; dy?: number }

function glyphFor(ch: string): GlyphUse | null {
  const direct = FONT.glyphs[ch];
  if (direct) return { g: direct };
  if (SUB[ch]) {
    const g = FONT.glyphs[SUB[ch]];
    if (!g) return null;
    // middle dot / bullet sit at half x-height rather than on the baseline
    return ch === '·' || ch === '•' ? { g, dy: -12 } : { g };
  }
  if (ch === '—' || ch === '–' || ch === '→' || ch === '←') return { g: FONT.glyphs['-'], stretch: true };
  if (ch === '…') return { g: FONT.glyphs['.'], repeat: 3 };
  return null;
}

/**
 * One <path> per glyph: the glyph's strokes, in recorded order, as subpaths of a
 * single path (every stroke's data is relative and starts with `m 0,0`, so the
 * start becomes an absolute `M mx,-my`). The dash animation then draws the
 * subpaths one after another with a single animation per glyph instead of one
 * per stroke — roughly half the animations on uppercase text.
 */
function glyphPathData(g: Glyph): string {
  return g.paths.map((p) => `M ${p.mx},${-p.my} ${p.d.slice(6)}`).join(' ');
}

interface Stroke {
  path?: SVGPathElement;
  len: number; // px
  gap: number; // ms before this stroke starts
  line: number;
}

export interface Overlay {
  svg: SVGSVGElement;
  /** total duration in ms (from the block's own t=0) */
  total: number;
  /** number of animated paths */
  paths: number;
  /** the path that ends last (for animationend) */
  last: SVGPathElement | null;
  /**
   * re-reads each text node's computed colour and updates its strokes (a hover
   * that changes the colour while the block is drawing would otherwise jump at
   * the hand-off)
   */
  recolor(): void;
}

/**
 * Measures `wrapper` and returns an overlay (not yet attached). Returns null if
 * nothing can be drawn. `colorFor` lets the caller supply computed colours that
 * were read before the text was hidden; by default they are read live (safe
 * because hiding uses -webkit-text-fill-color, which leaves `color` intact).
 */
export function buildOverlay(wrapper: HTMLElement, timing: TimingOptions): Overlay | null {
  const er = wrapper.getBoundingClientRect();
  if (er.width === 0 || er.height === 0) return null;
  const originX = er.left + wrapper.clientLeft;
  const originY = er.top + wrapper.clientTop;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'hw-ink');
  svg.setAttribute('width', String(Math.ceil(er.width)));
  svg.setAttribute('height', String(Math.ceil(er.height)));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = (n as Text).parentElement;
      if (!p || p.closest('svg, script, style, [data-hw-skip]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const strokes: Stroke[] = [];
  // lines are keyed by baseline y (px) with a 2px tolerance; sorted afterwards
  const lineBaselines: number[] = [];
  const lineFs: number[] = [];
  const lineOf = (base: number) => {
    for (let i = 0; i < lineBaselines.length; i++) if (Math.abs(lineBaselines[i] - base) <= 2) return i;
    lineBaselines.push(base);
    return lineBaselines.length - 1;
  };

  const range = document.createRange();
  let node: Node | null;
  let pathCount = 0;
  // strokes grouped by the element whose colour they inherit (for recolor)
  const owners: { el: Element; paths: SVGPathElement[] }[] = [];
  while ((node = walker.nextNode())) {
    const text = node as Text;
    const parent = text.parentElement!;
    const cs = getComputedStyle(parent);
    const fs = parseFloat(cs.fontSize);
    if (!(fs > 0)) continue;
    const s = fs / FONT.upm;
    // small lettering gets proportionally shorter pen lifts, otherwise the fixed
    // gaps dominate and a 10px caption takes as long as a headline
    const sizeK = Math.min(1, Math.max(0.5, fs / 20));
    const upper = cs.textTransform === 'uppercase';
    const lower = cs.textTransform === 'lowercase';
    const color = cs.color;
    // a character's Range rect includes its trailing letter-spacing; glyphs that are
    // fitted to the rect (em dash, ellipsis) must use the advance without it
    const tracking = parseFloat(cs.letterSpacing) || 0;
    const owner = { el: parent, paths: [] as SVGPathElement[] };
    owners.push(owner);
    const data = text.data;
    // strip combining marks: they share the base glyph's rect
    for (let i = 0; i < data.length; i++) {
      const code = data.charCodeAt(i);
      if (code >= 0x0300 && code <= 0x036f) continue;
      if (code >= 0xd800 && code <= 0xdbff) { i++; continue; } // surrogate pair: no strokes
      let ch = data[i];
      if (upper) ch = ch.toUpperCase();
      else if (lower) ch = ch.toLowerCase();
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const rc = rects[0];
      const isSpace = SPACE.test(ch);
      if (rc.width === 0 && !isSpace) continue;
      const base = rc.top - originY + FONT.ascent * fs;
      const line = lineOf(base);
      lineFs[line] = Math.max(lineFs[line] ?? 0, fs);
      if (isSpace) { strokes.push({ gap: timing.wordGap * sizeK, len: 0, line }); continue; }
      const use = glyphFor(ch);
      if (!use) { strokes.push({ gap: 40 * sizeK, len: 0, line }); continue; }
      const g = use.g;
      const [kx, ky, ox, oy] = g.fit;
      const reps = use.repeat ?? 1;
      for (let rep = 0; rep < reps; rep++) {
        // horizontal scale of the glyph in px per unit; the fitted kx unless the
        // glyph is stretched to the character's rect (em dash)
        let scaleX = s * kx;
        let x0: number;
        if (use.stretch) {
          const adv = Math.max(rc.width * 0.5, rc.width - tracking);
          const inkW = (g.ink[1] - g.ink[0]) * s;
          scaleX = s * Math.max(0.5, (adv * 0.9) / inkW);
          x0 = rc.left - originX + adv * 0.05 - g.ink[0] * scaleX;
        } else if (reps > 1) {
          // spread repeats (ellipsis dots) evenly across the character's advance
          const inkW = (g.ink[1] - g.ink[0]) * scaleX;
          const slot = Math.max(rc.width * 0.5, rc.width - tracking) / reps;
          x0 = rc.left - originX + slot * rep + (slot - inkW) / 2 - g.ink[0] * scaleX;
        } else {
          x0 = rc.left - originX + ox * s;
        }
        const scaleY = s * ky;
        const y0 = base + (oy + (use.dy ?? 0)) * s;
        // the stroke is scaled with the glyph: compensate so it stays ≈ 0.05em
        const k = Math.sqrt((scaleX / s) * ky);
        const gEl = document.createElementNS(SVG_NS, 'g');
        gEl.setAttribute('transform', `translate(${x0.toFixed(2)} ${y0.toFixed(2)}) scale(${scaleX.toFixed(4)} ${scaleY.toFixed(4)})`);
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', glyphPathData(g));
        path.setAttribute('pathLength', '1');
        path.setAttribute('stroke-width', (strokeUnits(fs) / k).toFixed(2));
        path.setAttribute('stroke', color);
        gEl.appendChild(path);
        owner.paths.push(path);
        pathCount++;
        // the pen-lifts between the glyph's strokes are folded into its duration
        const lenPx = g.paths.reduce((sum, p) => sum + p.len, 0) * s * k;
        const lifts = (g.paths.length - 1) * timing.strokeGap * sizeK * timing.speed;
        strokes.push({ path, len: lenPx + lifts, line, gap: timing.glyphGap * sizeK });
        svg.appendChild(gEl);
      }
    }
  }
  range.detach?.();
  if (pathCount === 0) return null;
  const recolor = () => {
    for (const o of owners) {
      if (!o.paths.length) continue;
      const c = getComputedStyle(o.el).color;
      for (const p of o.paths) if (p.getAttribute('stroke') !== c) p.setAttribute('stroke', c);
    }
  };

  // order lines top to bottom regardless of DOM order
  const order = lineBaselines.map((b, i) => [b, i] as const).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
  const lineIndex = new Map<number, number>();
  order.forEach((orig, idx) => lineIndex.set(orig, idx));

  const perLine = new Map<number, Stroke[]>();
  for (const st of strokes) {
    const li = lineIndex.get(st.line)!;
    let arr = perLine.get(li);
    if (!arr) perLine.set(li, (arr = []));
    arr.push(st);
  }

  let total = 0;
  let last: SVGPathElement | null = null;
  let lastEnd = -1;
  // lines are written top to bottom by one pen: line i starts when line i-1 is
  // (1 - lineOverlap) of the way through
  let offset = 0;
  const lines = [...perLine.keys()].sort((a, b) => a - b);
  for (const li of lines) {
    const arr = perLine.get(li)!;
    let t = 0;
    const sched: { st: Stroke; start: number; d: number }[] = [];
    for (const st of arr) {
      t += st.gap;
      if (st.path) {
        const d = st.len / timing.speed;
        sched.push({ st, start: t, d });
        t += d;
      }
    }
    if (!sched.length) continue;
    const raw = t;
    // the per-line floor and cap both shrink for small text (an 11px chip is not
    // stretched to a headline's minimum: it is written quickly, like a real note)
    const origIdx = order[li];
    const capK = Math.min(1, Math.max(0.5, (lineFs[origIdx] ?? 20) / 20));
    const target = Math.min(Math.max(raw, timing.minLine * capK), timing.maxLine * capK);
    const k = target / raw;
    for (const { st, start, d } of sched) {
      const startMs = offset + start * k;
      const durMs = Math.max(16, d * k);
      st.path!.style.setProperty('--t', `${startMs.toFixed(0)}ms`);
      st.path!.style.setProperty('--d', `${durMs.toFixed(0)}ms`);
      if (startMs + durMs > lastEnd) { lastEnd = startMs + durMs; last = st.path!; }
    }
    total = Math.max(total, offset + target);
    offset += target * (1 - Math.min(0.9, Math.max(0, timing.lineOverlap)));
  }
  return { svg, total: Math.ceil(total), paths: pathCount, last, recolor };
}
