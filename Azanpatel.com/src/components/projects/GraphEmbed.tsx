import type { GraphItem } from '../../data/graphs';

interface GraphEmbedProps {
  item: GraphItem;
  index: number;
}

const GraphEmbed = ({ item, index }: GraphEmbedProps) => {
  return (
    <article className="border border-ink-line bg-ink-surface flex flex-col">
      <div className="border-b border-ink-line px-5 py-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] text-accent tracking-[0.2em]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="label">Desmos</span>
        </div>
        <h3 className="text-lg font-medium text-text leading-tight">{item.title}</h3>
        {item.description && (
          <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.description}</p>
        )}
      </div>

      <div className="p-4 flex-1">
        <div className="aspect-square w-full bg-ink-raised">
          <iframe
            src={item.embedUrl}
            title={item.title}
            width="100%"
            height="100%"
            style={{ border: 0 }}
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
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle hover:text-accent transition-colors"
        >
          Open in Desmos
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 14.5l9-9m0 0h-6m6 0v6" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default GraphEmbed;
