import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from '../motion/Reveal';
import Lightbox from '../ui/Lightbox';
import type { LightboxItem } from '../ui/Lightbox';
import { Plus } from '../ui/Icon';
import { pad } from '../../lib/format';

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

/** The same twelve pages, captioned the way the grid labels them and placed by where and when they were taken. */
const LIGHTBOX_ITEMS: LightboxItem[] = NOTEBOOKS.map((entry, i) => ({
  src: entry.image,
  alt: entry.alt,
  caption: `N-${pad(i + 1)} · Field notes · UC Davis Health, 2024`,
}));

const UCDavisHealthInternship = () => {
  const [open, setOpen] = useState<number | null>(null);
  // Stable, so the lightbox's open effect does not re-run (and re-focus Close) on every page.
  const close = useCallback(() => setOpen(null), []);

  return (
    <article className="border border-ink-line">
      <header className="px-5 py-4 border-b border-ink-line flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src="/images/uc-davis-health-logo.png"
          alt="UC Davis Health"
          className="h-10 w-auto object-contain bg-text p-1.5 self-start sm:self-auto"
        />
        <div className="flex-1">
          <p className="label mb-1">Internship · 2024</p>
          <h2 className="text-2xl font-medium text-text">UC Davis Health — Biomedical Engineering</h2>
          <p className="text-text-muted text-sm mt-1">Operating Room Observations and User Needs Analysis</p>
        </div>
      </header>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="label">Field notes</span>
          <span className="flex-1 h-px bg-ink-line" />
          <span className="shrink-0 meta">{pad(NOTEBOOKS.length)} Entries</span>
        </div>

        <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {NOTEBOOKS.map((entry, i) => (
            <Reveal as="li" key={entry.image} delay={(i % 4) * 60}>
              <NotebookThumb entry={entry} number={pad(i + 1)} onOpen={() => setOpen(i)} />
            </Reveal>
          ))}
        </ol>

        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="label">User needs identified</span>
            <span className="flex-1 h-px bg-ink-line" />
            <span className="shrink-0 meta">{pad(USER_NEEDS.length)} Items</span>
          </div>

          <ol className="border-y border-ink-line divide-y divide-ink-line">
            {USER_NEEDS.map((need, i) => (
              <Reveal
                as="li"
                key={need.title}
                delay={i * 80}
                className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_15rem_1fr] gap-x-4 lg:gap-x-6 py-4 sm:py-5"
              >
                <span className="meta text-accent leading-5">{pad(i + 1)}</span>
                <h3 className="label text-text leading-5">{need.title}</h3>
                <p className="col-start-2 lg:col-start-3 mt-1.5 lg:mt-0 text-sm text-text-muted leading-relaxed">
                  {need.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <Lightbox items={LIGHTBOX_ITEMS} index={open} onClose={close} onIndexChange={setOpen} />
    </article>
  );
};

interface NotebookThumbProps {
  entry: NotebookEntry;
  number: string;
  onOpen: () => void;
}

/** One page of the notebook: grey until hovered, and it fades in once the scan arrives. */
const NotebookThumb = ({ entry, number, onOpen }: NotebookThumbProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View field note N-${number}: ${entry.alt}`}
      className="group card-lift w-full text-left border border-ink-line hover:border-accent bg-ink-surface"
    >
      <div className="aspect-square overflow-hidden">
        <img
          ref={imgRef}
          src={entry.image}
          alt={entry.alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[opacity,filter] duration-500 ease-house ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <div className="px-3 py-2 border-t border-ink-line flex items-center justify-between meta">
        <span>N-{number}</span>
        <span className="inline-flex items-center gap-1 transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
          View
          <Plus className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
};

export default UCDavisHealthInternship;
