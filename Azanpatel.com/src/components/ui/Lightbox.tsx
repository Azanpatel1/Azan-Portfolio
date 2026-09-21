import { useCallback, useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Close } from './Icon';
import Tick from './Tick';
import { pad } from '../../lib/format';

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/** Horizontal drag past this many px pages the gallery on touch screens. */
const SWIPE_PX = 40;

/**
 * Full-screen image viewer. Keyboard: Esc closes, arrows move; the backdrop
 * closes on click; a horizontal swipe pages. While open the app root is made
 * inert, which keeps Tab inside the dialog and hides the page from assistive
 * tech; focus returns to whatever opened it on close.
 */
const Lightbox = ({ items, index, onClose, onIndexChange }: LightboxProps) => {
  const open = index !== null && items[index] !== undefined;
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = items.length;

  const step = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  // The key handler reads the latest callbacks through refs, so paging never re-runs the open effect.
  const latest = useRef({ onClose, step });
  latest.current = { onClose, step };

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    root?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      root?.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') latest.current.onClose();
      else if (e.key === 'ArrowRight') latest.current.step(1);
      else if (e.key === 'ArrowLeft') latest.current.step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const dragStart = useRef<number | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
  };

  if (!open || index === null) return null;
  const item = items[index];
  const counter = `${pad(index + 1)} / ${pad(count)}`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="lightbox fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 h-16 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="meta" aria-live="polite">
          {counter}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center border border-ink-line text-text-muted hover:border-accent hover:text-accent transition-colors"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>

      <div
        className="relative flex-1 min-h-0 flex items-center justify-center px-5 sm:px-16 touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
      >
        {count > 1 && (
          <>
            <NavButton side="left" onClick={(e) => { e.stopPropagation(); step(-1); }} />
            <NavButton side="right" onClick={(e) => { e.stopPropagation(); step(1); }} />
          </>
        )}
        <figure
          key={item.src}
          className="lightbox-figure relative max-h-full max-w-5xl border border-ink-line bg-ink-surface"
          onClick={(e) => e.stopPropagation()}
        >
          <Tick className="-top-1.5 -left-1.5" />
          <Tick className="-top-1.5 -right-1.5" />
          <Tick className="-bottom-1.5 -left-1.5" />
          <Tick className="-bottom-1.5 -right-1.5" />
          <img src={item.src} alt={item.alt} draggable={false} className="block max-h-[68vh] sm:max-h-[72vh] max-w-full object-contain select-none" />
          {item.caption && (
            <figcaption className="border-t border-ink-line px-4 py-3 meta">{item.caption}</figcaption>
          )}
        </figure>
      </div>

      {/* Phones get a control row; wider screens get the side buttons and a keyboard hint. */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {count > 1 ? (
          <div className="sm:hidden grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 h-16">
            <PagerButton side="left" onClick={() => step(-1)} />
            <span className="meta text-center">{counter}</span>
            <PagerButton side="right" onClick={() => step(1)} />
          </div>
        ) : (
          <div className="sm:hidden h-16" />
        )}
        <div className="hidden sm:flex h-12 items-center justify-center meta">
          Esc to close{count > 1 ? ' · ← → to move' : ''}
        </div>
      </div>
    </div>,
    document.body,
  );
};

const NavButton = ({ side, onClick }: { side: 'left' | 'right'; onClick: (e: React.MouseEvent) => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={side === 'left' ? 'Previous image' : 'Next image'}
    className={`hidden sm:inline-flex absolute z-10 top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} w-11 h-11 items-center justify-center border border-ink-line bg-ink/70 text-text-muted hover:border-accent hover:text-accent transition-colors`}
  >
    {side === 'left' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
);

const PagerButton = ({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={side === 'left' ? 'Previous image' : 'Next image'}
    className="w-11 h-11 inline-flex items-center justify-center border border-ink-line text-text-muted hover:border-accent hover:text-accent transition-colors"
  >
    {side === 'left' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
);

export default Lightbox;
