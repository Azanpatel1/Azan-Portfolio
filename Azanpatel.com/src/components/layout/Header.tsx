import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import useReducedMotion from '../../hooks/useReducedMotion';

export interface NavItem {
  to: string;
  label: string;
  index: string;
  exact?: boolean;
}

/** The site's routes, in reading order. The footer's site map reads the same list. */
// eslint-disable-next-line react-refresh/only-export-components -- shared data, not a component
export const NAV: NavItem[] = [
  { to: '/', label: 'Home', index: '01', exact: true },
  { to: '/goal', label: 'Goal', index: '02' },
  { to: '/research', label: 'Research', index: '03' },
  { to: '/projects', label: 'Projects', index: '04' },
  { to: '/internships', label: 'Internships', index: '05' },
  { to: '/media', label: 'Media', index: '06' },
];

const EASE = 'cubic-bezier(0.2, 0.65, 0.2, 1)';
const DRAWER_MS = 450;
const DRAWER_ID = 'site-drawer';

const isActivePath = (pathname: string, item: NavItem) =>
  item.exact ? pathname === item.to : pathname.startsWith(item.to);

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // One rAF-throttled scroll listener drives both the border and the progress
  // hairline. The hairline is written straight to the DOM so scrolling never
  // re-renders the header.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setIsScrolled(y > 4);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progressRef.current?.style.setProperty('transform', `scaleX(${fraction})`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Page height moves when images land or a section opens; keep the fraction honest.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Contact lives on the home page. Client-side navigation never scrolls to a
  // hash on its own, so land the visitor on the section from any page.
  useEffect(() => {
    if (location.pathname !== '/' || location.hash !== '#contact') return;
    const raf = requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.key, location.pathname, location.hash]);

  // While the drawer is open: Esc closes it and hands focus back, the page
  // behind it stops scrolling, and growing past the breakpoint dismisses it.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`relative bg-ink/90 backdrop-blur-sm border-b transition-colors duration-500 ${
          isScrolled ? 'border-ink-line' : 'border-transparent'
        }`}
        style={{ transitionTimingFunction: EASE }}
      >
        {/* Reading progress: a hairline along the top edge, scaled by scroll fraction. */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute top-0 left-0 h-px w-full bg-accent origin-left scale-x-0 will-change-transform"
        />

        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group" aria-label="Azan Patel — home">
            <span className="w-8 h-8 border border-text flex items-center justify-center font-mono text-xs tracking-widest group-hover:border-accent group-hover:text-accent transition-colors">
              AP
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted group-hover:text-text transition-colors">
              Azan Patel
            </span>
          </Link>

          <DesktopNav pathname={location.pathname} />

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/#contact" className="btn btn-accent text-[11px] py-2 px-4">
              Contact
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isOpen}
              aria-controls={DRAWER_ID}
              className="w-8 h-8 inline-flex items-center justify-center border border-ink-line text-text-muted hover:border-accent hover:text-accent transition-colors"
            >
              {/* Two bars that fold into a cross. */}
              <span aria-hidden="true" className="relative block w-4 h-[11px]">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                  style={{ transitionTimingFunction: EASE }}
                />
                <span
                  className={`absolute left-0 bottom-0 h-px w-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? '-translate-y-[5px] -rotate-45' : ''
                  }`}
                  style={{ transitionTimingFunction: EASE }}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Drawer isOpen={isOpen} pathname={location.pathname} onClose={close} />
    </header>
  );
};

interface Span {
  left: number;
  width: number;
}

/**
 * Where the desktop indicator last sat. Every page mounts its own header, so
 * this carries the bar across a route change and lets it slide to the new item.
 */
let lastSpan: Span | null = null;

/**
 * Desktop navigation with one hairline indicator that sits on the header's
 * bottom rule under the active item. It previews a hovered or focused item
 * and returns home when the pointer leaves.
 */
const DesktopNav = ({ pathname }: { pathname: string }) => {
  const reduced = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const primed = useRef(lastSpan !== null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [span, setSpan] = useState<Span | null>(lastSpan);
  const [shown, setShown] = useState(lastSpan !== null);

  const activeTo = NAV.find((item) => isActivePath(pathname, item))?.to ?? null;
  const targetTo = hovered ?? activeTo;

  const locate = useCallback((): Span | null => {
    const el = targetTo ? links.current.get(targetTo) : undefined;
    if (!navRef.current || !el) return null;
    const next = { left: el.offsetLeft, width: el.offsetWidth };
    if (targetTo === activeTo) lastSpan = next;
    return next;
  }, [targetTo, activeTo]);

  const measure = useCallback(() => {
    setSpan(locate());
    setShown(true);
  }, [locate]);

  useLayoutEffect(() => {
    if (!primed.current) {
      // Cold load: place the bar before first paint; the frame after fades it in.
      primed.current = true;
      setSpan(locate());
    }
    // Paint once where the bar is, then measure a frame later so the move
    // (or the first fade) runs as a transition. Two frames, so the paint
    // always lands in between.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(measure);
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [locate, measure]);

  // Webfonts landing or the viewport changing re-flows the labels.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <nav ref={navRef} aria-label="Site" className="hidden lg:flex relative h-16 items-stretch gap-8">
      {NAV.map((item) => {
        const active = item.to === activeTo;
        return (
          <Link
            key={item.to}
            to={item.to}
            ref={(el) => {
              if (el) links.current.set(item.to, el);
              else links.current.delete(item.to);
            }}
            aria-current={active ? 'page' : undefined}
            onMouseEnter={() => setHovered(item.to)}
            onMouseLeave={() => setHovered((cur) => (cur === item.to ? null : cur))}
            onFocus={() => setHovered(item.to)}
            onBlur={() => setHovered((cur) => (cur === item.to ? null : cur))}
            className={`nav-link inline-flex items-center ${active ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        );
      })}
      <span
        aria-hidden="true"
        className="absolute -bottom-px left-0 h-px bg-accent origin-left"
        style={{
          width: span?.width ?? 0,
          transform: `translateX(${span?.left ?? 0}px)`,
          opacity: shown && span ? 1 : 0,
          transition: reduced
            ? 'none'
            : `transform 450ms ${EASE}, width 450ms ${EASE}, opacity 300ms ease`,
        }}
      />
    </nav>
  );
};

