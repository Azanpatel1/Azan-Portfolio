import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import GoalPreview from '../components/home/GoalPreview';
import ResearchPreview from '../components/home/ResearchPreview';
import Contact from '../components/home/Contact';
import Reveal from '../components/motion/Reveal';
import ProjectCard from '../components/projects/ProjectCard';
import SectionHeader from '../components/ui/SectionHeader';
import { SectionLink, SectionLinkMobile } from '../components/home/SectionLink';
import { PROJECTS } from '../data/projects';

const PROJECTS_SHOWN = 3;

const pad = (n: number) => String(n).padStart(2, '0');

const HomePage = () => {
  const shown = PROJECTS.slice(0, PROJECTS_SHOWN);
  const count = `${pad(shown.length)} / ${pad(PROJECTS.length)}`;

  return (
    <Layout>
      <Hero />
      <GoalPreview />
      <ResearchPreview />

      <section id="projects" className="section border-b border-ink-line scroll-mt-16">
        <div className="container">
          <SectionHeader
            index="03"
            label="Selected work"
            title="Projects spanning aerospace, medical devices, and product design."
            action={
              <SectionLink to="/projects" count={count}>
                View all projects
              </SectionLink>
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((project, index) => (
              <Reveal key={project.id} delay={index * 80} className="grid">
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8">
            <SectionLinkMobile to="/projects">View all projects</SectionLinkMobile>
          </div>
        </div>
      </section>

      <Contact />
    </Layout>
  );
};

export default HomePage;
