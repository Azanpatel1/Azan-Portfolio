import { useEffect, useState } from 'react';

interface NotebookEntry {
  image: string;
  alt: string;
}

const NOTEBOOKS: NotebookEntry[] = [
  { image: '/images/Notebook1.png', alt: 'Joint implant preparation and placement sketch' },
  { image: '/images/Notebook2.png', alt: 'Mandible fracture with plate implant notes' },
  { image: '/images/Notebook3.png', alt: 'Broken mandible axial view sketches' },
  { image: '/images/Notebook4.png', alt: 'Spine laminectomy procedure notes' },
  { image: '/images/Notebook5.png', alt: 'Spinal anatomy with endoscope diagram' },
  { image: '/images/Notebook6.png', alt: 'Robotic surgery notes - Dr Miquel Miller' },
  { image: '/images/Notebook7.png', alt: 'da Vinci Xi robotic arm sketch' },
  { image: '/images/Notebook8.png', alt: 'CT scan of skull with trauma' },
  { image: '/images/Notebook9.png', alt: 'Medical observation notes' },
  { image: '/images/Notebook10.png', alt: 'Surgical procedure documentation' },
  { image: '/images/Notebook11.png', alt: 'Biomedical engineering observations' },
  { image: '/images/Notebook12.png', alt: 'Operating room analysis notes' },
];

const USER_NEEDS = [
  {
    title: 'Sterilization Efficiency',
    description: 'Faster instrument turnover between procedures to reduce patient wait times.',
  },
  {
    title: 'Ergonomic Design',
    description: 'Reduce staff fatigue from repetitive motions through better tool ergonomics.',
  },
  {
    title: 'Real-time Monitoring',
    description: 'Continuous patient vital tracking through procedural transitions.',
  },
  {
    title: 'Workflow Optimization',
    description: 'Streamline surgical prep bottlenecks with better organization.',
  },
];

const UCDavisHealthInternship = () => {
  const [selected, setSelected] = useState<NotebookEntry | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    if (selected) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selected]);

  return (
    <article className="border border-ink-line">
      <header className="px-6 py-5 border-b border-ink-line flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src="/images/uc-davis-health-logo.png"
          alt="UC Davis Health"
          className="h-10 w-auto object-contain bg-text p-1.5"
        />
        <div className="flex-1">
          <p className="label mb-1">Internship · 2024</p>
          <h2 className="text-2xl font-medium text-text">UC Davis Health — Biomedical Engineering</h2>
          <p className="text-text-muted text-sm mt-1">Operating Room Observations and User Needs Analysis</p>
        </div>
      </header>

      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="label">Field notes</span>
          <span className="flex-1 h-px bg-ink-line" />
          <span className="font-mono text-[10px] text-text-subtle">{NOTEBOOKS.length} entries</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {NOTEBOOKS.map((entry, idx) => (
            <button
              key={entry.image}
              type="button"
              onClick={() => setSelected(entry)}
              className="group relative border border-ink-line hover:border-accent transition-colors bg-ink-surface text-left"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={entry.image}
                  alt={entry.alt}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2 border-t border-ink-line flex items-center justify-between">
                <span className="font-mono text-[10px] text-text-subtle tracking-widest">
                  N-{String(idx + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] text-text-subtle">VIEW</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="label">User needs identified</span>
            <span className="flex-1 h-px bg-ink-line" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-ink-line">
            {USER_NEEDS.map((need, idx) => (
              <div
                key={need.title}
                className={`p-5 border-ink-line ${
                  idx > 0 ? 'border-t sm:border-t-0 sm:border-l' : ''
                } ${idx === 2 ? 'sm:border-t lg:border-t-0' : ''} ${idx === 3 ? 'sm:border-t lg:border-t-0' : ''}`}
              >
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-mono text-[10px] text-accent tracking-widest">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-text">{need.title}</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{need.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-text-muted hover:text-text transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <figure
            className="border border-ink-line bg-ink-surface max-w-5xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-ink overflow-auto max-h-[75vh]">
              <img src={selected.image} alt={selected.alt} className="w-full h-auto object-contain" />
            </div>
            <figcaption className="px-5 py-3 border-t border-ink-line text-text-muted text-sm">
              {selected.alt}
            </figcaption>
          </figure>
        </div>
      )}
    </article>
  );
};

export default UCDavisHealthInternship;
