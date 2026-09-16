import { useId } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import useInView from '../../hooks/useInView';
import useReducedMotion from '../../hooks/useReducedMotion';
import { ArrowRight } from '../ui/Icon';

/** Entrance order: label, headline, italic line, paragraph, buttons, then the photo. */
const STEP = 90;

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 border-b border-ink-line overflow-hidden">
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="relative lg:col-span-7">
            <TracePlate />

            <div className="relative">
              <Reveal delay={0} className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 bg-accent" />
                <span className="label">Translational Neuroengineering</span>
              </Reveal>

              <Reveal delay={STEP}>
                <h1 className="text-[clamp(2rem,10vw,3.5rem)] sm:text-6xl xl:text-7xl font-medium leading-[1.05] tracking-tight text-text">
                  Neuroengineering
                </h1>
              </Reveal>

              <Reveal delay={STEP * 2}>
                <p className="mt-6 text-text-muted/90 text-base sm:text-lg italic max-w-xl leading-relaxed">
                  I&rsquo;m obsessed with brain-machine interfaces, neuroplasticity, and enhancing human experience.
                </p>
              </Reveal>

              <Reveal delay={STEP * 3}>
                <p className="mt-6 text-text-muted text-lg max-w-xl leading-relaxed">
                  I'm Azan Patel &mdash; solving real clinical problems focused on the brain,
                  leveraging closed-loop neuromodulatory techniques, computational modeling, and
                  hardware engineering to better understand and treat stroke, Alzheimer's, and
                  neuropsychiatric disorders.
                </p>
              </Reveal>

              <Reveal delay={STEP * 4} className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link to="/goal" className="btn btn-primary arrow-nudge">
                  The Goal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a href="#contact" className="btn btn-ghost">
                  Get in touch
                </a>
              </Reveal>
            </div>
          </div>

          <Reveal delay={STEP * 5} className="lg:col-span-5 max-w-sm sm:max-w-md lg:max-w-none">
            <figure className="group relative border border-ink-line bg-ink-surface">
              <Tick className="-top-1.5 -left-1.5" />
              <Tick className="-top-1.5 -right-1.5" />
              <Tick className="-bottom-1.5 -left-1.5" />
              <Tick className="-bottom-1.5 -right-1.5" />

              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/Azan.jpg"
                  alt="Azan Patel"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.65,0.2,1)] motion-safe:group-hover:scale-[1.02]"
                />
              </div>

              <figcaption className="border-t border-ink-line px-4 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                <span className="transition-colors duration-300 group-hover:text-accent">AP—001</span>
                <span>UC Davis · 2027</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <ScrollCue />
      </div>
    </section>
  );
};

const Tick = ({ className = '' }: { className?: string }) => (
  <span aria-hidden="true" className={`absolute w-3 h-3 border border-text-muted ${className}`} />
);

/* ---- Figure: a simulated EEG trace on a blueprint grid ------------------- */

const FIG_W = 640;
const FIG_H = 660;
const CELL = 32;

/** Where the strip chart sits on the plate. */
const TRACE = { x0: 16, x1: 612, y: 636, samples: 224 };

/** Two epileptiform spikes: a sharp deflection and the slow wave that follows it. */
const SPIKES = [
  { at: 0.68, up: 48, down: 12 },
  { at: 0.88, up: 34, down: 9 },
];

