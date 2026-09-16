import { useEffect, useState } from 'react';
import type { MediaItem } from '../../data/media';
import useInView from '../../hooks/useInView';
import useReducedMotion from '../../hooks/useReducedMotion';
import { ArrowUpRight } from '../ui/Icon';

interface MediaEmbedProps {
  item: MediaItem;
  index: number;
}

type PlayerState = 'loading' | 'ready' | 'stalled';

/** How long the player gets before the frame says it has not arrived. */
const STALL_MS = 8000;

/** Spotify embeds are episodes or shows; the caption names which. */
const kindOf = (embedUrl: string) =>
  embedUrl.includes('/episode/') ? 'EP' : embedUrl.includes('/show/') ? 'SHOW' : 'MEDIA';

/**
 * A Spotify player mounted as a plate: the embed sits inside a ticked frame
 * with a loading state that stands down once the frame arrives, and a
 * caption bar underneath that names the source and links out to it.
 */
const MediaEmbed = ({ item, index }: MediaEmbedProps) => {
  const [state, setState] = useState<PlayerState>('loading');
  const [frameRef, nearView] = useInView<HTMLDivElement>({ threshold: 0, rootMargin: '200px 0px' });
  const number = String(index + 1).padStart(2, '0');
  const height = item.height ?? 352;
  const caption = [kindOf(item.embedUrl), item.outlet, item.year].filter(Boolean).join(' · ');

  // The frame is lazy, so the clock only starts once it is close enough to load.
  useEffect(() => {
    if (!nearView || state !== 'loading') return;
    const t = window.setTimeout(() => setState((s) => (s === 'loading' ? 'stalled' : s)), STALL_MS);
    return () => window.clearTimeout(t);
  }, [nearView, state]);

  return (
    <article className="border border-ink-line bg-ink-surface">
      <header className="border-b border-ink-line px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* On lg the page numbers the plate in the margin instead. */}
            <span className="lg:hidden font-mono text-[10px] text-accent tracking-[0.2em]">{number}</span>
            {item.outlet && <span className="label">{item.outlet}</span>}
          </div>
          <h2 className="text-lg font-medium text-text leading-tight">{item.title}</h2>
          {item.description && (
            <p className="mt-2 text-sm text-text-muted leading-relaxed max-w-xl">{item.description}</p>
          )}
        </div>
        {item.year && (
          <span className="font-mono text-[10px] text-text-subtle tracking-[0.2em] shrink-0 pt-1">
            {item.year}
          </span>
        )}
      </header>

      <div className="p-4 sm:p-5">
        <div ref={frameRef} className="relative">
          <Tick className="-top-1.5 -left-1.5" />
          <Tick className="-top-1.5 -right-1.5" />
          <Tick className="-bottom-1.5 -left-1.5" />
          <Tick className="-bottom-1.5 -right-1.5" />

          <div className="relative border border-ink-line bg-ink" style={{ height }}>
            {state !== 'ready' && <LoadingState stalled={state === 'stalled'} />}
            {/* Stays on top so a player that did arrive is never covered; a blocked one is transparent. */}
            <iframe
              src={item.embedUrl}
              title={item.title}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              onLoad={() => setState('ready')}
              style={{ border: 0 }}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${
                state === 'loading' ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-ink-line px-5 py-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
        <span>{caption}</span>
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="arrow-nudge arrow-nudge-up shrink-0 inline-flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors"
        >
          Open on Spotify
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </footer>
    </article>
  );
};

/**
 * "LOADING PLAYER" over a hairline whose fill runs left to right. The sweep is
 * an SVG animate element that is only rendered when the visitor allows motion.
 * Past the stall window the line goes still and the label says so.
 */
const LoadingState = ({ stalled }: { stalled: boolean }) => {
  const reduced = useReducedMotion();
  return (
    <div
      role="status"
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-text-subtle"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
        {stalled ? 'Player did not load' : 'Loading player'}
      </span>
      <svg width="120" height="1" viewBox="0 0 120 1" aria-hidden="true" className="overflow-visible text-accent">
        <line x1="0" y1="0.5" x2="120" y2="0.5" stroke="rgb(var(--ink-edge))" />
        {!stalled && (
          <line
            x1="0"
            y1="0.5"
            x2="120"
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
        )}
      </svg>
      {stalled && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle/80">
          Use the link below
        </span>
      )}
    </div>
  );
};

const Tick = ({ className = '' }: { className?: string }) => (
  <span aria-hidden="true" className={`absolute w-3 h-3 border border-text-muted ${className}`} />
);

export default MediaEmbed;
