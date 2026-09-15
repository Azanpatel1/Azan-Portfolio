import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import ResearchCard from '../research/ResearchCard';
import { RESEARCH } from '../../data/research';

const ResearchPreview = () => {
  return (
    <section id="research" className="section border-b border-ink-line">
      <div className="container">
        <SectionHeader
          index="03"
          label="Research"
          title="Proposals, reports, and presentations in neurotechnology and medical devices."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH.slice(0, 3).map((item, index) => (
            <ResearchCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <div className="mt-12 flex justify-start">
          <Link to="/research" className="btn btn-ghost">
            View All Research
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResearchPreview;
