import Hand from '../../handwriting/Hand';

const TeslaInternship = () => {
  return (
    <article className="border border-ink-line">
      <header className="px-6 py-5 border-b border-ink-line flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src="/images/tesla-logo.png"
          alt="Tesla"
          className="h-10 w-auto object-contain bg-text p-2"
        />
        <div className="flex-1">
          <Hand as="p" className="label mb-1">Internship · Upcoming</Hand>
          <Hand as="h2" className="text-2xl font-medium text-text">Tesla — OPTIMUS Humanoid Robotics</Hand>
          <Hand as="p" className="text-text-muted text-sm mt-1">Engineering Manufacturing Intern</Hand>
        </div>
      </header>

      <div className="p-12 text-center">
        <span
          className="w-12 h-12 border border-ink-edge flex items-center justify-center text-text-muted mb-5 mx-auto"
          role="img"
          aria-label="Upcoming"
        >
          {/* a pencil hourglass instead of the colour emoji (the only non-graphite glyph on the page) */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12M6 21h12M7 3c0 5 5 6.5 5 9s-5 4-5 9M17 3c0 5-5 6.5-5 9s5 4 5 9" />
          </svg>
        </span>
        <Hand as="p" className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Status</Hand>
        <Hand as="p" className="text-text-muted">More details coming soon.</Hand>
      </div>
    </article>
  );
};

export default TeslaInternship;
