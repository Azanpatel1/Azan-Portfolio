import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Stop observing after the first time the element is seen. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** Whether an element has scrolled into view. Falls back to "yes" where IntersectionObserver is missing. */
const useInView = <T extends Element>({ once = true, rootMargin = '0px 0px -10% 0px', threshold = 0.15 }: Options = {}) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView] as const;
};

export default useInView;
