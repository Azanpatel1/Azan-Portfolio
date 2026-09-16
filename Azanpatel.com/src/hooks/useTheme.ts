import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

/** Mirrors whatever the pre-paint script in index.html already applied. */
const readTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

// One store for the whole app, so every toggle on the page stays in step.
let current: Theme = typeof document !== 'undefined' ? readTheme() : 'dark';
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => current;

const apply = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
  // Keep the browser chrome in step with the page background.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#fafaf9' : '#050505');
};

const setTheme = (theme: Theme) => {
  if (theme === current) return;
  current = theme;
  apply(theme);
  listeners.forEach((fn) => fn());
};

/**
 * Light/dark theme. Dark is the default; a choice persists in localStorage and
 * wins over the OS preference, which is only followed until the visitor picks.
 */
const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Follow the OS while the visitor has not chosen for themselves.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* storage unavailable — still follow the OS */
      }
      setTheme(e.matches ? 'light' : 'dark');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = current === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode etc. — the choice just won't persist */
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
};

export default useTheme;
