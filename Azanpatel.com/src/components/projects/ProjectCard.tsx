import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectData } from '../../data/projects';
import Tag from '../ui/Tag';
import { ArrowRight } from '../ui/Icon';
import { pad } from '../../lib/format';

export interface ProjectCardProps {
  project: ProjectData;
  index: number;
  /** h2 on the listing page, where the card sits straight under the page h1; h3 under a section heading. */
  headingLevel?: 2 | 3;
}

const ProjectCard = ({ project, index, headingLevel = 3 }: ProjectCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const number = pad(index + 1);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

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
      {/* A faint diagonal hatch behind the plate, so the image lands on a drawn surface rather than a blank. */}
      <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden border-b border-ink-line bg-ink-surface p-3 sm:p-4 plate-hatch">
        {/* Decorative here: the heading in the same link already names the project. */}
        <img
          ref={imgRef}
          src={project.image}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-[opacity,filter,transform] duration-500 ease-house motion-safe:group-hover:scale-[1.02] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* The same corner tab the research cards carry for their type, set in the accent. */}
        {project.featured && (
          <span className="absolute top-0 right-0 inline-flex items-center gap-1.5 border-l border-b border-accent bg-ink meta text-accent px-2 py-1">
            <span aria-hidden="true" className="w-1 h-1 bg-accent" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-4 mb-3 meta">
          <span>PRJ-{number}</span>
          {project.year && <span>{project.year}</span>}
        </div>

        <Heading className="text-xl font-medium text-text leading-snug mb-2 transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </Heading>

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
