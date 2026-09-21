import SectionHeader from '../ui/SectionHeader';
import ThemePillars from '../goal/ThemePillars';
import { GOAL_META } from '../../data/goal';
import { SectionLink, SectionLinkMobile } from './SectionLink';

const GoalPreview = () => {
  return (
    <section id="goal" className="section border-b border-ink-line scroll-mt-16">
      <div className="container">
        <SectionHeader
          index="01"
          label="Goal"
          title={GOAL_META.title}
          action={<SectionLink to="/goal">Read the full goal</SectionLink>}
        />

        <ThemePillars />

        <div className="mt-8">
          <SectionLinkMobile to="/goal">Read the full goal</SectionLinkMobile>
        </div>
      </div>
    </section>
  );
};

export default GoalPreview;
