import Layout from '../components/layout/Layout';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import GraphEmbed from '../components/projects/GraphEmbed';
import Reveal from '../components/motion/Reveal';
import SectionHeader from '../components/ui/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';
import { GRAPHS } from '../data/graphs';
import { PROJECTS } from '../data/projects';
import { pad } from '../lib/format';

const Count = ({ n, noun }: { n: number; noun: string }) => (
  <span className="meta">
    {pad(n)} {noun}
  </span>
);

const ProjectsPage = () => {
  usePageTitle('Projects');

  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            level={1}
            index="—"
            label="Projects"
            title="A catalogue of work in mechanical, biomedical, and aerospace engineering."
            description="Each project below is shipped or has functioning hardware. Click through for context, design choices, and what I learned."
            action={<Count n={PROJECTS.length} noun="entries" />}
          />
          <ProjectsGrid />

          <div className="mt-24 sm:mt-28">
            <SectionHeader
              index="—"
              label="Graphs"
              title="Interactive figures, plotted in Desmos."
              description="Each figure below is a live Desmos embed. Open one in Desmos for the full-size calculator."
              action={<Count n={GRAPHS.length} noun="figures" />}
            />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              {GRAPHS.map((item, index) => (
                <Reveal key={item.id} delay={index * 90} className="grid">
                  <GraphEmbed item={item} index={index} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
