import { useState } from 'react';
import { ResearchItem } from '../../data/research';

const TYPE_LABELS: Record<ResearchItem['type'], string> = {
  proposal: 'Proposal',
  report: 'Report',
  presentation: 'Presentation',
};

export interface ResearchCardProps {
  item: ResearchItem;
  index: number;
}

const ResearchCard = ({ item, index }: ResearchCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const number = String(index + 1).padStart(2, '0');

  return (
    <a
      href={item.driveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-ink-line hover:border-ink-edge transition-colors"
    >
      <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden bg-ink-surface border-b border-ink-line p-2 sm:p-3">
        {imageFailed ? (
          <div className="flex flex-col items-center gap-3 text-text-subtle">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              {TYPE_LABELS[item.type]}
            </span>
          </div>
        ) : (
          <img
            src={item.image}
            alt={`First page of ${item.title}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        )}
        <span className="absolute top-3 right-3 bg-ink/80 backdrop-blur-sm text-text-muted font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-ink-line">
          {TYPE_LABELS[item.type]}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
            DOC-{number}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
            {[item.venue, item.year].filter(Boolean).join(' · ')}
          </span>
        </div>

        <h3 className="text-xl font-medium text-text mb-2 group-hover:text-accent transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle border border-ink-line px-2 py-1"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle group-hover:text-accent transition-colors">
            View
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 14.5l9-9m0 0h-6m6 0v6" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

export default ResearchCard;
