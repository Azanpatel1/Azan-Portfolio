import { useState } from 'react';
import ClassicalColumn, { COLUMN_H, COLUMN_W } from './ClassicalColumn';
import { GOAL_AIMS, GOAL_AIMS_META, GOAL_SECTIONS } from '../../data/goal';
import type { GoalAim } from '../../data/goal';

/** Three equal bays, so the drawn columns land on the centres of the grid below. */
const BAY = 200;
const PLATE_W = BAY * GOAL_AIMS.length;
const ORDER_NAMES: Record<GoalAim['order'], string> = {
  doric: 'Doric',
  ionic: 'Ionic',
  corinthian: 'Corinthian',
};

interface AimPillarsProps {
  /** Opens the matching row of the journal below. */
  onOpenSection?: (index: string) => void;
}

const AimPillars = ({ onOpenSection }: AimPillarsProps) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section aria-labelledby="aims-heading" className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-xs text-accent tracking-[0.2em]">Ⅰ–Ⅲ</span>
        <span className="label">{GOAL_AIMS_META.label}</span>
        <span className="flex-1 h-px bg-ink-line" />
      </div>

      <h3 id="aims-heading" className="text-2xl sm:text-3xl font-medium text-text max-w-2xl leading-tight">
        {GOAL_AIMS_META.title}
      </h3>
      <p className="mt-4 mb-10 text-text-muted max-w-2xl leading-relaxed">{GOAL_AIMS_META.note}</p>

      <figure className="border border-ink-line bg-ink-surface/50">
        <figcaption className="px-5 py-3 border-b border-ink-line flex items-center justify-between gap-4">
          <span className="label">Plate — the three orders</span>
          <span className="hidden sm:inline font-mono text-[10px] text-text-subtle tracking-[0.2em]">
            ONE AIM PER PILLAR
          </span>
        </figcaption>

        <div className="px-4 sm:px-8 pt-7 pb-3">
          <Entablature active={active !== null} />

          <svg
            viewBox={`0 0 ${PLATE_W} ${COLUMN_H}`}
            className="w-full block -mt-px"
            role="img"
            aria-label={`Three classical columns — ${GOAL_AIMS.map(
              (aim) => `${ORDER_NAMES[aim.order]} for aim ${aim.numeral}, ${aim.discipline}`,
            ).join('; ')} — carrying one entablature.`}
          >
            {GOAL_AIMS.map((aim, i) => (
              <g
                key={aim.index}
                className={`transition-colors duration-500 ${
                  active === null
                    ? 'text-zinc-500'
                    : active === aim.index
                      ? 'text-accent'
                      : 'text-zinc-700'
                }`}
              >
                <ClassicalColumn order={aim.order} x={i * BAY + (BAY - COLUMN_W) / 2} />
                <rect
                  x={i * BAY}
                  y={0}
                  width={BAY}
                  height={COLUMN_H}
                  fill="transparent"
                  aria-hidden="true"
                  onMouseEnter={() => setActive(aim.index)}
                  onMouseLeave={() => setActive((cur) => (cur === aim.index ? null : cur))}
                />
              </g>
            ))}
          </svg>

          {/* Annotations on the stylobate, in the register of an architectural plate. */}
          <div className="grid grid-cols-3 border-t border-ink-line">
            {GOAL_AIMS.map((aim) => (
              <div
                key={aim.index}
                className={`px-2 py-3 text-center transition-colors duration-300 ${
                  active === aim.index ? 'text-accent' : 'text-text-subtle'
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  {ORDER_NAMES[aim.order]}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
                  {aim.discipline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </figure>

      <ol className="grid md:grid-cols-3 border-x border-b border-ink-line divide-y md:divide-y-0 md:divide-x divide-ink-line">
        {GOAL_AIMS.map((aim) => (
          <AimCard
            key={aim.index}
            aim={aim}
            isActive={active === aim.index}
            onEnter={() => setActive(aim.index)}
            onLeave={() => setActive((cur) => (cur === aim.index ? null : cur))}
            onOpenSection={onOpenSection}
          />
        ))}
      </ol>
    </section>
  );
};

/** The load the three pillars carry, drawn as cornice, frieze and architrave. */
const Entablature = ({ active }: { active: boolean }) => (
  <div className="relative">
    {/* Cornice — projecting, and hatched the way the moulding is cut */}
    <div
      className="h-3.5 border border-ink-edge bg-ink-raised [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.09)_0_1px,transparent_1px_5px)]"
      aria-hidden="true"
    />
    <div className="mx-[1.5%] h-2 border-x border-b border-ink-line bg-ink-surface" aria-hidden="true" />

    {/* Frieze — the sentence every aim is holding up */}
    <div
      className={`mx-[3%] border-x border-b bg-ink px-5 py-5 text-center transition-colors duration-500 ${
        active ? 'border-accent/40' : 'border-ink-line'
      }`}
    >
      <p className="label mb-3">Aims Ⅰ–Ⅲ carry</p>
      <p className="text-lg sm:text-2xl text-text leading-snug">{GOAL_AIMS_META.entablature}</p>
      <p className="mt-2 text-sm text-text-muted">{GOAL_AIMS_META.entablatureSub}</p>
    </div>

    {/* Architrave — the band the capitals actually meet */}
    <div className="mx-[3%] h-2.5 border-x border-b border-ink-line bg-ink-surface" aria-hidden="true" />
  </div>
);

interface AimCardProps {
  aim: GoalAim;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onOpenSection?: (index: string) => void;
}

const AimCard = ({ aim, isActive, onEnter, onLeave, onOpenSection }: AimCardProps) => (
  <li
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onFocus={onEnter}
    onBlur={onLeave}
    className={`p-6 sm:p-7 flex flex-col gap-4 transition-colors duration-300 ${
      isActive ? 'bg-ink-surface' : ''
    }`}
  >
    <div className="flex items-baseline gap-3">
      <span
        className={`font-mono text-sm tracking-[0.2em] transition-colors duration-300 ${
          isActive ? 'text-accent' : 'text-text-subtle'
        }`}
      >
        {aim.numeral}
      </span>
      <span className="label">Aim {aim.index}</span>
      <span className="flex-1 h-px bg-ink-line" />
    </div>

    <h4 className="text-lg text-text leading-snug">{aim.title}</h4>
    <p className="text-sm text-text-muted leading-relaxed flex-1">{aim.statement}</p>

    <div
      className={`border-l-2 pl-4 py-0.5 transition-colors duration-300 ${
        isActive ? 'border-accent' : 'border-ink-edge'
      }`}
    >
      <span className="label block mb-1.5">Answers</span>
      <p className="text-sm text-text leading-relaxed">{aim.question}</p>
    </div>

    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
        From
      </span>
      {aim.sections.map((index) => {
        const section = GOAL_SECTIONS.find((s) => s.index === index);
        return (
          <button
            key={index}
            type="button"
            onClick={() => onOpenSection?.(index)}
            title={section?.title}
            aria-label={section ? `Open section ${index}: ${section.title}` : `Open section ${index}`}
            className="font-mono text-[10px] px-2 py-1 border border-ink-line text-text-subtle hover:border-accent hover:text-accent transition-colors"
          >
            §{index}
          </button>
        );
      })}
    </div>
  </li>
);

export default AimPillars;
