import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getProjectById } from '../data/projects';
import Hand from '../handwriting/Hand';
import InkText from '../handwriting/InkText';

/**
 * paragraphs longer than this are revealed word-wise (InkText) instead of stroke-traced:
 * ~350 characters is ~300 animated paths at phone widths, the most a low-tier phone starts
 * in one frame without a visible hitch (limiter.ts must waive its budget for a lone block)
 */
const LONG_PARAGRAPH = 350;

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <Layout>
        <section className="pt-40 pb-28">
          <div className="container text-center">
            <Hand as="p" className="label mb-4">404</Hand>
            <Hand as="h1" roughSm className="text-3xl font-medium text-text mb-6">Project not found</Hand>
            <Link to="/projects" className="btn btn-ghost"><Hand>Back to projects</Hand></Link>
          </div>
        </section>
      </Layout>
    );
  }

  const body = project.longDescription ?? project.description;

  return (
    <Layout>
      <article className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <Link
            to="/projects"
            className="font-mono text-xs uppercase tracking-[0.2em] text-text-subtle hover:text-text transition-colors inline-flex items-center gap-2 mb-10"
          >
            {/* the face has no arrow glyph: a stroked one in currentColor instead of a system-font
                fallback; it sits outside the Hand (like the card arrows) so it is never hidden */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 10H4m0 0l5-5m-5 5l5 5" />
            </svg>
            <Hand>All Projects</Hand>
          </Link>

          <Hand as="div" className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-accent tracking-[0.2em]">
              PRJ-{String(project.id).split('-')[0].toUpperCase()}
            </span>
            <span className="flex-1 h-px bg-ink-line" />
            {project.year && (
              <span className="font-mono text-xs text-text-subtle tracking-[0.2em]">{project.year}</span>
            )}
          </Hand>

          <Hand as="h1" rough className="text-4xl sm:text-5xl font-medium text-text leading-tight max-w-3xl">
            {project.title}
          </Hand>

          <Hand as="p" className="mt-6 text-text-muted text-lg max-w-2xl leading-relaxed">
            {project.description}
          </Hand>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Hand
                key={tag}
                className="tag font-mono text-[11.5px] uppercase tracking-[0.15em] text-text-subtle border border-ink-line px-2 py-1"
              >
                {tag}
              </Hand>
            ))}
          </div>

          <div className="mt-12 border border-ink-line bg-ink">
            <div className="aspect-[16/10] w-full flex items-center justify-center p-4 sm:p-8">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-6">
              <Hand as="p" className="label mb-4">Gallery</Hand>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.gallery.map((src, i) => (
                  <div
                    key={src}
                    className="border border-ink-line bg-ink aspect-[4/3] flex items-center justify-center p-3 sm:p-4"
                  >
                    <img
                      src={src}
                      alt={`${project.title} — figure ${i + 1}`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-5 text-text-muted leading-relaxed">
              {body.length > LONG_PARAGRAPH ? <InkText as="p">{body}</InkText> : <Hand as="p">{body}</Hand>}
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-ink-line">
                <div className="px-5 py-3 border-b border-ink-line">
                  <Hand className="label">Details</Hand>
                </div>
                <dl className="divide-y divide-ink-line">
                  <DetailRow label="Year" value={project.year ?? '—'} />
                  <DetailRow label="Role" value={project.role ?? '—'} />
                  <DetailRow label="Discipline" value={project.tags[0] ?? '—'} />
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </Layout>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Hand as="div" className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
    <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-text-subtle">{label}</dt>
    <dd className="text-text col-span-2">{value}</dd>
  </Hand>
);

export default ProjectDetailPage;
