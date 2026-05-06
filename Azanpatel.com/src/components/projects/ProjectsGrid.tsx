import ProjectCard from './ProjectCard';
import { PROJECTS } from '../../data/projects';

interface ProjectsGridProps {
  limit?: number;
}

const ProjectsGrid = ({ limit }: ProjectsGridProps) => {
  const projects = limit ? PROJECTS.slice(0, limit) : PROJECTS;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
