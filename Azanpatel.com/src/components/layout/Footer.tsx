import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { NAV } from './Header';
import Reveal from '../motion/Reveal';
import { ArrowUp, ArrowUpRight } from '../ui/Icon';
import { CONTACT } from '../../data/contact';
import useReducedMotion from '../../hooks/useReducedMotion';

const ROWS = [
  { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: 'LinkedIn', value: CONTACT.linkedin.label, href: CONTACT.linkedin.href },
  { label: 'GitHub', value: CONTACT.github.label, href: CONTACT.github.href },
];

/**
 * Three columns on wide screens, the site map and contact side by side under
 * the mark on a tablet, a stack on phones. One Reveal wraps the whole body —
 * the colophon sits in the last few pixels of the page, where a Reveal of its
 * own would never be seen — and the blocks stagger in beneath it.
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const reduced = useReducedMotion();
  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });

  return (
    <footer className="border-t border-ink-line">
      <Reveal fadeOnly className="container pt-14 pb-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.5fr_1fr_1.2fr] lg:gap-16">
          {/* Mark, one line of what this is, and the copyright. */}
          <Block delay={0} className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group" aria-label="Azan Patel — home">
              <span className="w-8 h-8 border border-text flex items-center justify-center font-mono text-xs tracking-[0.2em] indent-[0.2em] group-hover:border-accent group-hover:text-accent transition-colors">
                AP
              </span>
              <span className="label text-text-muted group-hover:text-text transition-colors">Azan Patel</span>
            </Link>
            <p className="mt-5 text-sm text-text-muted leading-relaxed max-w-xs">
              Translational neuroengineering — UC Davis
            </p>
            <p className="mt-6 meta">© {year} Azan Patel</p>
          </Block>

          {/* Site map: the same routes as the header, indexed, in two short columns. */}
          <Block delay={80}>
            <ColumnHead>Site map</ColumnHead>
            <ol className="grid grid-cols-2 grid-flow-col grid-rows-3 gap-x-6">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="nav-link group inline-flex items-baseline gap-3 py-1.5">
                    <span className="meta group-hover:text-accent transition-colors">{item.index}</span>
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
              {ROWS.map((row) => {
                const external = row.href.startsWith('http');
                return (
                  <li key={row.label} className="border-b border-ink-line">
                    <a
                      href={row.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer noopener' : undefined}
                      className="group flex items-center justify-between gap-4 py-3 text-text-muted hover:text-text transition-colors arrow-nudge-up"
                    >
                      <span className="meta">{row.label}</span>
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
            <p className="meta leading-relaxed">
              <span className="block sm:inline">Set in Inter &amp; JetBrains Mono</span>
              <span className="hidden sm:inline mx-2">·</span>
              <span className="block sm:inline">Built with React</span>
            </p>
            {/* Padded out to the bar's height (and pulled back in) so the hit area is not one 15px line. */}
            <button
              type="button"
              onClick={toTop}
              className="group ml-auto inline-flex items-center gap-2 py-3 -my-3 meta hover:text-text transition-colors"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 ease-house motion-reduce:transition-none group-hover:-translate-y-0.5" />
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
    className={`opacity-0 translate-y-3 transition-[opacity,transform] duration-700 ease-house [.is-in_&]:opacity-100 [.is-in_&]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${className}`.trim()}
    style={{ transitionDelay: `${delay}ms` }}
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
