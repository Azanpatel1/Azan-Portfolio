import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { NAV } from './Header';
import Reveal from '../motion/Reveal';
import { ArrowUpRight } from '../ui/Icon';
import useReducedMotion from '../../hooks/useReducedMotion';

const EASE = 'cubic-bezier(0.2, 0.65, 0.2, 1)';

const CONTACT = [
  { label: 'Email', value: 'azpatel@ucdavis.edu', href: 'mailto:azpatel@ucdavis.edu' },
  { label: 'LinkedIn', value: 'linkedin.com/in/azanpatel', href: 'https://www.linkedin.com/in/azanpatel' },
  { label: 'GitHub', value: 'github.com/azanpatel', href: 'https://github.com/azanpatel' },
];

/**
 * Three columns on wide screens, a stack on phones. One Reveal wraps the whole
 * body — the colophon sits in the last few pixels of the page, where a Reveal
 * of its own would never be seen — and the blocks stagger in beneath it.
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const reduced = useReducedMotion();
  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });

  return (
    <footer className="border-t border-ink-line">
      <Reveal fadeOnly className="container pt-14 pb-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1.2fr] md:gap-10 lg:gap-16">
          {/* Mark, one line of what this is, and the copyright. */}
          <Block delay={0}>
            <Link to="/" className="inline-flex items-center gap-3 group" aria-label="Azan Patel — home">
              <span className="w-8 h-8 border border-text flex items-center justify-center font-mono text-xs tracking-widest group-hover:border-accent group-hover:text-accent transition-colors">
                AP
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted group-hover:text-text transition-colors">
                Azan Patel
              </span>
            </Link>
            <p className="mt-5 text-sm text-text-muted leading-relaxed max-w-xs">
              Translational neuroengineering — UC Davis
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-text-subtle">
              © {year} Azan Patel
            </p>
          </Block>

          {/* Site map: the same routes as the header, indexed, in two short columns. */}
          <Block delay={80}>
            <ColumnHead>Site map</ColumnHead>
            <ol className="grid grid-cols-2 grid-flow-col grid-rows-3 gap-x-6">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-baseline gap-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-text transition-colors"
                  >
                    <span className="text-[10px] text-text-subtle group-hover:text-accent transition-colors">
                      {item.index}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ol>
          </Block>

          {/* Contact: one hairline row per channel. */}
          <Block delay={160}>
            <ColumnHead>Contact</ColumnHead>
            <ul className="border-t border-ink-line">
              {CONTACT.map((row) => {
                const external = row.href.startsWith('http');
                return (
                  <li key={row.label} className="border-b border-ink-line">
                    <a
                      href={row.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer noopener' : undefined}
                      className="group flex items-center justify-between gap-4 py-3 text-text-muted hover:text-text transition-colors arrow-nudge-up"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                        {row.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-right">
                        {row.value}
                        {external && (
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-text-subtle group-hover:text-accent transition-colors" />
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Block>
        </div>

        {/* Colophon */}
        <Block delay={240} className="mt-14">
          <span className="block h-px w-full bg-ink-line rule-draw" aria-hidden="true" />
          <div className="pt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            {/* Two fragments that never break mid-phrase: stacked on a phone, dotted on one line above. */}
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] leading-relaxed text-text-subtle">
              <span className="block sm:inline">Set in Inter &amp; JetBrains Mono</span>
              <span className="hidden sm:inline mx-2">·</span>
              <span className="block sm:inline">Built with React</span>
            </p>
            <button
              type="button"
              onClick={toTop}
              className="group ml-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle hover:text-text transition-colors"
            >
              Back to top
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5"
                style={{ transitionTimingFunction: EASE }}
              >
                <path d="M10 16V4m0 0L5.5 8.5M10 4l4.5 4.5" />
              </svg>
            </button>
          </div>
        </Block>
      </Reveal>
    </footer>
  );
};

/** A footer block that lifts in once the surrounding Reveal is in view, after its delay. */
const Block = ({ delay, className = '', children }: { delay: number; className?: string; children: ReactNode }) => (
  <div
    className={`opacity-0 translate-y-3 transition-[opacity,transform] duration-700 [.is-in_&]:opacity-100 [.is-in_&]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${className}`.trim()}
    style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: EASE }}
  >
    {children}
  </div>
);

/** A column's mono label with a rule that draws in beside it. */
const ColumnHead = ({ children }: { children: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="label">{children}</span>
    <span className="flex-1 h-px bg-ink-line rule-draw" aria-hidden="true" />
  </div>
);

export default Footer;
