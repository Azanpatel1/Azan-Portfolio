import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Reveal from '../components/motion/Reveal';
import Lightbox from '../components/ui/Lightbox';
import SectionHeader from '../components/ui/SectionHeader';
import Tag from '../components/ui/Tag';
import { ArrowLeft, ArrowRight, Plus } from '../components/ui/Icon';
import usePageTitle from '../hooks/usePageTitle';
import { PROJECTS, getProjectById } from '../data/projects';
import type { ProjectData } from '../data/projects';
import type { LightboxItem } from '../components/ui/Lightbox';
import Tick from '../components/ui/Tick';

/** Entrance order for the header block: breadcrumb, index rule, title, lead, tags, plate. */
const STEP = 70;

const pad = (n: number) => String(n).padStart(2, '0');

/** A faint diagonal hatch behind every plate, so an image lands on a drawn surface rather than a blank. */
const HATCH =
  'plate-hatch';

const EASE = 'ease-house';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;
  usePageTitle(project ? project.title : 'Project not found');

  return (
    <Layout>
      {project ? <ProjectArticle key={project.id} project={project} /> : <NotFound slug={id ?? ''} />}
    </Layout>
  );
};

/** Keyed on the project so prev/next navigation starts each article fresh. */
const ProjectArticle = ({ project }: { project: ProjectData }) => {
  const [open, setOpen] = useState<number | null>(null);

  const position = PROJECTS.findIndex((p) => p.id === project.id);
  const number = pad(position + 1);
  const total = PROJECTS.length;
  const previous = PROJECTS[(position - 1 + total) % total];
  const next = PROJECTS[(position + 1) % total];

  const gallery = project.gallery ?? [];
  const figures: LightboxItem[] = [
    { src: project.image, alt: project.title, caption: `Figure 01 · ${project.title}` },
    ...gallery.map((src, i) => ({
      src,
      alt: `${project.title} — figure ${i + 2}`,
      caption: `Figure ${pad(i + 2)} · ${project.title}`,
    })),
  ];

  const paragraphs = (project.longDescription ?? project.description)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="pt-32 pb-24 sm:pt-40 sm:pb-28">
      <div className="container">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-text-subtle min-w-0">
              <li className="shrink-0">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2 hover:text-text transition-colors"
                >
                  <ArrowLeft
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${EASE} motion-safe:group-hover:-translate-x-0.5`}
                  />
                  Projects
                </Link>
              </li>
              <li aria-hidden="true" className="shrink-0 text-ink-edge">
                /
              </li>
              <li aria-current="page" className="truncate text-text-muted">
                {project.title}
              </li>
            </ol>
          </nav>
        </Reveal>

        <Reveal delay={STEP} className="flex items-center gap-4 mb-6">
          <span className="font-mono text-xs text-accent tracking-[0.2em]">PRJ-{number}</span>
          <span className="flex-1 h-px bg-ink-line rule-draw" />
          {project.year && (
            <span className="font-mono text-xs text-text-subtle tracking-[0.2em]">{project.year}</span>
          )}
        </Reveal>

        <Reveal delay={STEP * 2}>
          <h1 className="text-4xl sm:text-5xl font-medium text-text leading-tight tracking-tight max-w-3xl">
            {project.title}
          </h1>
        </Reveal>

        <Reveal delay={STEP * 3}>
          <p className="mt-6 text-text-muted text-lg max-w-2xl leading-relaxed">{project.description}</p>
        </Reveal>

        <Reveal delay={STEP * 4} className="mt-8 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Reveal>

        <Reveal as="figure" delay={STEP * 5} className="group relative mt-12 border border-ink-line bg-ink-surface">
          <Tick className="-top-1.5 -left-1.5" />
          <Tick className="-top-1.5 -right-1.5" />
          <Tick className="-bottom-1.5 -left-1.5" />
          <Tick className="-bottom-1.5 -right-1.5" />

          <button
            type="button"
            onClick={() => setOpen(0)}
            aria-label={`Enlarge figure 1, ${project.title}`}
            className={`block w-full aspect-[16/10] overflow-hidden p-4 sm:p-8 ${HATCH}`}
          >
            <PlateImage
              src={project.image}
              alt={project.title}
              className="w-full h-full object-contain"
            />
          </button>

          <figcaption className="border-t border-ink-line px-4 py-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
            <span className="truncate">FIG. 01 · {project.title}</span>
            <span className="shrink-0 inline-flex items-center gap-1.5 transition-colors duration-300 group-hover:text-accent">
              <span className="hidden sm:inline">Enlarge</span>
              <Plus className="w-3.5 h-3.5" />
            </span>
          </figcaption>
        </Reveal>

        {gallery.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mt-8">
            <Reveal className="flex items-center gap-4 mb-4">
              <h2 id="gallery-heading" className="label">
                Gallery
              </h2>
              <span className="flex-1 h-px bg-ink-line rule-draw" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
                {pad(gallery.length)} FIGURES
              </span>
            </Reveal>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((src, i) => {
                const figure = pad(i + 2);
                return (
                  <Reveal as="li" key={src} delay={i * 60} className="grid">
                    <button
                      type="button"
                      onClick={() => setOpen(i + 1)}
                      aria-label={`Open figure ${i + 2}, ${project.title}`}
                      className={`group card-lift relative aspect-[4/3] overflow-hidden border border-ink-line bg-ink-surface p-3 sm:p-4 ${HATCH}`}
                    >
                      <PlateImage
                        src={src}
                        alt=""
                        loading="lazy"
                        className={`w-full h-full object-contain transition-transform duration-500 ${EASE} motion-safe:group-hover:scale-[1.03]`}
                      />
                      {/* Corner plates, so the label and the affordance never sit on the drawing itself. */}
                      <span className="absolute top-0 left-0 border-r border-b border-ink-line bg-ink px-2 py-1 font-mono text-[10px] leading-none tracking-[0.2em] text-text-subtle transition-colors duration-300 group-hover:border-ink-edge group-hover:text-text-muted">
                        FIG. {figure}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 right-0 w-6 h-6 inline-flex items-center justify-center border-l border-t border-ink-line bg-ink text-text-subtle transition-colors duration-300 group-hover:border-accent group-hover:text-accent"
                      >
                        <Plus className="w-3 h-3" />
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-16 sm:mt-20 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-accent tracking-[0.2em]">01</span>
              <span className="label">Overview</span>
              <span className="flex-1 h-px bg-ink-line rule-draw" />
            </div>
            <div className="max-w-prose space-y-5 leading-relaxed">
              {paragraphs.map((text, i) => (
                <p key={i} className={i === 0 ? 'text-lg text-text' : 'text-text-muted'}>
                  {text}
                </p>
              ))}
            </div>
          </Reveal>

          <aside aria-label="Project details" className="lg:col-span-4">
            <Reveal delay={100} className="lg:sticky lg:top-24 border border-ink-line">
              <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between gap-4">
                <span className="label">Details</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
                  {number} / {pad(total)}
                </span>
              </div>
              <dl className="divide-y divide-ink-line">
                <DetailRow label="Index">
                  <span className="font-mono text-xs tracking-[0.2em] text-accent">PRJ-{number}</span>
                </DetailRow>
                <DetailRow label="Year">{project.year ?? '—'}</DetailRow>
                <DetailRow label="Role">{project.role ?? '—'}</DetailRow>
                <DetailRow label="Discipline">{project.tags[0] ?? '—'}</DetailRow>
                <DetailRow label="Figures">{pad(figures.length)}</DetailRow>
              </dl>
            </Reveal>
          </aside>
        </div>

        {total > 1 && (
          <nav
            aria-label="Neighbouring projects"
            className="mt-16 sm:mt-20 grid sm:grid-cols-2 border border-ink-line divide-y sm:divide-y-0 sm:divide-x divide-ink-line"
          >
            <Reveal className="grid">
              <NeighbourLink project={previous} index={(position - 1 + total) % total} direction="previous" />
            </Reveal>
            <Reveal delay={80} className="grid">
              <NeighbourLink project={next} index={(position + 1) % total} direction="next" />
            </Reveal>
          </nav>
        )}
      </div>

      <Lightbox items={figures} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />
    </article>
  );
};

interface PlateImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/** An image that fades in over the hatched plate once it has actually arrived. */
const PlateImage = ({ src, alt, className = '', loading }: PlateImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

const DetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle self-center">{label}</dt>
    <dd className="text-text col-span-2">{children}</dd>
  </div>
);

interface NeighbourLinkProps {
  project: ProjectData;
  index: number;
  direction: 'previous' | 'next';
}

const NeighbourLink = ({ project, index, direction }: NeighbourLinkProps) => {
  const isNext = direction === 'next';
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`group flex flex-col gap-3 p-5 sm:p-6 h-full hover:bg-ink-surface transition-colors ${
        isNext ? 'sm:items-end sm:text-right' : ''
      }`}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
        {!isNext && (
          <ArrowLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${EASE} motion-safe:group-hover:-translate-x-0.5`} />
        )}
        {isNext ? 'Next project' : 'Previous project'}
        {isNext && (
          <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${EASE} motion-safe:group-hover:translate-x-0.5`} />
        )}
      </span>
      <span className={`flex items-baseline gap-3 ${isNext ? 'sm:flex-row-reverse' : ''}`}>
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">PRJ-{pad(index + 1)}</span>
        <span className="text-lg text-text leading-snug transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </span>
      </span>
    </Link>
  );
};

/** The 404 branch: the same header register as every page, then the catalogue so nobody is stranded. */
const NotFound = ({ slug }: { slug: string }) => (
  <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
    <div className="container">
      <SectionHeader
        level={1}
        index="404"
        label="Not found"
        title="There is no project at this address."
        description={
          slug
            ? `Nothing in the catalogue is filed under “${slug}”. The full list is below.`
            : 'The full catalogue is below.'
        }
        action={
          <Link
            to="/projects"
            className="group hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${EASE} motion-safe:group-hover:-translate-x-0.5`} />
            All projects
          </Link>
        }
      />

      <Reveal delay={120} className="border border-ink-line max-w-3xl">
        <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between gap-4">
          <span className="label">Catalogue</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">{pad(PROJECTS.length)} ENTRIES</span>
        </div>
        <ol>
          {PROJECTS.map((project, i) => (
            <li key={project.id} className="border-b border-ink-line last:border-b-0">
              <Link
                to={`/projects/${project.id}`}
                className="group arrow-nudge flex items-center gap-5 px-5 py-4 hover:bg-ink-surface transition-colors"
              >
                <span className="font-mono text-xs text-accent tracking-[0.2em] w-16 shrink-0">PRJ-{pad(i + 1)}</span>
                <span className="flex-1 text-base sm:text-lg leading-snug text-text-muted group-hover:text-text transition-colors">
                  {project.title}
                </span>
                {project.year && (
                  <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] text-text-subtle">
                    {project.year}
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-text-subtle group-hover:text-accent transition-colors" />
              </Link>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-8 md:hidden">
        <Link to="/projects" className="btn btn-ghost w-full group">
          <ArrowLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${EASE} motion-safe:group-hover:-translate-x-0.5`} />
          All projects
        </Link>
      </div>
    </div>
  </section>
);

export default ProjectDetailPage;
