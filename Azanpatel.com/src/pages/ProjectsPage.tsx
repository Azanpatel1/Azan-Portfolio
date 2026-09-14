import Layout from '../components/layout/Layout';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import GraphEmbed from '../components/projects/GraphEmbed';
import SectionHeader from '../components/ui/SectionHeader';
import { GRAPHS } from '../data/graphs';

const ProjectsPage = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            index="—"
            label="Projects"
            title="A catalogue of work in mechanical, biomedical, and aerospace engineering."
            description="Each project below is shipped or has functioning hardware. Click through for context, design choices, and what I learned."
          />
          <ProjectsGrid />

          <div className="mt-24">
            <div className="section-header">
              <span className="label">Graphs</span>
              <span className="section-header-rule" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {GRAPHS.map((item, index) => (
                <GraphEmbed key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
