import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectData } from '../../data/projects';
import Tag from '../ui/Tag';
import { ArrowRight } from '../ui/Icon';

/** A faint diagonal hatch behind the plate, so the image lands on a drawn surface rather than a blank. */
const HATCH =
  'plate-hatch';

export interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const number = String(index + 1).padStart(2, '0');

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group card-lift arrow-nudge flex flex-col h-full border border-ink-line"
    >
      <div
        className={`relative aspect-[4/3] flex items-center justify-center overflow-hidden border-b border-ink-line bg-ink-surface p-3 sm:p-4 ${HATCH}`}
      >
        <img
          ref={imgRef}
          src={project.image}
          alt={project.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-[opacity,filter,transform] duration-500 ease-house motion-safe:group-hover:scale-[1.02] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {project.featured && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 border border-accent bg-ink text-accent font-mono text-[10px] uppercase tracking-[0.2em] leading-none px-2 py-1.5">
            <span aria-hidden="true" className="w-1 h-1 bg-accent" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-4 mb-3 font-mono text-[10px] tracking-[0.2em] text-text-subtle">
          <span>PRJ-{number}</span>
          {project.year && <span>{project.year}</span>}
        </div>

        <h3 className="text-xl font-medium text-text leading-snug mb-2 transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </h3>

        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <Tag key={tag} className="group-hover:border-ink-edge">
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-auto pt-3.5 border-t border-ink-line flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle">
          <span className="truncate">{project.role ?? 'Project'}</span>
          <span className="shrink-0 inline-flex items-center gap-1 transition-colors duration-300 group-hover:text-accent">
            Open
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
