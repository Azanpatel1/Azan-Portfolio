import { useState } from 'react';
import type { CSSProperties } from 'react';
import useInView from '../../hooks/useInView';
import Reveal from '../motion/Reveal';
import { Link } from 'react-router-dom';
import ClassicalColumn, { COLUMN_H, COLUMN_W } from './ClassicalColumn';
import { GOAL_SECTIONS, GOAL_THEMES } from '../../data/goal';
import type { GoalTheme } from '../../data/goal';

/** Three equal bays, so each drawn column lands under the centre of its theme. */
const BAY = 200;
const PLATE_W = BAY * GOAL_THEMES.length;
const ORDER_NAMES: Record<GoalTheme['order'], string> = {
  doric: 'Doric',
  ionic: 'Ionic',
  corinthian: 'Corinthian',
};

interface ThemePillarsProps {
  /**
   * On the Goal page the journal is on the same page, so a citation opens its
   * row directly. Elsewhere the citation links to the Goal page instead.
   */
  onOpenSection?: (index: string) => void;
}

/**
 * The three research themes drawn as an entablature — the theme cards are the
 * frieze, and the three classical orders stand underneath holding them up.
 */
const ThemePillars = ({ onOpenSection }: ThemePillarsProps) => {
  const [active, setActive] = useState<string | null>(null);
  const clear = (index: string) => setActive((cur) => (cur === index ? null : cur));
  const [plateRef, plateInView] = useInView<SVGSVGElement>({ threshold: 0.3 });

  return (
    <Reveal as="figure" className="border border-ink-line bg-ink-surface/50">
      <h2 className="sr-only">Research themes</h2>
      <figcaption className="px-5 py-3 border-b border-ink-line flex items-center justify-between gap-4">
        <span className="label">Plate — the three orders</span>
        <span className="hidden sm:inline font-mono text-[10px] text-text-subtle tracking-[0.2em]">
          ONE THEME PER PILLAR
        </span>
      </figcaption>

      <div className="px-4 sm:px-8 pt-7 pb-3">
        {/* Cornice — projecting past the frieze, hatched the way the moulding is cut */}
        <div
          className="-mx-2 sm:-mx-3 h-3.5 border border-ink-edge bg-ink-raised [background-image:repeating-linear-gradient(90deg,var(--plate-hatch)_0_1px,transparent_1px_5px)]"
          aria-hidden="true"
        />

        {/* Frieze — the themes themselves are the load */}
        <ol className="grid md:grid-cols-3 border-x border-ink-line bg-ink divide-y md:divide-y-0 md:divide-x divide-ink-line">
          {GOAL_THEMES.map((theme, i) => (
            <ThemeCard
              key={theme.index}
              delay={i * 90}
              theme={theme}
              isActive={active === theme.index}
              onEnter={() => setActive(theme.index)}
              onLeave={() => clear(theme.index)}
              onOpenSection={onOpenSection}
            />
          ))}
        </ol>

        {/* Architrave — the band the capitals actually meet */}
        <div
          className={`h-2.5 border-x border-y bg-ink-surface transition-colors duration-500 ${
            active ? 'border-accent/40' : 'border-ink-line'
          }`}
          aria-hidden="true"
        />

        <svg
          ref={plateRef}
          data-draw={plateInView ? 'in' : 'pending'}
          viewBox={`0 0 ${PLATE_W} ${COLUMN_H}`}
          className="w-full block -mt-px"
          role="img"
          aria-label={`Three classical columns — ${GOAL_THEMES.map(
            (theme) => `${ORDER_NAMES[theme.order]} under theme ${theme.index}, ${theme.title}`,
          ).join('; ')} — holding up the three themes.`}
        >
          {GOAL_THEMES.map((theme, i) => (
            <g
              key={theme.index}
              style={{ '--draw-delay': `${i * 220}ms` } as CSSProperties}
              className={`transition-colors duration-500 ${
                active === null
                  ? 'text-[rgb(var(--plate-stroke))]'
                  : active === theme.index
                    ? 'text-accent'
                    : 'text-[rgb(var(--plate-stroke-dim))]'
              }`}
            >
              <ClassicalColumn order={theme.order} x={i * BAY + (BAY - COLUMN_W) / 2} />
              <rect
                x={i * BAY}
                y={0}
                width={BAY}
                height={COLUMN_H}
                fill="transparent"
                aria-hidden="true"
                onMouseEnter={() => setActive(theme.index)}
                onMouseLeave={() => clear(theme.index)}
              />
            </g>
          ))}
        </svg>

        {/* Annotations on the stylobate, in the register of an architectural plate */}
        <div className="grid grid-cols-3 border-t border-ink-line">
          {GOAL_THEMES.map((theme) => (
            <div
              key={theme.index}
              className={`px-2 py-3 text-center transition-colors duration-300 ${
                active === theme.index ? 'text-accent' : 'text-text-subtle'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                {ORDER_NAMES[theme.order]}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
                Theme {theme.index}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

interface ThemeCardProps {
  theme: GoalTheme;
  delay: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onOpenSection?: (index: string) => void;
}

const ThemeCard = ({ theme, delay, isActive, onEnter, onLeave, onOpenSection }: ThemeCardProps) => (
  <Reveal
    as="li"
    delay={delay}
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
        {theme.numeral}
      </span>
      <span className="label">Theme {theme.index}</span>
      <span className="flex-1 h-px bg-ink-line" />
    </div>

    <h3 className="text-lg text-text leading-snug">{theme.title}</h3>

    <div>
      <span className="label block mb-1.5">The vision</span>
      <p className="text-sm text-text-muted leading-relaxed">{theme.vision}</p>
    </div>

    <div className="flex-1">
      <span className="label block mb-1.5">Approach</span>
      <p className="text-sm text-text-muted leading-relaxed">{theme.approach}</p>
    </div>

    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
        From
      </span>
      {theme.sections.map((index) => {
        const section = GOAL_SECTIONS.find((s) => s.index === index);
        const label = section ? `Open section ${index}: ${section.title}` : `Open section ${index}`;
        const className =
          'font-mono text-[10px] px-2 py-1 border border-ink-line text-text-subtle hover:border-accent hover:text-accent transition-colors';
        return onOpenSection ? (
          <button
            key={index}
            type="button"
            onClick={() => onOpenSection(index)}
            title={section?.title}
            aria-label={label}
            className={className}
          >
            §{index}
          </button>
        ) : (
          <Link
            key={index}
            to={`/goal#goal-${index}`}
            title={section?.title}
            aria-label={label}
            className={className}
          >
            §{index}
          </Link>
        );
      })}
    </div>
  </Reveal>
);

export default ThemePillars;
