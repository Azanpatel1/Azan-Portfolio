import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import { GOAL_AIMS, GOAL_AIMS_META, GOAL_META, GOAL_SECTIONS } from '../../data/goal';

const PREVIEW_COUNT = 5;

/** First paragraph of the opening section — the premise, in one paragraph. */
const premise = GOAL_SECTIONS[0].blocks.find((b) => b.kind === 'p');

const GoalPreview = () => {
  return (
    <section id="goal" className="section border-b border-ink-line">
      <div className="container">
        <SectionHeader index="01" label="Goal" title={GOAL_META.title} />

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6">
            {premise && (
              <p className="text-text-muted text-lg leading-relaxed">{premise.text}</p>
            )}
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
              {GOAL_META.dateline}
            </p>

            <div className="border-t border-ink-line pt-6">
              <p className="label mb-4">{GOAL_AIMS_META.label}</p>
              <ol className="space-y-3">
                {GOAL_AIMS.map((aim) => (
                  <li key={aim.index}>
                    <Link
                      to="/goal"
                      className="group flex items-baseline gap-4 text-text-muted hover:text-text transition-colors"
                    >
                      <span className="font-mono text-xs text-text-subtle group-hover:text-accent transition-colors w-6 shrink-0">
                        {aim.numeral}
                      </span>
                      <span>{aim.title}</span>
                      <span className="hidden sm:block flex-1 h-px bg-ink-line self-center" />
                      <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle shrink-0">
                        {aim.discipline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <Link to="/goal" className="btn btn-ghost">
              Read the full goal
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-ink-line">
              <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between">
                <span className="label">Contents</span>
                <span className="font-mono text-[10px] text-text-subtle">
                  {GOAL_SECTIONS.length} SECTIONS
                </span>
              </div>
              <ol className="divide-y divide-ink-line">
                {GOAL_SECTIONS.slice(0, PREVIEW_COUNT).map((section) => (
                  <li key={section.index}>
                    <Link
                      to={`/goal#goal-${section.index}`}
                      className="flex gap-4 px-5 py-3 text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      <span className="font-mono text-[11px] text-text-subtle pt-0.5">
                        {section.index}
                      </span>
                      <span>{section.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="px-5 py-3 border-t border-ink-line">
                <Link
                  to="/goal"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle hover:text-accent transition-colors"
                >
                  + {GOAL_SECTIONS.length - PREVIEW_COUNT} more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalPreview;
