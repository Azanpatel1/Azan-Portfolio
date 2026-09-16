import { Link } from 'react-router-dom';
import { ArrowRight } from '../ui/Icon';

interface SectionLinkProps {
  to: string;
  children: string;
  /** "03 / 16" — how much of the whole this preview shows. */
  count?: string;
  className?: string;
}

/**
 * The "view all" affordance for a home preview section. On md+ it sits in the
 * SectionHeader's action slot as a mono arrow link; on phones the same
 * component renders as a full-width ghost button under the grid.
 */
export const SectionLink = ({ to, children, count, className = '' }: SectionLinkProps) => (
  <span className={`hidden md:inline-flex items-center gap-5 ${className}`.trim()}>
    {count && (
      <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle" title={`Showing ${count}`}>
        {count}
      </span>
    )}
    <Link
      to={to}
      className="arrow-nudge inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted hover:text-text transition-colors"
    >
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </span>
);

export const SectionLinkMobile = ({ to, children, className = '' }: Omit<SectionLinkProps, 'count'>) => (
  <Link to={to} className={`arrow-nudge btn btn-ghost w-full md:hidden ${className}`.trim()}>
    {children}
    <ArrowRight className="w-3.5 h-3.5" />
  </Link>
);
