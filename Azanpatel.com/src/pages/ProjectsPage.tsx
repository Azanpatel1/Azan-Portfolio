import Layout from '../components/layout/Layout';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import SectionHeader from '../components/ui/SectionHeader';

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
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
