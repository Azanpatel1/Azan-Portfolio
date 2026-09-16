import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * The last path any Layout saw. Every page mounts its own Layout, so this is
 * what tells a route change apart from the first load (and from StrictMode's
 * second effect run), which keeps the browser's own focus.
 */
let lastPathname: string | null = null;

const Layout = ({ children }: LayoutProps) => {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // A route change lands focus on the new page, so keyboard and screen-reader
  // users continue from the content rather than the top of the tab order.
  // Hash links (/#contact) scroll and land on their own.
  useEffect(() => {
    const changed = lastPathname !== null && lastPathname !== pathname;
    lastPathname = pathname;
    if (!changed || hash) return;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* First Tab stop: past the bar and its nine controls, straight to the page. Parked above the viewport until focused. */}
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="fixed top-2 left-2 z-[60] btn btn-accent bg-ink -translate-y-[200%] focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      {/* Keyed on the path so each page mounts fresh and plays its entrance. */}
      <main
        key={pathname}
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="flex-grow pt-16 page-in focus-visible:outline-none"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
