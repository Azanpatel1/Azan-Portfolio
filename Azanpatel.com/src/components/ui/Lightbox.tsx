import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Close } from './Icon';

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

/**
 * Full-screen image viewer. Keyboard: Esc closes, arrows move; the backdrop
 * closes on click; body scroll is locked while open. Rendered into <body>
 * so it sits above any stacking context on the page.
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, step]);

  if (!open || index === null) return null;
  const item = items[index];
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="lightbox fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 h-16 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-xs tracking-[0.2em] text-text-subtle">{counter}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 inline-flex items-center justify-center border border-ink-line text-text-muted hover:border-accent hover:text-accent transition-colors"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-5 sm:px-16">
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
          <img src={item.src} alt={item.alt} className="block max-h-[72vh] max-w-full object-contain" />
          {item.caption && (
            <figcaption className="border-t border-ink-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
              {item.caption}
            </figcaption>
          )}
        </figure>
      </div>

      <div className="h-12 shrink-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
        Esc to close{count > 1 ? ' · ← → to move' : ''}
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
    className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} w-10 h-10 inline-flex items-center justify-center border border-ink-line bg-ink/60 text-text-muted hover:border-accent hover:text-accent transition-colors`}
  >
    {side === 'left' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
);

const Tick = ({ className }: { className: string }) => (
  <span aria-hidden="true" className={`absolute w-3 h-3 border border-text-muted ${className}`} />
);

export default Lightbox;
