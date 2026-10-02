import { useEffect, useMemo, useRef, useState, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { observe, unobserve } from './observer';
import { shouldAnimate } from './env';

export interface InkTextProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** true runs the word-wise pen reveal on scroll; the default renders plain text */
  animate?: boolean;
  as?: ElementType;
  className?: string;
  /** plain text only (strings / numbers); markup is not supported here — use Hand for that */
  children: string | number | Array<string | number>;
  /** ms per character of pen travel (default 45) */
  perChar?: number;
  /** minimum ms per word (default 120) */
  minWord?: number;
  /** cap on the whole reveal in ms (default 2400) */
  cap?: number;
  /** extra ms before the reveal starts */
  delay?: number;
}

const WATCHDOG_MS = 5000;

/**
 * Word-wise pen reveal (clip-path wipe per word, cumulative delays at a
 * constant pen speed). No layout shift, no SVG. Use it where the stroke
 * overlay is not appropriate: line-clamped card descriptions, very long
 * paragraphs, text inside toggled containers.
 */
export default function InkText({
  as: Tag = 'span',
  className = '',
  children,
  perChar = 45,
  minWord = 120,
  cap = 2400,
  delay = 0,
  animate = false,
  ...rest
}: InkTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'inking' | 'done'>(() => (animate && shouldAnimate() ? 'pending' : 'idle'));
  const text = Array.isArray(children) ? children.join('') : String(children);

  const words = useMemo(() => {
    const parts = text.split(/(\s+)/);
    const items: { w: string; t: number; d: number; space: string }[] = [];
    let t = 0;
    let raw = 0;
    for (let i = 0; i < parts.length; i += 2) {
      const w = parts[i];
      const space = parts[i + 1] ?? '';
      if (!w) continue;
      const d = Math.max(minWord, w.length * perChar);
      items.push({ w, t, d, space });
      t += d + (space ? perChar : 0);
      raw = t;
    }
    const k = raw > cap ? cap / raw : 1;
    return { items: items.map((it) => ({ ...it, t: it.t * k, d: it.d * k })), total: raw * k };
  }, [text, perChar, minWord, cap]);

  // arm: reveal on first intersection (or immediately on focus / dead observer)
  useEffect(() => {
    if (state !== 'pending') return;
    const el = ref.current;
    if (!el) return;
    let observerAlive = false;
    let timer: number | null = null;
    observe(el, (entry) => {
      observerAlive = true;
      if (!entry.isIntersecting) return;
      unobserve(el);
      timer = window.setTimeout(() => setState('inking'), delay);
    });
    const watchdog = window.setTimeout(() => { if (!observerAlive) setState('done'); }, WATCHDOG_MS);
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      window.clearTimeout(watchdog);
      unobserve(el);
    };
  }, [state, delay]);

  // keyboard focus into (or onto the link around) a pending OR inking block
  // reveals it at once: nobody should wait out a 2 s word-wipe to read a card.
  // focusin bubbles up, not down: listen on the nearest focusable ancestor too
  useEffect(() => {
    if (state !== 'pending' && state !== 'inking') return;
    const el = ref.current;
    if (!el) return;
    const onFocus = (e: Event) => {
      const t = e.target as Node | null;
      if (t && (el.contains(t) || (t as Element).contains?.(el))) setState('done');
    };
    const focusHost: Element = el.closest('a,button,[tabindex],summary,label') ?? el;
    focusHost.addEventListener('focusin', onFocus);
    return () => focusHost.removeEventListener('focusin', onFocus);
  }, [state]);

  // settle: drop the per-word spans once the reveal has played out
  useEffect(() => {
    if (state !== 'inking') return;
    const t = window.setTimeout(() => setState('done'), words.total + 150);
    return () => window.clearTimeout(t);
  }, [state, words.total]);

  if (state === 'idle' || state === 'done') {
    return (
      <Tag ref={ref} className={className} {...rest}>
        {text}
      </Tag>
    );
  }

  const cls = [className, state === 'pending' ? 'ink-pending' : 'ink-inking'].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {words.items.map((it, i) => (
        <span key={i}>
          <span className="ink-w" style={{ '--ink-t': `${it.t.toFixed(0)}ms`, '--ink-d': `${it.d.toFixed(0)}ms` } as CSSProperties}>
            {it.w}
          </span>
          {it.space}
        </span>
      ))}
    </Tag>
  );
}
