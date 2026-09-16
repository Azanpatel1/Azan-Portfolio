import { useEffect } from 'react';

const SITE = 'Azan Patel';

/** Sets the document title for a page and restores the site title on unmount. */
const usePageTitle = (title?: string) => {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — ${SITE}` : previous;
    return () => {
      document.title = previous;
    };
  }, [title]);
};

export default usePageTitle;
