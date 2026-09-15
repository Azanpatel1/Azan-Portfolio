import SectionHeader from '../ui/SectionHeader';
import { AIMS, AIMS_META } from '../../data/aims';

const Aims = () => {
  return (
    <section id="aims" className="section border-b border-ink-line">
      <div className="container">
        <SectionHeader
          index="01"
          label={AIMS_META.label}
          title={AIMS_META.title}
          description={AIMS_META.description}
        />

        <ol className="border border-ink-line divide-y divide-ink-line">
          {AIMS.map((aim) => (
            <li
              key={aim.index}
              className="px-5 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row gap-4 sm:gap-8"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2 sm:w-32 shrink-0">
                <span className="font-mono text-xs text-accent tracking-[0.2em]">{aim.index}</span>
                <span className="label">{aim.label}</span>
              </div>
              <p className="flex-1 text-text-muted text-base sm:text-lg leading-relaxed">
                {aim.statement}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Aims;
