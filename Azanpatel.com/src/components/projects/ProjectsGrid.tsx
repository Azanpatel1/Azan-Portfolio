import ProjectCard from './ProjectCard';
import Reveal from '../motion/Reveal';
import { PROJECTS } from '../../data/projects';

interface ProjectsGridProps {
  limit?: number;
}

const ProjectsGrid = ({ limit }: ProjectsGridProps) => {
  const projects = limit ? PROJECTS.slice(0, limit) : PROJECTS;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <Reveal key={project.id} delay={index * 80} className="grid">
          <ProjectCard project={project} index={index} />
        </Reveal>
      ))}
    </div>
  );
};

export default ProjectsGrid;
