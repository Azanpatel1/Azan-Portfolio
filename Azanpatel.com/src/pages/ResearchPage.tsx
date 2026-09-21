import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import Layout from '../components/layout/Layout';
import ResearchCard from '../components/research/ResearchCard';
import Reveal from '../components/motion/Reveal';
import SectionHeader from '../components/ui/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';
import { RESEARCH } from '../data/research';
import type { ResearchType } from '../data/research';
import { pad } from '../lib/format';

type Filter = 'all' | ResearchType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'proposal', label: 'Proposals' },
  { id: 'report', label: 'Reports' },
  { id: 'presentation', label: 'Presentations' },
];

/** Numbered once, by position in the full list, so DOC-nn never changes with the filter. */
const CATALOGUE = RESEARCH.map((item, index) => ({ item, index }));

const countOf = (filter: Filter) =>
  filter === 'all' ? RESEARCH.length : RESEARCH.filter((item) => item.type === filter).length;

const COUNTS = Object.fromEntries(FILTERS.map(({ id }) => [id, countOf(id)])) as Record<Filter, number>;

const ResearchPage = () => {
  usePageTitle('Research');
  const [filter, setFilter] = useState<Filter>('all');
  const shown = filter === 'all' ? CATALOGUE : CATALOGUE.filter(({ item }) => item.type === filter);

  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            level={1}
            index="—"
            label="Research"
            title="Research proposals, written reports, and presentations."
            description="Proposals and talks spanning neurotechnology, medical devices, and diagnostics. Each card opens the full document on Google Drive."
          />

          <TypeTabs value={filter} shown={shown.length} onChange={setFilter} />

          <p className="sr-only" aria-live="polite">
            Showing {shown.length} of {RESEARCH.length} documents.
          </p>

          {/* Keyed on the filter so the cards re-mount and stagger in again. */}
          <div
            key={filter}
            id="research-panel"
            role="tabpanel"
            aria-labelledby={`research-tab-${filter}`}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {shown.map(({ item, index }, i) => (
              <Reveal key={item.id} delay={(i % 3) * 80} className="h-full">
                <ResearchCard item={item} index={index} headingLevel={2} />
              </Reveal>
            ))}
            {shown.length === 0 && (
              <p className="meta py-8">
                No documents in this category.
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

interface TypeTabsProps {
  value: Filter;
  shown: number;
  onChange: (next: Filter) => void;
}

/**
 * Segmented filter tabs on one rule. A 1px accent bar is measured against the
 * active tab and slides under it; arrow keys move between tabs.
 */
const TypeTabs = ({ value, shown, onChange }: TypeTabsProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<Filter, HTMLButtonElement>>>({});
  const [bar, setBar] = useState({ x: 0, y: 0, w: 0 });
  const [drawn, setDrawn] = useState(false);

  // Measure the active tab's label and park the bar under it; re-measure when
  // the row reflows (viewport changes, fonts finish loading).
  useLayoutEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[value];
    if (!list || !tab) return;
    const measure = () => {
      const label = (tab.firstElementChild as HTMLElement | null) ?? tab;
      const l = list.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      const s = label.getBoundingClientRect();
      setBar({ x: s.left - l.left, y: t.bottom - l.top - 1, w: s.width });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    ro.observe(tab);
    return () => ro.disconnect();
  }, [value]);

  // The bar is parked invisibly first, then draws in from the left like the header rule.
  useEffect(() => {
    const t = window.setTimeout(() => setDrawn(true), 250);
    return () => window.clearTimeout(t);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = FILTERS.findIndex((f) => f.id === value);
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (current + 1) % FILTERS.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + FILTERS.length) % FILTERS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = FILTERS.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = FILTERS[next].id;
    onChange(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <Reveal delay={80} className="mb-10 sm:mb-12">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Filter by document type"
        onKeyDown={onKeyDown}
        className="relative grid grid-cols-2 sm:flex"
      >
        {FILTERS.map(({ id, label }) => {
          const selected = id === value;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`research-tab-${id}`}
              aria-selected={selected}
              aria-controls="research-panel"
              tabIndex={selected ? 0 : -1}
              ref={(el) => {
                tabRefs.current[id] = el ?? undefined;
              }}
              onClick={() => onChange(id)}
              className={`text-left py-3 pr-6 sm:pt-1 sm:pr-10 border-b border-ink-line meta lg:text-xs transition-colors duration-300 ${
                selected ? 'text-text' : 'hover:text-text-muted'
              }`}
            >
              <span className="inline-flex items-baseline gap-2">
                {label}
                <span
                  className={`tracking-[0.05em] transition-colors duration-300 ${
                    selected ? 'text-accent' : 'text-text-subtle'
                  }`}
                >
                  {pad(COUNTS[id])}
                </span>
              </span>
            </button>
          );
        })}

        {/* The rest of the rule, carrying the running count. */}
        <div className="hidden md:flex flex-1 items-end justify-end pb-3 border-b border-ink-line" aria-hidden="true">
          <span className="meta">
            {pad(shown)} / {pad(COUNTS.all)} shown
          </span>
        </div>

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 h-px w-px bg-accent origin-left ${
            drawn ? 'transition-transform duration-500 ease-house motion-reduce:transition-none' : ''
          }`}
          style={{ transform: `translate(${bar.x}px, ${bar.y}px) scaleX(${drawn ? bar.w : 0})` }}
        />
      </div>
    </Reveal>
  );
};

export default ResearchPage;
