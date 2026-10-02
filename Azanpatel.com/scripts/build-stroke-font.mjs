#!/usr/bin/env node
/**
 * build-stroke-font.mjs — emits src/handwriting/sil-strokes.json
 *
 * Inputs
 *   src/handwriting/vendor/shadows-into-light.vara.json  (Vara, MIT) — stroke-ordered
 *       single-line glyph paths for ASCII 33..126, each path placed by translate(mx, -my)
 *   src/handwriting/vendor/ShadowsIntoLight.ttf (OFL) — only used for per-glyph side bearings and
 *       advances, parsed directly (head/hhea/cmap/loca/glyf/hmtx). No npm dependencies.
 *
 * Output format
 *   { upm, baseline, ascent, glyphs: { "a": { ink:[minx,maxx], lsb, adv, dsc, fit:[kx,ky,ox,oy], paths:[{ d, mx, my, len }] } } }
 *   upm      = JSON units per em  (1024 TTF units / 21.2 TTF-units-per-JSON-unit ≈ 48.3)
 *   baseline = y of the baseline in glyph space, as a positive offset (glyph space baseline is y = −15.5)
 *   ascent   = hhea ascender / unitsPerEm (1203/1024 = 1.175): Range rects start at (baseline − ascent·fontSize)
 *   ink      = horizontal ink extent of the strokes in glyph units
 *   lsb/adv  = TTF left side bearing / advance, in glyph units
 *   dsc      = how far the strokes reach below the baseline, in glyph units (0 for no descender)
 *   fit      = per-glyph affine correction [kx, ky, ox, oy]: the Vara centerlines were traced to
 *              the OUTLINE's bounding box, so once the ~0.05em round-capped stroke is added they
 *              come out ~8% larger than the webfont in both axes (measured: caps top +1.3 u,
 *              bottom −1.5 u, widths +9%). The fit scales the centerline bbox so that, inset by
 *              half a stroke width, it coincides with the TTF glyf bbox:
 *                x_px = rect.left + (ox + x·kx)·s      y_px = baseline_px + (oy + y·ky)·s
 *              (s = fontSize/upm; glyph y is SVG-down with the baseline at y = −15.5). Glyphs too
 *              small to fit in an axis ('.', '-', '|', …) keep kx/ky = 1 and the plain
 *              lsb/baseline placement in that axis.
 *   len      = sampled path length in glyph units (24 samples per cubic) so the browser never
 *              has to call getTotalLength()
 *
 * Run with:  npm run fonts:strokes
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TTF = path.join(root, 'src/handwriting/vendor/ShadowsIntoLight.ttf');
const VARA = path.join(root, 'src/handwriting/vendor/shadows-into-light.vara.json');
const OUT = path.join(root, 'src/handwriting/sil-strokes.json');

// ---- minimal TrueType reader -------------------------------------------------
const b = readFileSync(TTF);
const u16 = (o) => b.readUInt16BE(o);
const i16 = (o) => b.readInt16BE(o);
const u32 = (o) => b.readUInt32BE(o);
const numTables = u16(4);
const tables = {};
for (let i = 0; i < numTables; i++) {
  const o = 12 + i * 16;
  tables[b.toString('ascii', o, o + 4)] = { off: u32(o + 8), len: u32(o + 12) };
}
const unitsPerEm = u16(tables.head.off + 18);
const longLoca = i16(tables.head.off + 50) === 1;
const ascender = i16(tables.hhea.off + 4);
const numHMetrics = u16(tables.hhea.off + 34);

const cmap = tables.cmap.off;
let sub = null;
for (let i = 0, n = u16(cmap + 2); i < n; i++) {
  const off = u32(cmap + 8 + i * 8);
  if (u16(cmap + off) === 4) { sub = cmap + off; break; }
}
if (sub === null) throw new Error('no format-4 cmap subtable');

function glyphId(cp) {
  const segX2 = u16(sub + 6), segs = segX2 / 2;
  const ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ros = deltas + segX2;
  for (let i = 0; i < segs; i++) {
    const end = u16(ends + i * 2), start = u16(starts + i * 2);
    if (cp >= start && cp <= end) {
      const d = i16(deltas + i * 2), ro = u16(ros + i * 2);
      if (ro === 0) return (cp + d) & 0xffff;
      const g = u16(ros + i * 2 + ro + (cp - start) * 2);
      return g === 0 ? 0 : (g + d) & 0xffff;
    }
  }
  return 0;
}

function glyphMetrics(cp) {
  const g = glyphId(cp);
  const lo = longLoca ? u32(tables.loca.off + g * 4) : u16(tables.loca.off + g * 2) * 2;
  const hi = longLoca ? u32(tables.loca.off + g * 4 + 4) : u16(tables.loca.off + g * 2 + 2) * 2;
  const adv = u16(tables.hmtx.off + Math.min(g, numHMetrics - 1) * 4);
  if (hi === lo) return { adv, xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
  const o = tables.glyf.off + lo;
  return { xMin: i16(o + 2), yMin: i16(o + 4), xMax: i16(o + 6), yMax: i16(o + 8), adv };
}

// ---- trace Vara paths (relative m/l/c/z only) --------------------------------
function trace(p) {
  const toks = p.d.replace(/([a-zA-Z])/g, ' $1 ').trim().split(/[\s,]+/);
  let i = 0, cmd = '';
  let x = p.mx, y = -p.my, sx = x, sy = y;
  let minx = x, maxx = x, miny = y, maxy = y, len = 0;
  const upd = (px, py) => { minx = Math.min(minx, px); maxx = Math.max(maxx, px); miny = Math.min(miny, py); maxy = Math.max(maxy, py); };
  while (i < toks.length) {
    const tk = toks[i];
    if (/^[a-zA-Z]$/.test(tk)) {
      cmd = tk; i++;
      if (cmd === 'z') { len += Math.hypot(x - sx, y - sy); x = sx; y = sy; }
      continue;
    }
    if (cmd === 'm') { x += +toks[i]; y += +toks[i + 1]; i += 2; sx = x; sy = y; upd(x, y); cmd = 'l'; continue; }
    if (cmd === 'l') { const nx = x + +toks[i], ny = y + +toks[i + 1]; len += Math.hypot(nx - x, ny - y); x = nx; y = ny; i += 2; upd(x, y); continue; }
    if (cmd === 'c') {
      const x1 = x + +toks[i], y1 = y + +toks[i + 1], x2 = x + +toks[i + 2], y2 = y + +toks[i + 3], x3 = x + +toks[i + 4], y3 = y + +toks[i + 5];
      let px = x, py = y;
      for (let s = 1; s <= 24; s++) {
        const t = s / 24, mt = 1 - t;
        const bx = mt * mt * mt * x + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
        const by = mt * mt * mt * y + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
        len += Math.hypot(bx - px, by - py); px = bx; py = by; upd(bx, by);
      }
      x = x3; y = y3; i += 6; continue;
    }
    throw new Error('unsupported path command ' + cmd);
  }
  return { minx, maxx, miny, maxy, len };
}

// ---- assemble -----------------------------------------------------------------
const K = 21.2; // TTF units per JSON unit (cap height 783 / 36.9 u; verified across N H a o l g)
const BASELINE = 15.5; // glyph-space baseline is y = −15.5
const SW = 2.4; // stroke width the overlay draws with, in JSON units (≈ 0.05em, see overlay.ts strokeUnits)
const MIN_FIT = 6; // a centerline extent (units) below this is too small to fit: keep scale 1 in that axis
const font = JSON.parse(readFileSync(VARA, 'utf8'));
const out = { upm: unitsPerEm / K, baseline: BASELINE, ascent: ascender / unitsPerEm, glyphs: {} };
const descReport = [];
const fitReport = [];
for (const key of Object.keys(font.c)) {
  const g = font.c[key];
  const boxes = g.paths.map(trace);
  const minx = Math.min(...boxes.map((bb) => bb.minx));
  const maxx = Math.max(...boxes.map((bb) => bb.maxx));
  const miny = Math.min(...boxes.map((bb) => bb.miny));
  const maxy = Math.max(...boxes.map((bb) => bb.maxy));
  const m = glyphMetrics(+key);
  const ch = String.fromCharCode(+key);

  // affine fit of the centerline bbox onto the outline bbox inset by SW/2
  let kx = 1, ox = m.xMin / K - minx; // default: ink left edge on the TTF left side bearing
  const sW = maxx - minx, tW = (m.xMax - m.xMin) / K - SW;
  if (sW >= MIN_FIT && tW > 0) {
    kx = Math.min(1.1, Math.max(0.8, tW / sW));
    ox = m.xMin / K + SW / 2 - minx * kx;
  }
  let ky = 1, oy = BASELINE; // default: glyph y = −15.5 on the baseline
  const sH = maxy - miny, tH = (m.yMax - m.yMin) / K - SW;
  if (sH >= MIN_FIT && tH > 0) {
    ky = Math.min(1.1, Math.max(0.8, tH / sH));
    // TTF yMax (y-up from the baseline) becomes the centerline top (+SW/2 below it)
    oy = -(m.yMax / K - SW / 2) - miny * ky;
  }
  fitReport.push({ ch, kx: +kx.toFixed(3), ky: +ky.toFixed(3) });
  if (m.yMin < -40) descReport.push({ ch, ttf: +(-m.yMin / K).toFixed(1), strokes: +(oy + maxy * ky).toFixed(1) });
  out.glyphs[ch] = {
    ink: [+minx.toFixed(2), +maxx.toFixed(2)],
    lsb: +(m.xMin / K).toFixed(2),
    adv: +(m.adv / K).toFixed(2),
    dsc: +Math.max(0, oy + maxy * ky).toFixed(1),
    fit: [+kx.toFixed(4), +ky.toFixed(4), +ox.toFixed(2), +oy.toFixed(2)],
    paths: g.paths.map((p, i) => ({ d: p.d, mx: +p.mx.toFixed(2), my: +p.my.toFixed(2), len: +boxes[i].len.toFixed(1) })),
  };
}
writeFileSync(OUT, JSON.stringify(out));
console.log(`wrote ${path.relative(root, OUT)} (${statSync(OUT).size} bytes, ${Object.keys(out.glyphs).length} glyphs)`);
console.log(`upm=${out.upm.toFixed(2)} baseline=${out.baseline} ascent=${out.ascent.toFixed(4)}`);
const fitted = fitReport.filter((f) => f.kx !== 1 || f.ky !== 1);
const mean = (k) => (fitted.reduce((a, f) => a + f[k], 0) / fitted.length).toFixed(3);
console.log(`fit: ${fitted.length}/${fitReport.length} glyphs scaled, mean kx=${mean('kx')} ky=${mean('ky')}`);
if (process.argv.includes('--report')) {
  console.log('descenders (units below baseline): TTF vs strokes (after fit)');
  console.table(descReport);
  console.table(fitReport);
}
