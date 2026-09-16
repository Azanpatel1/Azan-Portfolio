import SectionHeader from '../ui/SectionHeader';
import Reveal from '../motion/Reveal';
import ResearchCard from '../research/ResearchCard';
import { RESEARCH } from '../../data/research';
import { pad } from '../../lib/format';
import { SectionLink, SectionLinkMobile } from './SectionLink';

const SHOWN = 3;

const ResearchPreview = () => {
  const count = `${pad(Math.min(SHOWN, RESEARCH.length))} / ${pad(RESEARCH.length)}`;

  return (
    <section id="research" className="section border-b border-ink-line scroll-mt-16">
      <div className="container">
        <SectionHeader
          index="02"
          label="Research"
          title="Proposals, reports, and presentations in neurotechnology and medical devices."
          action={
            <SectionLink to="/research" count={count}>
              View all research
            </SectionLink>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH.slice(0, SHOWN).map((item, index) => (
            <Reveal key={item.id} delay={index * 80} className="grid">
              <ResearchCard item={item} index={index} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8">
          <SectionLinkMobile to="/research">View all research</SectionLinkMobile>
        </div>
      </div>
    </section>
  );
};

export default ResearchPreview;
