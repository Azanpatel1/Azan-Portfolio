import { createElement, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import useInView from '../../hooks/useInView';

type Tag = 'div' | 'section' | 'article' | 'li' | 'span' | 'figure' | 'header' | 'footer';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: Tag;
  /** Milliseconds after entering view — stagger siblings with index * 60 or so. */
  delay?: number;
  /** Skip the translate and only fade. */
  fadeOnly?: boolean;
  children: ReactNode;
}

/**
 * Fades and lifts its children in the first time they scroll into view.
 * The motion itself lives in CSS (`.reveal`), so it respects reduced-motion
 * and adds nothing to the bundle beyond an IntersectionObserver.
 */
const Reveal = ({ as = 'div', delay = 0, fadeOnly = false, className = '', style, children, ...rest }: RevealProps) => {
  const [ref, inView] = useInView<HTMLElement>();
  // Keyboard focus can land on a child before it scrolls into view; show it rather than hide the focus ring.
  const [focused, setFocused] = useState(false);
  const styles = { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties;
  return createElement(
    as,
    {
      ref,
      style: styles,
      onFocusCapture: () => setFocused(true),
      className: `reveal ${fadeOnly ? 'reveal-fade' : ''} ${inView || focused ? 'is-in' : ''} ${className}`.trim(),
      ...rest,
    },
    children,
  );
};

export default Reveal;
