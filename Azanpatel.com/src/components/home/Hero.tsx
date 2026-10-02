type Award = { amount: string; title: string; note?: string; parts?: Award[] };

const AWARDS: Award[] = [
  {
    amount: '$250,000',
    title: 'Independently Funded',
    note: 'Pre-idea raise, concept to IRB submission process for non-invasive closed-loop neuromodulation',
  },
  {
    amount: '$10K',
    title: 'NEXTfuge',
    note: 'Concept to Bench',
    parts: [
      { amount: '$7,500', title: 'Karim Abou Najm Memorial Award', note: 'Research, innovation, and mentorship' },
      { amount: '$1,500', title: 'NSF I-Corps Hub Regionals' },
      { amount: '$1,000', title: 'Little Bank Poster Session' },
    ],
  },
];

const AWARD_COUNT = AWARDS.reduce((n, a) => n + 1 + (a.parts?.length ?? 0), 0);

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-28 border-b border-ink-line">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h1 className="flex items-center gap-4 text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-medium leading-[1.05] tracking-tight text-text">
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 bg-accent" aria-hidden="true" />
              Neuroengineering
            </h1>
            <p className="mt-3 pl-7 sm:pl-[30px] font-mono text-sm sm:text-base uppercase tracking-[0.25em] text-text-muted">
              Cognitive Neuroscience
            </p>

            <p className="mt-6 text-text-muted/90 text-base sm:text-lg italic max-w-xl leading-relaxed">
              I&rsquo;m fascinated by designing brain-computer interfaces and neuroplasticity&rsquo;s effect on memory &amp; learning, and Mindfullness.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative border border-ink-line bg-ink-surface">
              <Tick className="-top-1.5 -left-1.5" />
              <Tick className="-top-1.5 -right-1.5" />
              <Tick className="-bottom-1.5 -left-1.5" />
              <Tick className="-bottom-1.5 -right-1.5" />

              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/Azan.jpg"
                  alt="Azan Patel"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="border-t border-ink-line px-4 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                <span>AP—001</span>
                <span>UC Davis · 2027</span>
              </div>
              <div className="border-t border-ink-line px-4 py-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle">
                <span className="shrink-0">GPA <span className="text-text">3.6 / 4.0</span></span>
                <span className="text-right">Biomedical &amp; Mechanical <span className="text-text-muted">(Double)</span></span>
              </div>
            </div>

            <div className="mt-4 border border-ink-line bg-ink-surface">
              <div className="border-b border-ink-line px-4 py-3 flex items-center justify-between">
                <span className="label">Awards &amp; Honors</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                  {AWARD_COUNT} ENTRIES
                </span>
              </div>
              <ul className="divide-y divide-ink-line">
                {AWARDS.map((award) => (
                  <li key={award.title} className="px-4 py-3">
                    <AwardRow award={award} />
                    {award.parts && (
                      <ul className="mt-3 ml-6 pl-4 border-l border-ink-line space-y-2.5">
                        {award.parts.map((part) => (
                          <li key={part.title}>
                            <AwardRow award={part} compact />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border border-ink-line bg-ink-surface px-4 py-3">
              <span className="label">First Generation College Student</span>
              <p className="mt-2 text-[13px] leading-snug text-text-muted">
                I grew up watching math videos from&hellip;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AwardRow = ({ award, compact = false }: { award: Award; compact?: boolean }) => (
  <div className="flex items-baseline gap-4">
    <span
      className={`shrink-0 font-mono ${compact ? 'w-[60px] text-[11px] text-accent/80' : 'w-[72px] text-[13px] text-accent'}`}
    >
      {award.amount}
    </span>
    <span className={`flex-1 leading-snug ${compact ? 'text-[12px] text-text-muted' : 'text-[13px] text-text'}`}>
      {award.title}
      {award.note && (
        <span className="block mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-text-subtle">
          {award.note}
        </span>
      )}
    </span>
  </div>
);

const Tick = ({ className = '' }: { className?: string }) => (
  <span className={`absolute w-3 h-3 border border-text-muted ${className}`} />
);

export default Hero;
