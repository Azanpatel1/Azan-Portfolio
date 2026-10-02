import SectionHeader from '../ui/SectionHeader';

const CONTACT_ROWS = [
  { label: 'Email', value: 'azpatel@ucdavis.edu', href: 'mailto:azpatel@ucdavis.edu' },
  { label: 'Location', value: 'San Francisco, CA' },
  { label: 'LinkedIn', value: 'linkedin.com/in/azanpatel', href: 'https://linkedin.com' },
  { label: 'GitHub', value: 'github.com/azanpatel', href: 'https://github.com' },
];

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader
          index="03"
          label="Contact"
          title="Have a project or opportunity? Let's talk."
        />

        <div className="max-w-3xl mx-auto">
          <div className="border border-ink-line">
            <div className="px-6 py-4 border-b border-ink-line text-center">
              <span className="label">Contact Info</span>
            </div>
            <dl className="divide-y divide-ink-line">
              {CONTACT_ROWS.map((row) => (
                <div key={row.label} className="px-6 py-5 text-center">
                  <dt className="font-mono text-xs uppercase tracking-[0.22em] text-text-subtle mb-2">
                    {row.label}
                  </dt>
                  <dd className="text-lg sm:text-xl text-text">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer noopener"
                        className="hover:text-accent transition-colors"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span>{row.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
