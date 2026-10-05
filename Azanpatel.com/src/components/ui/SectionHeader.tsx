import type { ReactNode } from 'react';
import Reveal from '../motion/Reveal';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  /** Sits at the right end of the rule — a "View all" link, a count, a filter. */
  action?: ReactNode;
  /** Render the title as an h1 on page-level headers. */
  level?: 1 | 2;
  className?: string;
}

const SectionHeader = ({ index, label, title, description, action, level = 2, className = '' }: SectionHeaderProps) => {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <Reveal className={`mb-16 ${className}`.trim()}>
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-xs text-accent tracking-[0.2em]">{index}</span>
        <span className="label">{label}</span>
        <span className="flex-1 h-px bg-ink-line rule-draw" />
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <Heading className="text-3xl sm:text-4xl font-medium text-text max-w-3xl leading-tight">
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-text-muted max-w-2xl leading-relaxed">{description}</p>
      )}
    </Reveal>
  );
};

export default SectionHeader;
