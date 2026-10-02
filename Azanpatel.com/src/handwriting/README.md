# Handwriting: pencil-on-paper text

The site is set in one self-hosted face, **Shadows Into Light** (`public/fonts/*.woff2`,
OFL). Stroke-ordered glyph data for that exact face (Vara, MIT — `vendor/`, next to the OFL TTF the build script reads) lets us
draw text stroke by stroke *on top of the real text*, then crossfade to the webfont.
The browser does all layout; the overlay never shifts anything.

```
scripts/build-stroke-font.mjs   vendor/*.vara.json + vendor/ShadowsIntoLight.ttf (build input only, not deployed)
                                 -> sil-strokes.json  (npm run fonts:strokes; committed)
                                 incl. a per-glyph affine `fit` onto the TTF outline bbox
overlay.ts   Range-measures every character, places <g>/<path> per glyph/stroke, timing model
Hand.tsx     the component: observe -> enqueue -> build overlay -> draw -> hand-off -> unmount SVG
InkText.tsx  word-wise clip-path reveal (no strokes) for text the overlay cannot trace
queue.ts     one ordered cascade timeline per group (hero/nav/footer), observer.ts shared IntersectionObserver, env.ts gates
limiter.ts   page-wide budget on live overlays (blocks + summed paths, per device tier in env.ts `pathBudget`)
```

## `<Hand>` — stroke-drawn text

```tsx
import Hand from '../handwriting/Hand';

<Hand as="h2" roughSm className="text-3xl text-text leading-snug">{title}</Hand>
<Hand as="p" className="mt-4 text-text-muted">{description}</Hand>
<Hand className="label">{label}</Hand>                      {/* as="span" (inline-block) */}
<Hand as="div" className="flex items-baseline gap-4">       {/* one pen pass per row */}
  <span className="text-accent">{amount}</span>
  <span>{title}</span>
</Hand>
<a href="#contact" className="btn btn-ghost"><Hand group="hero">Get in touch</Hand></a>
```

| prop | default | meaning |
| --- | --- | --- |
| `as` | `'span'` | element to render. `span/a/em/strong/small` become `inline-block`; everything else keeps its display. |
| `className` | | normal Tailwind classes (colour, size, `uppercase`, tracking, …) — all honoured, including per-child colours. |
| `rough` | `false` | `.hw-rough`: displacement + grain filter. **Only for ≥ 44px headings** (hero h1, ProjectDetail h1). |
| `roughSm` | `false` | `.hw-rough-sm`: lighter filter for 28–40px headings (SectionHeader h2). |
| `animate` | `true` | `false` renders plain text (never hidden, no overlay). |
| `once` | `true` | `false` replays each time the block re-enters the viewport. |
| `memo` | | a key; a block whose key has already finished drawing in this page lifetime renders plain. Use it for chrome that remounts on every route (the header: `memo="nav:/projects"`). |
| `group` | | blocks with the same group draw in document order, cascaded (next starts when the previous is ~40 % done, 120–600 ms apart). Hero uses `"hero"`, header `"nav"`, footer `"footer"`, each SectionHeader `"section:<label>"` (its paragraph follows its heading). Leave unset elsewhere. |
| `budget` | `2000` | group only: the blocks visible together start within this many ms (the header passes `700` so the nav is readable within a second). After a scroll the remainder is re-spread within 900 ms regardless. |
| `delay` | `0` | extra ms before this block starts. |
| `speed` | `0.9` | pen speed, px/ms. |
| `maxLine` | `1000` | cap per line (ms); small text is capped proportionally lower (10px ≈ half). |
| `lineOverlap` | `0.1` | lines are written top to bottom by one pen; the next line starts when the current one is `1 − lineOverlap` (90 %) through. `0` = strictly one after another. Keep it low: two lines being written at once breaks the single-pen illusion. |

`data-hw-host=""` on a box that is *not* itself a Hand (the Awards card, the `AP` logo
squares) makes its rules fade in with its first Hand child's first stroke: the first
animating child marks the host `pending` on mount (so reduced-motion / print never hide a
border) and `drawing` when it starts; `[data-hw-host='pending'] *` has transparent borders.
The border transition exists only from `drawing` on — a transition on the initial `""`
state would paint the rules at full colour and fade them *out* at first paint.

