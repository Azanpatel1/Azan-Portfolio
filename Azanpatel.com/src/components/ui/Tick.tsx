/** The 12px registration mark set at a plate's corners; place it with the className (e.g. "-top-1.5 -left-1.5"). */
const Tick = ({ className = '' }: { className?: string }) => (
  <span aria-hidden="true" className={`absolute w-3 h-3 border border-text-muted ${className}`} />
);

export default Tick;
