interface SpecCell {
  term: string;
  value: string;
  /** The cell that is still in motion carries the pulsing mark. */
  live?: boolean;
}

const SPEC: SpecCell[] = [
  { term: 'Role', value: 'Engineering Manufacturing Intern' },
  { term: 'Team', value: 'Optimus Humanoid Robotics' },
  { term: 'Status', value: 'Upcoming', live: true },
];

/**
 * A dossier for a placement that has not started: the header, a three-cell
 * spec row, and one line saying when the rest arrives.
 */
const TeslaInternship = () => {
  return (
    <article className="border border-ink-line">
      <header className="px-6 py-5 border-b border-ink-line flex flex-col sm:flex-row sm:items-center gap-4">
        {/* The wordmark is a PNG, so it sits on a tile of the text colour in either theme. */}
        <img
          src="/images/tesla-logo.png"
          alt="Tesla"
          className="h-10 w-auto object-contain bg-text p-2 self-start sm:self-auto"
        />
        <div className="flex-1">
          <p className="label mb-1">Internship · Upcoming</p>
          <h2 className="text-2xl font-medium text-text">Tesla — OPTIMUS Humanoid Robotics</h2>
          <p className="text-text-muted text-sm mt-1">Engineering Manufacturing Intern</p>
        </div>
      </header>

      <dl className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink-line">
        {SPEC.map(({ term, value, live }) => (
          <div key={term} className="px-6 py-4">
            <dt className="label">{term}</dt>
            <dd className="mt-2 flex items-center gap-2.5 font-mono text-xs text-text tracking-[0.04em]">
              {live && <StatusMark />}
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="border-t border-ink-line px-6 py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 text-sm text-text-muted">
        <span className="label shrink-0">Note</span>
        Details will be added once the internship begins.
      </p>
    </article>
  );
};

/** A small square that breathes slowly — only when the visitor allows motion. */
const StatusMark = () => (
  <span aria-hidden="true" className="relative shrink-0 w-2.5 h-2.5 border border-accent">
    <span className="absolute inset-[2px] bg-accent motion-safe:animate-[pulse_2.4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
  </span>
);

export default TeslaInternship;
