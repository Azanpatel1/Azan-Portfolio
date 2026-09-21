import type { ReactNode } from 'react';

/** The small mono chip used for project and research tags. */
const Tag = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`tag ${className}`.trim()}>{children}</span>
);

export default Tag;
