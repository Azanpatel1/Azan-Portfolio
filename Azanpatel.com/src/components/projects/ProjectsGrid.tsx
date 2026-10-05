import ProjectCard from './ProjectCard';
import Reveal from '../motion/Reveal';
import { PROJECTS } from '../../data/projects';

/** The full catalogue on /projects. The cards are h2 there: nothing sits between the page h1 and them. */
const ProjectsGrid = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {PROJECTS.map((project, index) => (
      <Reveal key={project.id} delay={index * 80} className="grid">
        <ProjectCard project={project} index={index} headingLevel={2} />
      </Reveal>
    ))}
  </div>
);

export default ProjectsGrid;
