import { useState } from 'react';
import type { GraphItem } from '../../data/graphs';
import useReducedMotion from '../../hooks/useReducedMotion';
import { ArrowUpRight } from '../ui/Icon';
import Tick from '../ui/Tick';
import { pad } from '../../lib/format';

interface GraphEmbedProps {
  item: GraphItem;
  index: number;
}

/**
 * A Desmos graph mounted as a figure: the embed sits on graph paper inside a
 * ticked plate, with a loading state that stands down once the frame arrives.
 */
const GraphEmbed = ({ item, index }: GraphEmbedProps) => {
  const [loaded, setLoaded] = useState(false);
  const figure = pad(index + 1);

  return (
    <figure className="relative flex flex-col h-full border border-ink-line bg-ink-surface">
      <Tick className="-top-1.5 -left-1.5" />
      <Tick className="-top-1.5 -right-1.5" />
      <Tick className="-bottom-1.5 -left-1.5" />
      <Tick className="-bottom-1.5 -right-1.5" />

      <div className="border-b border-ink-line px-5 py-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="meta text-accent">{figure}</span>
          <span className="label">Desmos</span>
        </div>
        <h3 className="text-lg font-medium text-text leading-tight">{item.title}</h3>
        {item.description && (
          <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Graph paper: an 8px minor grid under a 40px major one, both drawn in the line colour. */}
      <div className="flex-1 p-3 sm:p-4 bg-ink graph-paper">
        <div className="relative aspect-[16/10] w-full border border-ink-line">
          {!loaded && <LoadingState />}
          {/* Desmos draws on white, so the frame keeps its own ground in both themes. */}
          <iframe
            src={item.embedUrl}
            title={item.title}
            loading="lazy"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            style={{ border: 0, backgroundColor: '#ffffff' }}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>

      <figcaption className="border-t border-ink-line px-5 py-3 flex items-center justify-between gap-4 meta">
        <span>FIG. {figure} · Desmos</span>
        {/* py-3 -my-3 stretches the hit area to the full caption bar without moving the text. */}
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="arrow-nudge arrow-nudge-up shrink-0 inline-flex items-center gap-1.5 py-3 -my-3 text-text-muted hover:text-accent transition-colors"
        >
          Open in Desmos
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </figcaption>
    </figure>
  );
};

/**
 * "LOADING GRAPH" over a hairline whose fill runs left to right. The sweep is an
 * SVG animate element that is only rendered when the visitor allows motion.
 */
const LoadingState = () => {
  const reduced = useReducedMotion();
  return (
    <div
      role="status"
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-text-subtle"
    >
      <span className="meta">Loading graph</span>
      <svg width="96" height="1" viewBox="0 0 96 1" aria-hidden="true" className="overflow-visible text-accent">
        <line x1="0" y1="0.5" x2="96" y2="0.5" stroke="rgb(var(--ink-edge))" />
        <line
          x1="0"
          y1="0.5"
          x2="96"
          y2="0.5"
          stroke="currentColor"
          pathLength={1}
          strokeDasharray="0.35 1"
          strokeDashoffset={reduced ? 1.35 : 0}
        >
          {!reduced && (
            <animate
              attributeName="stroke-dashoffset"
              from="1.35"
              to="0"
              dur="1.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.4 0 0.2 1"
            />
          )}
        </line>
      </svg>
    </div>
  );
};

export default GraphEmbed;
