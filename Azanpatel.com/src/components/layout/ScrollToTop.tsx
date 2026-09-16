import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Client-side navigation keeps the old scroll position; a new page should start at the top. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // deep links handle their own scrolling
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
};

export default ScrollToTop;