interface DrawerProps {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
}

/**
 * The phone navigation: a panel that slides in from the right under the bar,
 * over a dimmed backdrop. It stays mounted so both directions animate; while
 * closed it is invisible and inert, so nothing inside can take focus.
 */
const Drawer = ({ isOpen, pathname, onClose }: DrawerProps) => (
  <div
    id={DRAWER_ID}
    aria-hidden={!isOpen}
    inert={!isOpen}
    className={`lg:hidden fixed inset-x-0 top-16 bottom-0 overflow-hidden ${
      isOpen ? 'visible' : 'invisible pointer-events-none'
    }`}
    style={{ transition: isOpen ? 'visibility 0s' : `visibility 0s ${DRAWER_MS}ms` }}
  >
    <button
      type="button"
      tabIndex={-1}
      aria-label="Close navigation"
      onClick={onClose}
      className={`absolute inset-0 w-full bg-ink/70 backdrop-blur-[2px] transition-opacity motion-reduce:transition-none ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDuration: `${DRAWER_MS}ms`, transitionTimingFunction: EASE }}
    />

    <nav
      aria-label="Site"
      className={`absolute top-0 right-0 bottom-0 w-[min(22rem,88vw)] flex flex-col bg-ink border-l border-ink-line transition-transform motion-reduce:transition-none ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ transitionDuration: `${DRAWER_MS}ms`, transitionTimingFunction: EASE }}
    >
      <div className="flex items-center gap-3 px-6 h-12 border-b border-ink-line">
        <span className="label">Navigation</span>
        <span className="flex-1 h-px bg-ink-line" aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
          {String(NAV.length).padStart(2, '0')}
        </span>
      </div>

      <ol className="flex-1 overflow-y-auto">
        {NAV.map((item, i) => {
          const active = isActivePath(pathname, item);
          return (
            <li
              key={item.to}
              className={`transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{
                transitionTimingFunction: EASE,
                transitionDelay: isOpen ? `${90 + i * 45}ms` : '0ms',
              }}
            >
              <Link
                to={item.to}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-5 min-h-[3.5rem] px-6 border-b border-ink-line transition-colors ${
                  active ? 'text-text bg-ink-surface' : 'text-text-muted hover:text-text hover:bg-ink-surface/60'
                }`}
              >
                {active && (
                  <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-px bg-accent" />
                )}
                <span
                  className={`font-mono text-[10px] tracking-[0.2em] ${
                    active ? 'text-accent' : 'text-text-subtle'
                  }`}
                >
                  {item.index}
                </span>
                <span className="font-mono text-sm uppercase tracking-[0.2em]">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div
        className={`px-6 py-6 border-t border-ink-line flex flex-col gap-4 transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{
          transitionTimingFunction: EASE,
          transitionDelay: isOpen ? `${90 + NAV.length * 45}ms` : '0ms',
        }}
      >
        <Link to="/#contact" onClick={onClose} className="btn btn-accent w-full text-[11px] py-3">
          Contact
        </Link>
        <a
          href="mailto:azpatel@ucdavis.edu"
          className="font-mono text-[11px] tracking-[0.12em] text-text-subtle hover:text-text transition-colors self-start"
        >
          azpatel@ucdavis.edu
        </a>
      </div>
    </nav>
  </div>
);

export default Header;
