import Layout from '../components/layout/Layout';
import SectionHeader from '../components/ui/SectionHeader';
import { VISION_META, VISION_SECTIONS } from '../data/vision';
import type { VisionBlock, VisionSection } from '../data/vision';

const VisionPage = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            index="—"
            label="Vision"
            title={VISION_META.title}
            description={VISION_META.dateline}
          />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-8">
              <div className="border border-ink-line">
                <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between">
                  <span className="label">How to read this</span>
                  <span className="font-mono text-[10px] text-text-subtle">DRAFT</span>
                </div>
                <div className="px-5 py-4 space-y-3 text-sm text-text-muted leading-relaxed">
                  <p>{VISION_META.source}</p>
                  <ul className="space-y-2">
                    {VISION_META.readingNotes.map((note) => (
                      <li key={note} className="flex gap-3">
                        <span className="mt-2 w-1.5 h-1.5 shrink-0 bg-accent" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-text-subtle">{VISION_META.placement}</p>
                </div>
              </div>

              <nav className="border border-ink-line">
                <div className="px-5 py-3 border-b border-ink-line">
                  <span className="label">Contents</span>
                </div>
                <ol className="divide-y divide-ink-line">
                  {VISION_SECTIONS.map((section) => (
                    <li key={section.index}>
                      <a
                        href={`#vision-${section.index}`}
                        className="flex gap-4 px-5 py-3 text-sm text-text-muted hover:text-accent transition-colors"
                      >
                        <span className="font-mono text-[11px] text-text-subtle pt-0.5">
                          {section.index}
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="lg:col-span-8 space-y-16">
              {VISION_SECTIONS.map((section) => (
                <Section key={section.index} section={section} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const Section = ({ section }: { section: VisionSection }) => (
  <article id={`vision-${section.index}`} className="scroll-mt-24">
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-xs text-accent tracking-[0.2em]">{section.index}</span>
      <span className="flex-1 h-px bg-ink-line" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-medium text-text leading-tight mb-6">
      {section.title}
    </h2>
    <div className="space-y-5">
      {section.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  </article>
);

const Block = ({ block }: { block: VisionBlock }) => {
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

export default VisionPage;
