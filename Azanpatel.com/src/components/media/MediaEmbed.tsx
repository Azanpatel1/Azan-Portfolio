import type { MediaItem } from '../../data/media';

interface MediaEmbedProps {
  item: MediaItem;
  index: number;
}

const MediaEmbed = ({ item, index }: MediaEmbedProps) => {
  return (
    <article className="border border-ink-line bg-ink-surface">
      <div className="border-b border-ink-line px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] text-accent tracking-[0.2em]">
              {String(index + 1).padStart(2, '0')}
            </span>
            {item.outlet && <span className="label">{item.outlet}</span>}
          </div>
          <h3 className="text-lg font-medium text-text leading-tight">{item.title}</h3>
          {item.description && (
            <p className="mt-2 text-sm text-text-muted leading-relaxed max-w-xl">
              {item.description}
            </p>
          )}
        </div>
        {item.year && (
          <span className="font-mono text-[10px] text-text-subtle tracking-[0.2em] shrink-0 pt-1">
            {item.year}
          </span>
        )}
      </div>

      <div className="p-4">
        <iframe
          src={item.embedUrl}
          title={item.title}
          width="100%"
          height={item.height ?? 352}
          style={{ border: 0 }}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>

      <div className="border-t border-ink-line px-5 py-3">
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle hover:text-accent transition-colors"
        >
          Open on Spotify
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 14.5l9-9m0 0h-6m6 0v6" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default MediaEmbed;