Behaviour: the block's text is hidden (`-webkit-text-fill-color: transparent`, so `color`
and `currentColor` are untouched; the block's *own* border and background and a `.btn`
around it fade in with the first stroke so an unwritten block is blank paper, not an empty
box) from first
paint until it is drawn. On first intersection (`rootMargin 0`, threshold 0 — never a
negative margin, hidden text must start as soon as any of it is on screen) the block claims
its group slot synchronously, then waits for the font (`fonts.load` with the block's own
text, so a latin-ext character fetches its face before measuring). Every character is
measured with a Range and a stroke glyph is placed on it (uppercase via `text-transform`
is honoured; `’ “ ” — – … · → ← ©` are substituted; anything else gets a 40 ms pen-up and
simply appears at the hand-off). Each glyph is ONE `<path>` whose subpaths are its strokes
in recorded order (one dash animation per glyph, the pen-lifts folded into its duration).
The SVG is attached only when the block's turn comes — and only when the page-wide
limiter grants a slot (`limiter.ts`: at most N drawing blocks / M live paths per device
tier, topmost in-view waiter first — a group member is exempt from the block cap, not from
the path budget, so a page header is not queued behind the card blocks that intersected with
it; a block whose turn comes after it scrolled away is
revealed plainly) — so a queued block costs nothing until then, and a width change while
it waits just re-measures it (a width change while *drawing* reveals the text immediately).
The strokes animate left to right in writing order via `stroke-dashoffset`, line after line
(`lineOverlap`). They are drawn with the text's computed colour (re-read on a `color`
`transitionend` of the block or its link, so a hover mid-write does not jump at the
hand-off). When the last stroke ends the hand-off is one 160 ms cross-dissolve, no blend
mode: the webfont's `color` animates from transparent to each element's own colour
(`@keyframes hw-fillin`, no `to` frame — Chromium does not interpolate
`-webkit-text-fill-color`) while the strokes' opacity follows `hw-inkout`, the curve that
keeps the summed ink coverage of two coinciding same-colour layers constant
(`a = 1 − (1−α)/(1−bα)`; a linear dissolve dips lighter, a sequential fade or a multiply
blend flashes darker). Inline `<svg>` icons are excluded from the fill-in (they are never
hidden: `stroke="currentColor"` ignores text-fill). Then the SVG is removed. Steady state
is plain selectable text with no extra DOM.

Group cascade (`queue.ts`) is one ordered timeline per group: every flush takes all members
that have not started yet (new and already waiting), sorts them by document position and
re-assigns starts from the cursor, so nothing can start before an in-view block above it.
The first batch spreads over at most `budget` (2 s); once the cascade runs, the remainder
visible after a scroll is re-spread within 900 ms (500 ms on coarse pointers); a newcomer waits at most 400 ms *from
its arrival* for the block being written (blocks that arrived with that block keep the
designed lead), and not at all if that block has left the viewport; members that scrolled
off before their turn start at once and take no slot; when a member actually starts later
than scheduled (the page-wide limiter made it wait) the members after it are shifted by that
delay, so the cascade keeps its leads instead of being granted all at once when slots free;
everything resets when the group's last live member finishes or unmounts, so a route change
never inherits a stale schedule.

Safety built in: `prefers-reduced-motion`, `forced-colors`, `navigator.connection.saveData`,
print and a missing `IntersectionObserver` render plain text (`shouldAnimate()` in `env.ts`);
if the face has not loaded within 5 s the block is revealed plainly instead of being traced
against the fallback font; keyboard focus into a pending block *or onto the link/button
around it* reveals it; `beforeprint` ends the cycle (overlay removed, no replay); a width
change while drawing reveals immediately (while waiting it re-measures); a 5 s watchdog reveals if the observer never
reports; the per-block completion watchdog checks the last stroke's `playState` and gives
throttled animations one extra period before forcing the crossfade.
`data-hw="pending|drawing|fading|done|idle"` on the wrapper is handy for tests. A `memo`
block unmounted mid-write (route change during the header cascade) counts as written.

Timing: per line, `max(raw, minLine·k)` capped at `maxLine·k` with `k = clamp(fs/20, .5, 1)`,
so an 11.5px chip is written in ~230 ms rather than stretched to a headline's 400 ms floor.

### Rules
1. **Wrap the element that owns the text, keep children real.** Links, accent spans,
   `<br>`, nested spans with different colours/sizes are fine *inside* a Hand. Never wrap a
   span that sits in the middle of a sentence — wrap the paragraph.
2. **One Hand per visual block or row** (a heading, a paragraph, a label, a flex row such
   as an award line). Don't nest Hands. Don't wrap whole cards or grids.
3. **Never on hidden/toggled or clipped content**: the mobile menu, accordions, tabs,
   anything under `display:none`, and `line-clamp`'d text (clipped lines would still be
   scheduled and the clamp ellipsis isn't in the DOM). Use `InkText` there. A block that is
   `display:none` only on some viewports (the `hidden md:flex` desktop nav) should render
   plain text there (the header gates it on `matchMedia('(min-width: 768px)')`).
4. **Don't put `rough`/`roughSm` on body-size text** — a 1–2 px displacement blurs small
   letters. The alpha-over-grain treatment already reads as pencil. Settled text gets the
   light filter (`#pencil-edge-sm`) on every device (a static raster, applied once the text
   is visible — a pending heading carries no filter); only
   `(pointer: fine) and (min-width: 768px)` also runs it while the strokes animate and uses
   the full-strength `#pencil-edge` for `rough`. `prefers-contrast: more` / `forced-colors`
   drop it.
5. **No italics / synthetic bold**: the face has one upright weight and the strokes are
   upright; `italic`/`font-medium` are neutralised globally in `index.css`.
