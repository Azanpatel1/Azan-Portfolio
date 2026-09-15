import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeader from '../components/ui/SectionHeader';
import AimPillars from '../components/goal/AimPillars';
import { GOAL_META, GOAL_SECTIONS } from '../data/goal';
import type { GoalBlock, GoalSection } from '../data/goal';

const GoalPage = () => {
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  // Deep links (#goal-07) open that section on load.
  useEffect(() => {
    const hash = window.location.hash.replace('#goal-', '');
    if (hash && GOAL_SECTIONS.some((s) => s.index === hash)) {
      setOpen(new Set([hash]));
    }
  }, []);

  const toggle = (index: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  // Aims cite the journal sections they came from; the citation opens the row.
  const openSection = (index: string) => {
    setOpen((prev) => new Set(prev).add(index));
    requestAnimationFrame(() => {
      document.getElementById(`goal-${index}`)?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            index="—"
            label="Goal"
            title={GOAL_META.title}
            description={GOAL_META.dateline}
          />

          <AimPillars onOpenSection={openSection} />

          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-xs text-accent tracking-[0.2em]">00–15</span>
            <span className="label">The journal</span>
            <span className="flex-1 h-px bg-ink-line" />
          </div>

          <div className="border border-ink-line">
            <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between">
              <span className="label">Contents</span>
              <span className="font-mono text-[10px] text-text-subtle">DRAFT</span>
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
      <svg
        className={`w-4 h-4 shrink-0 text-text-subtle group-hover:text-text transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
      </svg>
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
              <span className="font-mono text-xs text-accent pt-1.5">
                {String(i + 1).padStart(2, '0')}
              </span>
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
