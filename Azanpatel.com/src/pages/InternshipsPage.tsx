import type { ComponentType } from 'react';
import Layout from '../components/layout/Layout';
import Reveal from '../components/motion/Reveal';
import SectionHeader from '../components/ui/SectionHeader';
import { ArrowRight } from '../components/ui/Icon';
import useInView from '../hooks/useInView';
import usePageTitle from '../hooks/usePageTitle';
import TeslaInternship from '../components/internships/TeslaInternship';
import UCDavisHealthInternship from '../components/internships/UCDavisHealthInternship';

interface Placement {
  index: string;
  year: string;
  /** Only a placement that has not started yet carries one. */
  status?: string;
  Card: ComponentType;
}

/** Newest first, so the spine reads top-down from what is next to what is done. */
const PLACEMENTS: Placement[] = [
  { index: 'INT-01', year: '2026', status: 'Upcoming', Card: TeslaInternship },
  { index: 'INT-02', year: '2024', Card: UCDavisHealthInternship },
];

const pad = (n: number) => String(n).padStart(2, '0');

const InternshipsPage = () => {
  usePageTitle('Internships');
  // The list is taller than a viewport, so a sliver in view is enough to start the spine.
  const [spineRef, spineIn] = useInView<HTMLOListElement>({ threshold: 0.05 });

  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            level={1}
            index="—"
            label="Internships"
            title="Professional experiences shaping my engineering practice."
            description="Field work and observations from internships across biomedical and robotics."
            action={
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
                {pad(PLACEMENTS.length)} INTERNSHIPS
              </span>
            }
          />

          {/* A timeline on md+: one hairline down the left that draws from the top, a square marker and the year per entry. */}
          <ol ref={spineRef} className="relative">
            <span
              aria-hidden="true"
              className={`hidden md:block absolute left-[3px] top-7 bottom-0 w-px bg-ink-line origin-top transition-transform duration-[1400ms] ease-house motion-reduce:transition-none ${
                spineIn ? 'scale-y-100' : 'scale-y-0'
              }`}
            />

            {PLACEMENTS.map(({ index, year, status, Card }, i) => (
              <Reveal
                as="li"
                key={index}
                delay={i * 120}
                className="md:grid md:grid-cols-[8rem_1fr] md:gap-x-8 mb-10 last:mb-0"
              >
                <div className="hidden md:block">
                  {/* The year rides with its entry while the entry scrolls past. */}
                  <div className="sticky top-24 pt-5">
                    <p className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-text-subtle">
                      <span
                        aria-hidden="true"
                        className={`shrink-0 w-[7px] h-[7px] border ${
                          status ? 'border-accent bg-ink' : 'border-text-muted bg-text-muted'
                        }`}
                      />
                      {index}
                    </p>
                    <p className="mt-2 pl-[calc(7px+0.75rem)] font-mono text-sm text-text tracking-[0.1em]">
                      {year}
                    </p>
                    {status && (
                      <p className="mt-1 pl-[calc(7px+0.75rem)] inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        <ArrowRight className="w-3 h-3" />
                        {status}
                      </p>
                    )}
                  </div>
                </div>

                <Card />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
};

export default InternshipsPage;
