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
          <p className="label mb-1">Internship · Upcoming</p>
          <h2 className="text-2xl font-medium text-text">Tesla — OPTIMUS Humanoid Robotics</h2>
          <p className="text-text-muted text-sm mt-1">Engineering Manufacturing Intern</p>
        </div>
      </header>

      <div className="p-12 text-center">
        <span className="inline-block w-12 h-12 border border-ink-edge flex items-center justify-center font-mono text-text-muted mb-5 mx-auto">
          ⏳
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Status</p>
        <p className="text-text-muted">More details coming soon.</p>
      </div>
    </article>
  );
};

export default TeslaInternship;
