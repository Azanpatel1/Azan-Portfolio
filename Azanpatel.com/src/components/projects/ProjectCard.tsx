import { Link } from 'react-router-dom';
import { ProjectData } from '../../data/projects';

export interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link to={`/projects/${project.id}`} className="group block border border-ink-line hover:border-ink-edge transition-colors">
      <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden bg-ink border-b border-ink-line p-2 sm:p-3">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        {project.featured && (
          <span className="absolute top-3 right-3 bg-accent text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">PRJ-{number}</span>
          {project.year && (
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">{project.year}</span>
          )}
        </div>

        <h3 className="text-xl font-medium text-text mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle border border-ink-line px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
