import { useId } from 'react';
import type { ColumnOrder } from '../../data/goal';

/**
 * Line-art elevations of the three classical orders, used as the pillar under
 * each theme on the Goal page. All three are drawn in one local space with their
 * abaci at y = 0, so they sit under a single entablature however tall their
 * capitals are — and Corinthian capitals really are twice the height of Doric.
 */

/** Local drawing space for a single column. */
export const COLUMN_W = 200;
export const COLUMN_H = 180;

const CX = COLUMN_W / 2;

/** The light sits above and to the left, so the lit face of every drum is the left one. */
const LIGHT = -0.6;

/** Half-Lambert: the shaded side falls off without ever going fully black. */
const shade = (theta: number) => 0.5 + 0.5 * Math.cos(theta - LIGHT);

/** Masses are filled so that leaves and mouldings occlude what sits behind them. */
const MASS = 'var(--plate-mass)';

interface ShaftSpec {
  top: number;
  rTop: number;
  rBot: number;
  flutes: number;
}

/**
 * Flutes are cut at even angles around the shaft, so in elevation they bunch
 * toward the silhouette — that projection is what reads as roundness. Each
 * arris is then shaded by how far its face has turned away from the light.
 */
const arrises = ({ top, rTop, rBot, flutes }: ShaftSpec) =>
  Array.from({ length: flutes - 1 }, (_, i) => {
    const theta = -Math.PI / 2 + (Math.PI * (i + 1)) / flutes;
    const sin = Math.sin(theta);
    const lit = shade(theta);
    return {
      key: i,
      x1: CX + rTop * sin,
      y1: top,
      x2: CX + rBot * sin,
      y2: COLUMN_H,
      opacity: 0.36 + 0.44 * lit ** 1.1,
      width: 0.6 + 0.35 * lit,
    };
  });

