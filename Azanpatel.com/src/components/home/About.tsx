import SectionHeader from '../ui/SectionHeader';

const SPEC_ROWS = [
  { label: 'Name', value: 'Azan Patel' },
  { label: 'Discipline', value: 'Mechanical & Biomedical Engineering' },
  { label: 'Institution', value: 'University of California, Davis' },
  { label: 'Class', value: '2027' },
  { label: 'Location', value: 'San Francisco, California' },
  { label: 'Status', value: 'Open to opportunities' },
];

const About = () => {
  return (
    <section id="about" className="section border-b border-ink-line">
      <div className="container">
        <SectionHeader index="01" label="About" title="Engineering student building real hardware." />

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-5 text-text-muted leading-relaxed">
            <p>
              I'm an engineering student focused on applying mechanical design and electronics to
              solve practical problems—particularly in medical devices and robotics. My work spans
              CAD, prototyping, FEA, and embedded systems.
            </p>
            <p>
              Through coursework, internships, and my startup Nextfuge, I've shipped functional
              prototypes from first sketches through machining and validation. I care about
              tight tolerances, honest design choices, and hardware that actually works.
            </p>
            <p>
              Outside of school, I collaborate with engineers across disciplines to push what's
              possible with limited resources and tight timelines.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-ink-line">
              <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between">
                <span className="label">Spec sheet</span>
                <span className="font-mono text-[10px] text-text-subtle">REV-A</span>
              </div>
              <dl className="divide-y divide-ink-line">
                {SPEC_ROWS.map((row) => (
                  <div key={row.label} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle col-span-1">
                      {row.label}
                    </dt>
                    <dd className="text-text col-span-2">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