6. **Copy is untouched**: Hand changes no text. Keep `&rsquo;`, `&hellip;`, `—` etc.
7. **Ligatures stay off** (`font-variant-ligatures: none` on body) so one character = one glyph rect.
8. Content must be in the DOM at mount with its final text (Hand measures live rects at
   trigger time; text swapped later is not re-traced).
9. `group` is for a deliberate top-to-bottom sequence (hero, header, footer). Cards in a grid
   should stay independent (they start as they intersect).
10. Chrome that remounts on every route (the header) takes `memo` so it is written once per
    visit, and nothing inside a toggled container (mobile menu) is wrapped (rule 3).

## `<InkText>` — pen reveal without strokes

```tsx
import InkText from '../handwriting/InkText';

<InkText as="p" className="text-sm text-text-muted line-clamp-2">{project.description}</InkText>
```

Props: `as`, `className`, `perChar` (45 ms), `minWord` (120 ms), `cap` (2400 ms), `delay`.
ProjectDetailPage switches a body paragraph to InkText above 350 characters (≈ 300 paths at
phone widths — more than that started in one frame is a visible hitch on a low-tier phone).
Children must be plain text (string/number or an array of them — no markup). Each word is
wrapped in a span whose `clip-path` wipes left-to-right with cumulative delays, so the
block reads as being written at pen speed; there is no layout shift and the spans are
removed afterwards. While pending/inking the block's own paint is transparent and only the
word spans paint, so a `line-clamp` ellipsis appears with the last word, not before it.
Same intersection trigger and reduced-motion/watchdog escapes as Hand; keyboard focus
reveals it while pending *or* inking. Use it for: `line-clamp` card descriptions, very long paragraphs (internship
write-ups), text inside toggled containers (mobile menu), and anything non-Latin.

## Styling reference

* Paper: `html`/`body` in `src/index.css` (two tiled feTurbulence data-URI layers + top
  vignette). `body` has `overflow-x: clip`: a block that overflows sideways would widen the
  page and a Hand pushed off screen would never intersect (the footer nav also wraps). Cards use translucent graphite washes (`bg-ink-surface` =
  `rgb(42 42 48 / .035)`) so the grain stays visible through them.
* Graphite text tokens compose alpha from CSS custom properties (`--graphite`, `--ink-a`
  .86, `--ink-a-muted` .76, `--ink-a-subtle` .70 in `index.css :root`): `text-text/50` =
  .86 × .5. These alphas are the WCAG floor on the card wash (7.7 / 5.7 / 4.8 : 1) — keep
  the pencil look lighter via the paper, never via lighter ink. `prefers-contrast: more`
  overrides the variables (solid, darker graphite) so every slash-opacity variant follows.
  Accent is `--accent` (166 75 7 ≈ 4.7:1 on cards). Solid paper tones exist as `paper`,
  `paper-surface`, `paper-raised` when a flat fill is needed.
* Small type: the face is light, so the smallest tiers are `text-[10.5px]` / `text-[11.5px]`
  / `text-[12px]` (never 9–11 px). Every ≤ 13px tier (`.label .nav-link .btn .tag .text-xs`
  and the `text-[10.5|11.5|12|13px]` classes) gets the 0.5px graphite bloom and raised ink
  floors (`--ink-a-muted-sm` .84, `--ink-a-subtle-sm` .80, `--accent-sm`): at 1x DPI the
  antialiased single-weight face never reaches its nominal colour, and the darkest rendered
  pixel of 11.5px captions measured ~3.5:1 at the body alphas (now ≥ 5.8:1).
* `.hw` positioning is `:where(.hw)` (zero specificity): a Hand that carries `absolute`
  (card badges) or `transition-colors` keeps them.
* Filters live in `src/components/ui/PencilDefs.tsx` (mounted once in `Layout`).
* Small lettering (`.label`, `.nav-link`, `.btn`, `.tag` — the card chips carry `tag`) gets a 0.5px graphite bloom.

## Regenerating stroke data

`npm run fonts:strokes` (pass `--report` for the per-glyph fit and descender tables). Keep
`upm ≈ 48.3`, `baseline 15.5`, `ascent 1.175`. The Vara centerlines were traced to the
outline's *bounding box*, so once the ~0.05em round-capped stroke is added they come out
~8 % larger than the webfont in both axes (measured: caps top +1.3 u, bottom −1.5 u,
widths +9 %) — the visible "double image" at the hand-off. The build therefore emits a
per-glyph affine `fit = [kx, ky, ox, oy]` that maps the centerline bbox, inset by half a
stroke, onto the TTF glyf bbox; `overlay.ts` places glyphs with it and compensates the
stroke width (`/ sqrt(kx·ky)`). Measured after the fit: stroke vs webfont ink extents agree
within ±0.33 px on the 64 px hero h1 (IoU .53 → .70; the rest is Vara's shape
approximation). Glyphs too small to fit in an axis (`.` `-` `|`) keep scale 1 there.
