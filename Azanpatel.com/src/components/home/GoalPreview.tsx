import { Link } from 'react-router-dom';
import ThemePillars from '../goal/ThemePillars';

const GoalPreview = () => {
  return (
    <section id="goal" className="section border-b border-ink-line">
      <div className="container">
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">01</span>
          <span className="label">Goal</span>
          <span className="flex-1 h-px bg-ink-line" />
        </div>

        <ThemePillars />

        <div className="mt-10">
          <Link to="/goal" className="btn btn-ghost">
            Read the full goal
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GoalPreview;