/** Mulberry32 — a tiny seeded PRNG so the trace is identical on every render. */
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildTrace = () => {
  const rand = mulberry32(2027);
  const { x0, x1, y, samples } = TRACE;
  const step = (x1 - x0) / (samples - 1);
  const points = Array.from({ length: samples }, (_, i) => {
    const t = i / (samples - 1);
    // Two rhythms beating against each other, plus a little noise.
    let v =
      6 * Math.sin(t * Math.PI * 2 * 11) +
      3.5 * Math.sin(t * Math.PI * 2 * 4.3 + 1.2) +
      (rand() - 0.5) * 5;
    for (const s of SPIKES) {
      const d = (t - s.at) * samples;
      v -= s.up * Math.exp(-(d * d) / 1.6);
      v += s.down * Math.exp(-((d - 5) * (d - 5)) / 14);
    }
    return { x: x0 + i * step, y: y + v };
  });

  // The apex of each spike, for the markers and the dimension bracket.
  const apexes = SPIKES.map((s) => {
    const centre = Math.round(s.at * (samples - 1));
    const window = points.slice(centre - 3, centre + 4);
    return window.reduce((top, p) => (p.y < top.y ? p : top), window[0]);
  });

  const d = `M ${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;
  return { d, apexes };
};

const { d: TRACE_D, apexes: APEXES } = buildTrace();

/** The dimension bracket runs between the two spikes, above the taller one. */
const BRACKET_Y = Math.min(...APEXES.map((a) => a.y)) - 20;

const REGISTRATION = [
  [12, 12],
  [FIG_W - 12, 12],
  [12, FIG_H - 12],
  [FIG_W - 12, FIG_H - 12],
] as const;

const DRAW_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * Sits behind the hero copy on wide screens: a blueprint grid with one strip
 * of simulated EEG that draws itself in on load. Purely decorative, so it is
 * hidden from assistive tech and from phones, where it would crowd the text.
 *
 * The draw is driven by inline styles rather than the shared `[data-draw]`
 * rules: Chrome does not re-style descendants for the `[pathLength]` attribute
 * selector when the ancestor's attribute flips, so those rules only take once
 * something else happens to recalc the subtree.
 */
const TracePlate = () => {
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const gridId = `grid-${uid}`;
  const majorId = `grid-major-${uid}`;
  const maskId = `fade-${uid}`;
  const [ref, inView] = useInView<SVGSVGElement>({ threshold: 0.1 });
  const reduced = useReducedMotion();
  const { x0, x1, y } = TRACE;
  const [a, b] = APEXES;

  const labelStyle: CSSProperties = {
    opacity: inView ? 1 : 0,
    transition: reduced ? 'none' : 'opacity 0.6s ease 1.1s',
  };

  /** Every stroke carries pathLength=1, so a dash of 1 offset by 1 hides it until it is drawn. */
  const draw = (delay: number): CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: inView ? 0 : 1,
    transition: reduced ? 'none' : `stroke-dashoffset 1.6s ${DRAW_EASE} ${delay}ms`,
  });

  return (
    <Reveal
      fadeOnly
      aria-hidden="true"
      className="hidden lg:block absolute -inset-x-10 -top-16 -bottom-16 pointer-events-none select-none"
    >
      <svg
        ref={ref}
        viewBox={`0 0 ${FIG_W} ${FIG_H}`}
        preserveAspectRatio="xMidYMax meet"
        className="w-full h-full text-text-subtle"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="square"
      >
        <defs>
          <pattern id={gridId} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <path d={`M ${CELL} 0 H 0 V ${CELL}`} stroke="rgb(var(--ink-line))" strokeOpacity={0.9} />
          </pattern>
          <pattern id={majorId} width={CELL * 5} height={CELL * 5} patternUnits="userSpaceOnUse">
            <path d={`M ${CELL * 5} 0 H 0 V ${CELL * 5}`} stroke="rgb(var(--ink-edge))" strokeOpacity={0.55} />
          </pattern>
          {/* The grid is densest around the trace and dissolves under the headline. */}
          <radialGradient id={`${maskId}-g`} cx="0.5" cy="0.84" r="0.8">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.45" stopColor="#fff" stopOpacity={0.85} />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={maskId}>
            <rect width={FIG_W} height={FIG_H} fill={`url(#${maskId}-g)`} />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          <rect width={FIG_W} height={FIG_H} fill={`url(#${gridId})`} stroke="none" />
          <rect width={FIG_W} height={FIG_H} fill={`url(#${majorId})`} stroke="none" />
        </g>

        {/* Registration marks at the plate corners */}
        <g strokeOpacity={0.45}>
          {REGISTRATION.map(([cx, cy]) => (
            <path pathLength={1} key={`${cx}-${cy}`} style={draw(0)} d={`M ${cx - 5} ${cy} H ${cx + 5} M ${cx} ${cy - 5} V ${cy + 5}`} />
          ))}
        </g>

        {/* Axes: time along the bottom, amplitude up the left */}
        <g strokeOpacity={0.4}>
          <line pathLength={1} style={draw(120)} x1={x0} y1={y} x2={x1} y2={y} />
          <line pathLength={1} style={draw(120)} x1={x0} y1={y - 72} x2={x0} y2={y + 14} />
          {[-60, -40, -20].map((dy) => (
            <line pathLength={1} style={draw(400)} key={dy} x1={x0 - 4} y1={y + dy} x2={x0} y2={y + dy} />
          ))}
          {Array.from({ length: 8 }, (_, i) => x0 + ((i + 1) * (x1 - x0)) / 8).map((tx) => (
            <line pathLength={1} style={draw(400)} key={tx} x1={tx} y1={y} x2={tx} y2={y + 4} />
          ))}
        </g>

        {/* The trace itself */}
        <path
          pathLength={1}
          style={draw(320)}
          d={TRACE_D}
          strokeOpacity={0.45}
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dimension bracket between the two spikes, with extension lines to each apex */}
        <g strokeOpacity={0.4}>
          {/* Dashed extension lines fade in with the labels; a dash pattern cannot also draw. */}
          <line style={labelStyle} x1={a.x} y1={a.y - 6} x2={a.x} y2={BRACKET_Y - 6} strokeDasharray="2 3" />
          <line style={labelStyle} x1={b.x} y1={b.y - 6} x2={b.x} y2={BRACKET_Y - 6} strokeDasharray="2 3" />
          <line pathLength={1} style={draw(1400)} x1={a.x} y1={BRACKET_Y} x2={b.x} y2={BRACKET_Y} />
          <line pathLength={1} style={draw(1500)} x1={a.x} y1={BRACKET_Y - 4} x2={a.x} y2={BRACKET_Y + 4} />
          <line pathLength={1} style={draw(1500)} x1={b.x} y1={BRACKET_Y - 4} x2={b.x} y2={BRACKET_Y + 4} />
        </g>

        {/* Spike apexes, picked out in the accent */}
        <g className="text-accent" fill="currentColor" stroke="none" style={labelStyle}>
          <rect x={a.x - 1.5} y={a.y - 1.5} width={3} height={3} fillOpacity={0.9} />
          <rect x={b.x - 1.5} y={b.y - 1.5} width={3} height={3} fillOpacity={0.9} />
        </g>

        {/* Labels */}
        <g
          className="font-mono"
          fill="currentColor"
          fillOpacity={0.6}
          stroke="none"
          fontSize={9}
          letterSpacing="0.16em"
          style={labelStyle}
        >
          <text x={x0} y={y - 80} textAnchor="middle">µV</text>
          <text x={x1 + 10} y={y + 3}>t</text>
          <text x={(a.x + b.x) / 2} y={BRACKET_Y - 7} textAnchor="middle">Δt</text>
          <text x={FIG_W - 26} y={17} textAnchor="end" fontSize={8}>
            FIG. 01 — SIMULATED TRACE
          </text>
        </g>
      </svg>
    </Reveal>
  );
};

