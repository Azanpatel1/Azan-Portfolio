import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SectionHeader from '../components/ui/SectionHeader';
import ThemePillars from '../components/goal/ThemePillars';
import { Plus } from '../components/ui/Icon';
import usePageTitle from '../hooks/usePageTitle';
import { pad } from '../lib/format';
import { GOAL_META, GOAL_SECTIONS } from '../data/goal';
import type { GoalBlock, GoalSection } from '../data/goal';

const GoalPage = () => {
  usePageTitle('Goal');
  const { hash, key } = useLocation();
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  // A row that should be scrolled to once it has rendered open.
  const [pending, setPending] = useState<string | null>(null);

  // Deep links (#goal-07) open that section and scroll to it — on load, and
  // again on a same-document hash change (key changes on every navigation).
  useEffect(() => {
    const index = hash.replace('#goal-', '');
    if (index && GOAL_SECTIONS.some((s) => s.index === index)) {
      setOpen((prev) => new Set(prev).add(index));
      setPending(index);
    }
  }, [hash, key]);

  // Runs in the commit that opens the row, so the scroll measures its expanded
  // height; a rAF is not ordered after that commit and clamped short for low rows.
  useLayoutEffect(() => {
    if (!pending) return;
    document.getElementById(`goal-${pending}`)?.scrollIntoView({ block: 'start' });
    setPending(null);
  }, [pending]);

  const toggle = (index: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  // Themes cite the journal sections they lean on; the citation opens the row.
  const openSection = (index: string) => {
    setOpen((prev) => new Set(prev).add(index));
    setPending(index);
  };

  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          {/* The plate renders above the journal's own header, so the page heading sits first for the outline. */}
          <h1 className="sr-only">Goal</h1>
          <ThemePillars onOpenSection={openSection} />

          <div className="mt-24 sm:mt-28">
            <SectionHeader
              index="—"
              label="Goal"
              title={GOAL_META.title}
              description={GOAL_META.dateline}
            />
          </div>

          <div className="border border-ink-line">
            <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between">
              <span className="label">Contents</span>
              <span className="meta">Draft</span>
            </div>

            <Row
              index="—"
              title="How to read this"
              isOpen={open.has('meta')}
              onToggle={() => toggle('meta')}
            >
              <div className="space-y-3 text-text-muted leading-relaxed">
                <p>{GOAL_META.source}</p>
                <ul className="space-y-2">
                  {GOAL_META.readingNotes.map((note) => (
                    <li key={note} className="flex gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 shrink-0 bg-accent" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-text-subtle">{GOAL_META.placement}</p>
              </div>
            </Row>

            {GOAL_SECTIONS.map((section) => (
              <Row
                key={section.index}
                id={`goal-${section.index}`}
                index={section.index}
                title={section.title}
                isOpen={open.has(section.index)}
                onToggle={() => toggle(section.index)}
              >
                <SectionBody section={section} />
              </Row>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

interface RowProps {
  id?: string;
  index: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Row = ({ id, index, title, isOpen, onToggle, children }: RowProps) => (
  <div id={id} className="border-b border-ink-line last:border-b-0 scroll-mt-24">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center gap-5 px-5 py-4 text-left group hover:bg-ink-surface transition-colors"
    >
      <span className="font-mono text-xs text-accent tracking-[0.2em] w-8 shrink-0">{index}</span>
      <span
        className={`flex-1 text-base sm:text-lg leading-snug transition-colors ${
          isOpen ? 'text-text' : 'text-text-muted group-hover:text-text'
        }`}
      >
        {title}
      </span>
      {/* The site's open affordance: a plus that turns into a cross once the row is open. */}
      <Plus
        className={`w-3.5 h-3.5 shrink-0 text-text-subtle group-hover:text-text transition-transform duration-300 ease-house ${
          isOpen ? 'rotate-45' : ''
        }`}
      />
    </button>

    {isOpen && (
      <div className="px-5 pb-8 pt-2 sm:pl-[4.25rem] sm:pr-12 space-y-5">{children}</div>
    )}
  </div>
);

const SectionBody = ({ section }: { section: GoalSection }) => (
  <>
    {section.blocks.map((block, i) => (
      <Block key={i} block={block} />
    ))}
  </>
);

const Block = ({ block }: { block: GoalBlock }) => {
  switch (block.kind) {
    case 'p':
      return <p className="text-text-muted leading-relaxed">{block.text}</p>;

    case 'question':
      return (
        <div className="border-l-2 border-accent pl-5 py-1">
          <span className="label block mb-2">Question</span>
          <p className="text-text leading-relaxed">{block.text}</p>
        </div>
      );

    case 'note':
      return (
        <div className="border border-ink-line bg-ink-surface px-5 py-4">
          <span className="label block mb-2">Annotation</span>
          <p className="text-text-muted text-sm leading-relaxed">{block.text}</p>
        </div>
      );

    case 'list':
      return block.ordered ? (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4 text-text-muted leading-relaxed">
              <span className="font-mono text-xs text-accent pt-1.5">{pad(i + 1)}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-text-muted leading-relaxed">
              <span className="mt-2.5 w-1.5 h-1.5 shrink-0 bg-accent" />
              <span>&ldquo;{item}&rdquo;</span>
            </li>
          ))}
        </ul>
      );
  }
};

export default GoalPage;
