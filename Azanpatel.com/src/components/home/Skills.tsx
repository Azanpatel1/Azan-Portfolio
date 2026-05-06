import SectionHeader from '../ui/SectionHeader';

interface SkillCategory {
  title: string;
  skills: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Mechanical Design',
    skills: [
      'CAD (SolidWorks, Fusion 360)',
      'Finite Element Analysis',
      'Manufacturing & Machining',
      'Prototyping & Fabrication',
      'Tolerance & GD&T',
    ],
  },
  {
    title: 'Robotics & Controls',
    skills: [
      'Embedded Systems (C++, Python)',
      'Control Systems (PID / LQR)',
      'BLDC Motor Control',
      'Avionics Hardware',
      'Mechatronic Integration',
    ],
  },
  {
    title: 'Prototyping',
    skills: [
      '3D Printing & Rapid Iteration',
      'Test & Validation',
      'Soldering & PCB Assembly',
      'Electronics Integration',
    ],
  },
  {
    title: 'Process',
    skills: [
      'Leadership',
      'Cross-disciplinary Collaboration',
      'Technical Communication',
      'Project Planning',
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="section border-b border-ink-line">
      <div className="container">
        <SectionHeader
          index="03"
          label="Capabilities"
          title="Tools, methods, and disciplines."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-ink-line">
          {SKILL_CATEGORIES.map((category, idx) => (
            <div
              key={category.title}
              className={`p-6 border-ink-line ${idx > 0 ? 'border-t sm:border-t-0 sm:border-l lg:border-t-0' : ''} ${
                idx === 2 ? 'sm:border-t lg:border-t-0' : ''
              } ${idx === 3 ? 'sm:border-t lg:border-t-0' : ''}`}
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-ink-line">
                <span className="font-mono text-[10px] text-accent tracking-widest">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text">
                  {category.title}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-sm text-text-muted leading-relaxed flex gap-2">
                    <span className="text-text-subtle">—</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