/* ---- Scroll cue ---------------------------------------------------------- */

/**
 * "SCROLL" over a 24px hairline whose fill runs slowly downward. The motion is
 * an SVG animate element that is only rendered when the visitor allows motion.
 */
const ScrollCue = () => {
  const reduced = useReducedMotion();
  return (
    <Reveal
      delay={STEP * 7}
      fadeOnly
      className="hidden md:block absolute left-6 sm:left-8 lg:left-12 -bottom-[6.5rem]"
    >
      <a
        href="#goal"
        aria-label="Scroll to the first section"
        className="group inline-flex flex-col items-start gap-2 text-text-subtle hover:text-text transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <svg width="1" height="24" viewBox="0 0 1 24" aria-hidden="true" className="overflow-visible">
          <line x1="0.5" y1="0" x2="0.5" y2="24" stroke="rgb(var(--ink-edge))" />
          <line
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="24"
            stroke="currentColor"
            pathLength={1}
            strokeDasharray="0.4 1"
            strokeDashoffset={reduced ? 1.4 : 0}
          >
            {!reduced && (
              <animate
                attributeName="stroke-dashoffset"
                from="1.4"
                to="0"
                dur="2.6s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.4 0 0.2 1"
              />
            )}
          </line>
        </svg>
      </a>
    </Reveal>
  );
};

export default Hero;