/** A logarithmic spiral drawn as a polyline — the Ionic volute and its helices. */
const spiral = (cx: number, cy: number, r0: number, rEnd: number, turns: number, dir: 1 | -1) => {
  const total = turns * 2 * Math.PI;
  const k = Math.log(rEnd / r0) / total;
  const steps = 110;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * total;
    const rad = r0 * Math.exp(k * t);
    // Start at the top of the eye and wind inward, away from the abacus.
    const a = dir * t - Math.PI / 2;
    points.push(`${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
};

/**
 * An acanthus leaf: one broad lobed silhouette rather than separate leaflets,
 * which is how carved acanthus actually reads in elevation — a mass, not a
 * sprig. Veins fan from the base to each lobe, and the notches between lobes
 * are drilled out as eyes.
 */
const LOBES = [
  { out: [0.45, 0.01, 0.86, 0.05, 1.0, 0.2], back: [0.9, 0.19, 0.73, 0.2, 0.63, 0.31] },
  { out: [0.81, 0.37, 0.89, 0.49, 0.73, 0.6], back: [0.63, 0.57, 0.5, 0.58, 0.41, 0.67] },
  { out: [0.55, 0.75, 0.46, 0.87, 0.25, 0.94], back: [0.17, 0.96, 0.07, 0.98, 0, 1] },
];

/** Half a leaf, open at the midline: a fill closes it there, a stroke does not. */
const leafHalf = (w: number, h: number) => {
  const x = w / 2;
  const seg = (c: number[]) =>
    `C ${(-c[0] * x).toFixed(2)} ${(-c[1] * h).toFixed(2)} ${(-c[2] * x).toFixed(2)} ${(-c[3] * h).toFixed(2)} ${(-c[4] * x).toFixed(2)} ${(-c[5] * h).toFixed(2)}`;
  return `M 0 0 ${LOBES.map(({ out, back }) => `${seg(out)} ${seg(back)}`).join(' ')}`;
};

interface LeafProps {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
}

const Acanthus = ({ x, y, w, h, opacity = 0.7 }: LeafProps) => {
  const half = leafHalf(w, h);
  const hx = w / 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={half} fill={MASS} strokeOpacity={opacity} />
      <path d={half} fill={MASS} strokeOpacity={opacity * 0.82} transform="scale(-1 1)" />
      {([-1, 1] as const).map((side) => (
        <g key={side} strokeOpacity={opacity * (side === -1 ? 0.5 : 0.4)}>
          {/* A vein to each lobe, and the eye drilled at the notch below it */}
          {LOBES.map(({ out, back }, i) => (
            <g key={i}>
              <path
                d={`M 0 ${(-0.04 * h).toFixed(2)} Q ${(side * out[2] * hx * 0.55).toFixed(2)} ${(-out[3] * h - 0.06 * h).toFixed(2)} ${(side * out[4] * hx * 0.86).toFixed(2)} ${(-out[5] * h * 0.92).toFixed(2)}`}
              />
              {i < LOBES.length - 1 && (
                <circle
                  cx={(side * back[4] * hx * 0.9).toFixed(2)}
                  cy={(-back[5] * h).toFixed(2)}
                  r={Math.max(0.8, h * 0.035)}
                />
              )}
            </g>
          ))}
        </g>
      ))}
      {/* Midrib */}
      <path
        d={`M 0 ${(-0.04 * h).toFixed(2)} C ${(0.05 * w).toFixed(2)} ${(-0.4 * h).toFixed(2)} ${(-0.04 * w).toFixed(2)} ${(-0.72 * h).toFixed(2)} 0 ${(-h).toFixed(2)}`}
        strokeOpacity={opacity * 0.55}
      />
    </g>
  );
};

const Shaft = ({ spec, fillId, maskId }: { spec: ShaftSpec; fillId: string; maskId: string }) => {
  const { top, rTop, rBot } = spec;
  return (
    <g mask={`url(#${maskId})`}>
      <path
        d={`M ${CX - rTop} ${top} L ${CX + rTop} ${top} L ${CX + rBot} ${COLUMN_H} L ${CX - rBot} ${COLUMN_H} Z`}
        fill={`url(#${fillId})`}
        stroke="none"
      />
      {arrises(spec).map(({ key, x1, y1, x2, y2, opacity, width }) => (
        <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={opacity} strokeWidth={width} />
      ))}
      {/* Silhouette: the left edge catches the light, the right falls away. */}
      <line x1={CX - rTop} y1={top} x2={CX - rBot} y2={COLUMN_H} strokeOpacity={0.9} />
      <line x1={CX + rTop} y1={top} x2={CX + rBot} y2={COLUMN_H} strokeOpacity={0.62} />
    </g>
  );
};

/** Plainest of the three: a square abacus over a bare convex echinus. */
const DoricCapital = () => (
  <g>
    <path d={`M ${CX - 56} 16 C ${CX - 56} 25 ${CX - 51} 34 ${CX - 41} 34 L ${CX + 41} 34 C ${CX + 51} 34 ${CX + 56} 25 ${CX + 56} 16 Z`} fill={MASS} stroke="none" />
    <rect x={CX - 56} y={0} width={112} height={16} fill={MASS} strokeOpacity={0.85} />
    <line x1={CX - 56} y1={5} x2={CX + 56} y2={5} strokeOpacity={0.3} />
    <line x1={CX - 52} y1={16} x2={CX + 52} y2={16} strokeOpacity={0.3} />
    {/* Echinus — a short ovolo flaring out from the necking to the abacus */}
    <path d={`M ${CX - 56} 16 C ${CX - 56} 25 ${CX - 51} 34 ${CX - 41} 34`} strokeOpacity={0.85} />
    <path d={`M ${CX + 56} 16 C ${CX + 56} 25 ${CX + 51} 34 ${CX + 41} 34`} strokeOpacity={0.6} />
    <path d={`M ${CX - 50} 17 C ${CX - 50} 24 ${CX - 46} 30 ${CX - 38} 30`} strokeOpacity={0.24} />
    {/* Annulets over the necking */}
    {[34, 38, 42].map((y) => (
      <line key={y} x1={CX - 41} y1={y} x2={CX + 41} y2={y} strokeOpacity={y === 34 ? 0.6 : 0.35} />
    ))}
  </g>
);

/** Two volutes on a cushion, with egg-and-dart read between them. */
const IonicCapital = () => {
  const eyeY = 34;
  const eyeX = 42;
  return (
    <g>
      <rect x={CX - 60} y={0} width={120} height={11} fill={MASS} strokeOpacity={0.8} />
      <line x1={CX - 60} y1={3.5} x2={CX + 60} y2={3.5} strokeOpacity={0.3} />

      {/* Echinus and its egg-and-dart, set back between the volutes */}
      <path d={`M ${CX - 27} 11 C ${CX - 29} 30 ${CX - 22} 44 ${CX - 14} 50 L ${CX + 14} 50 C ${CX + 22} 44 ${CX + 29} 30 ${CX + 27} 11 Z`} fill={MASS} stroke="none" />
      <path d={`M ${CX - 27} 11 C ${CX - 29} 30 ${CX - 22} 44 ${CX - 14} 50`} strokeOpacity={0.4} />
      <path d={`M ${CX + 27} 11 C ${CX + 29} 30 ${CX + 22} 44 ${CX + 14} 50`} strokeOpacity={0.3} />
      {[-16, 0, 16].map((dx) => (
        <g key={dx} transform={`translate(${CX + dx} 28)`}>
          <ellipse rx={7} ry={11} fill={MASS} strokeOpacity={0.5} />
          <ellipse rx={4} ry={7} strokeOpacity={0.3} />
        </g>
      ))}
      {[-8.5, 8.5].map((dx) => (
        <path key={dx} d={`M ${CX + dx} 19 L ${CX + dx} 38 M ${CX + dx - 2.5} 22 L ${CX + dx} 19 L ${CX + dx + 2.5} 22`} strokeOpacity={0.3} />
      ))}

      {/* Volutes — the canalis winds in as a band, not a single line */}
      {([-1, 1] as const).map((side) => {
        const cx = CX + side * eyeX;
        const dir = side === -1 ? 1 : -1;
        const near = side === -1;
        return (
          <g key={side} strokeOpacity={near ? 0.8 : 0.55}>
            <path d={spiral(cx, eyeY, 24, 3.2, 2.5, dir)} />
            <path d={spiral(cx, eyeY, 17, 2.4, 2.5, dir)} strokeOpacity={near ? 0.5 : 0.35} />
            <circle cx={cx} cy={eyeY} r={2.6} fill={MASS} strokeOpacity={0.7} />
          </g>
        );
      })}

      {/* Astragal under the capital */}
      <line x1={CX - 40} y1={54} x2={CX + 40} y2={54} strokeOpacity={0.55} />
      <line x1={CX - 40} y1={58} x2={CX + 40} y2={58} strokeOpacity={0.35} />
    </g>
  );
};

/** Two tiers of acanthus in a bell, corner helices, and a concave abacus. */
const CorinthianCapital = () => (
  <g>
    {/* Kalathos — the bell the leaves are set against */}
    <path
      d={`M ${CX - 40} 104 C ${CX - 46} 76 ${CX - 54} 44 ${CX - 57} 16 L ${CX + 57} 16 C ${CX + 54} 44 ${CX + 46} 76 ${CX + 40} 104 Z`}
      fill={MASS}
      stroke="none"
    />
    <path d={`M ${CX - 40} 104 C ${CX - 46} 76 ${CX - 54} 44 ${CX - 57} 16`} strokeOpacity={0.35} />
    <path d={`M ${CX + 40} 104 C ${CX + 46} 76 ${CX + 54} 44 ${CX + 57} 16`} strokeOpacity={0.25} />

    {/* Corner helices curling up under the abacus */}
    {([-1, 1] as const).map((side) => (
      <path
        key={side}
        d={spiral(CX + side * 49, 33, 13, 2.2, 2, side === -1 ? 1 : -1)}
        strokeOpacity={side === -1 ? 0.6 : 0.42}
      />
    ))}

    {/* Abacus, concave on every face */}
    <path
      d={`M ${CX - 72} 16 L ${CX - 72} 3 Q ${CX} 16 ${CX + 72} 3 L ${CX + 72} 16 Q ${CX} 28 ${CX - 72} 16 Z`}
      fill={MASS}
      strokeOpacity={0.8}
    />
    <path d={`M ${CX - 72} 8 Q ${CX} 21 ${CX + 72} 8`} strokeOpacity={0.28} />

    {/* Fleuron on the centre of the bell */}
    <Acanthus x={CX} y={46} w={30} h={26} opacity={0.55} />

    {/* Upper tier, then the lower tier standing in front of it */}
    <Acanthus x={CX - 36} y={84} w={46} h={42} opacity={0.5} />
    <Acanthus x={CX + 36} y={84} w={46} h={42} opacity={0.4} />
    <Acanthus x={CX} y={86} w={50} h={46} opacity={0.62} />

    <Acanthus x={CX - 42} y={107} w={48} h={34} opacity={0.62} />
    <Acanthus x={CX + 42} y={107} w={48} h={34} opacity={0.46} />
    <Acanthus x={CX} y={108} w={54} h={38} opacity={0.85} />

    {/* Astragal */}
    <line x1={CX - 39} y1={106} x2={CX + 39} y2={106} strokeOpacity={0.5} />
  </g>
);

const ORDERS: Record<ColumnOrder, { Capital: () => React.ReactElement; shaft: ShaftSpec }> = {
  doric: { Capital: DoricCapital, shaft: { top: 44, rTop: 41, rBot: 47, flutes: 20 } },
  ionic: { Capital: IonicCapital, shaft: { top: 58, rTop: 40, rBot: 46, flutes: 24 } },
  corinthian: { Capital: CorinthianCapital, shaft: { top: 106, rTop: 39, rBot: 45, flutes: 24 } },
};

interface ClassicalColumnProps {
  order: ColumnOrder;
  /** Offset in the parent drawing space. */
  x?: number;
}

/**
 * Renders one column as a `<g>`, so several can share a single `<svg>` and one
 * entablature. Colour comes from `currentColor`, which lets the parent light a
 * column up without touching any of the geometry.
 */
const ClassicalColumn = ({ order, x = 0 }: ClassicalColumnProps) => {
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const fillId = `shaft-${uid}`;
  const maskId = `fade-${uid}`;
  const { Capital, shaft } = ORDERS[order];

  return (
    <g transform={`translate(${x} 0)`} fill="none" stroke="currentColor" strokeWidth={1}>
      <defs>
        {/* A cylinder lit from the left: the highlight sits off-centre. */}
        <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: 'var(--plate-shaft-dark)' }} />
          <stop offset="26%" style={{ stopColor: 'var(--plate-shaft-lit)' }} />
          <stop offset="60%" style={{ stopColor: 'var(--plate-shaft-mid)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--plate-shaft-edge)' }} />
        </linearGradient>
        {/* The shaft runs off the bottom of the plate rather than being cut. */}
        <linearGradient id={`${maskId}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="62%" stopColor="#fff" />
          <stop offset="94%" stopColor="#000" />
        </linearGradient>
        <mask id={maskId}>
          <rect x={0} y={shaft.top} width={COLUMN_W} height={COLUMN_H - shaft.top} fill={`url(#${maskId}-g)`} />
        </mask>
      </defs>

      <Shaft spec={shaft} fillId={fillId} maskId={maskId} />
      <Capital />
    </g>
  );
};

export default ClassicalColumn;
