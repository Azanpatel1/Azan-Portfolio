import type { GraphItem } from '../../data/graphs';
import Hand from '../../handwriting/Hand';

interface GraphEmbedProps {
  item: GraphItem;
  index: number;
}

const GraphEmbed = ({ item, index }: GraphEmbedProps) => {
  return (
    <article className="border border-ink-line bg-ink-surface flex flex-col min-w-0">
      <div className="border-b border-ink-line px-5 py-4">
        <Hand as="div" className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[11.5px] text-accent tracking-[0.2em]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="label">Desmos</span>
        </Hand>
        <Hand as="h3" className="text-lg font-medium text-text leading-tight">{item.title}</Hand>
        {item.description && (
          <Hand as="p" className="mt-2 text-sm text-text-muted leading-relaxed">{item.description}</Hand>
        )}
      </div>

      <div className="p-4 flex-1">
        <div className="aspect-[16/10] min-h-[420px] min-w-0 w-full bg-white border border-ink-line">
          <iframe
            src={item.embedUrl}
            title={item.title}
            width="100%"
            height="100%"
            style={{ border: 0, backgroundColor: '#ffffff' }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>

      <div className="border-t border-ink-line px-5 py-3">
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.2em] text-text-muted hover:text-accent transition-colors"
        >
          <Hand>Open in Desmos</Hand>
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 14.5l9-9m0 0h-6m6 0v6" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default GraphEmbed;
