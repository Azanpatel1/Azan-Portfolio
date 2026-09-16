import { useEffect, useRef, useState } from 'react';
import type { ResearchItem } from '../../data/research';
import Tag from '../ui/Tag';
import { ArrowUpRight } from '../ui/Icon';
import useInView from '../../hooks/useInView';
import useReducedMotion from '../../hooks/useReducedMotion';

const TYPE_LABELS: Record<ResearchItem['type'], string> = {
  proposal: 'Proposal',
  report: 'Report',
  presentation: 'Presentation',
};

/** What the link opens, read off the Drive URL so the footer can say so. */
const formatOf = (url: string) => {
  if (url.includes('/document/')) return 'Google Doc';
  if (url.includes('/presentation/')) return 'Google Slides';
  return 'Google Drive';
};

/** A faint diagonal hatch, so a late Drive thumbnail lands on a drawn plate rather than a blank. */
const HATCH =
  'plate-hatch';

export interface ResearchCardProps {
  item: ResearchItem;
  index: number;
}

const ResearchCard = ({ item, index }: ResearchCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const number = String(index + 1).padStart(2, '0');
  const meta = [item.venue, item.year].filter(Boolean).join(' · ');

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <a
      href={item.driveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-lift arrow-nudge arrow-nudge-up flex flex-col h-full border border-ink-line"
    >
      <div
        className={`relative aspect-[4/3] flex items-center justify-center overflow-hidden border-b border-ink-line bg-ink-surface p-3 sm:p-4 ${HATCH}`}
      >
        {imageFailed ? (
          <DocumentGlyph />
        ) : (
          <img
            ref={imgRef}
            src={item.image}
            alt={`First page of ${item.title}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`max-h-full max-w-full object-contain border border-ink-line grayscale group-hover:grayscale-0 transition-[opacity,filter] duration-500 ease-out ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <span className="absolute top-0 right-0 border-l border-b border-ink-line bg-ink text-text-muted font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 transition-colors duration-300 group-hover:border-ink-edge">
          {TYPE_LABELS[item.type]}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-4 mb-3 font-mono text-[10px] tracking-[0.2em] text-text-subtle">
          <span className="shrink-0">DOC-{number}</span>
          {meta && <span className="truncate text-right">{meta}</span>}
        </div>

        <h3 className="text-xl font-medium text-text text-balance leading-snug mb-2 transition-colors duration-300 group-hover:text-accent">
          {item.title}
        </h3>

        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4">{item.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.tags.map((tag) => (
            <Tag key={tag} className="group-hover:border-ink-edge">
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-auto pt-3.5 border-t border-ink-line flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle">
          <span>{formatOf(item.driveUrl)}</span>
          <span className="inline-flex items-center gap-1 transition-colors duration-300 group-hover:text-accent">
            View
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};

/** The glyph's strokes, outline first and the text rules last, with their draw delays. */
const STROKES: { d: string; delay: number }[] = [
  { d: 'M3 1.5h23l11 11v36H3z', delay: 0 },
  { d: 'M26 1.5v11h11', delay: 350 },
  { d: 'M11 24h18', delay: 600 },
  { d: 'M11 31h18', delay: 700 },
  { d: 'M11 38h11', delay: 800 },
];

/**
 * A sheet with a folded corner and three rules — the fallback when a thumbnail
 * will not load. It draws itself once scrolled into view. The dash styles are
 * inline rather than the shared [data-draw] rule: Chromium does not restyle
 * `[pathLength]` descendants when an ancestor's attribute flips.
 */
const DocumentGlyph = () => {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const drawn = reduced || inView;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 text-text-subtle">
      {/* transform-none keeps the card's arrow-nudge from moving this drawing on hover. */}
      <svg
        viewBox="0 0 40 50"
        className="w-10 h-[50px] group-hover:transform-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
      >
        {STROKES.map(({ d, delay }) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: reduced ? 'none' : `stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            }}
          />
        ))}
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Preview unavailable</span>
    </div>
  );
};

export default ResearchCard;
