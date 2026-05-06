import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getProjectById } from '../data/projects';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <Layout>
        <section className="pt-40 pb-28">
          <div className="container text-center">
            <p className="label mb-4">404</p>
            <h1 className="text-3xl font-medium text-text mb-6">Project not found</h1>
            <Link to="/projects" className="btn btn-ghost">Back to projects</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <Link
            to="/projects"
            className="font-mono text-xs uppercase tracking-[0.2em] text-text-subtle hover:text-text transition-colors inline-flex items-center gap-2 mb-10"
          >
            <span>←</span>
            <span>All Projects</span>
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-accent tracking-[0.2em]">
              PRJ-{String(project.id).slice(0, 4).toUpperCase()}
            </span>
            <span className="flex-1 h-px bg-ink-line" />
            {project.year && (
              <span className="font-mono text-xs text-text-subtle tracking-[0.2em]">{project.year}</span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-medium text-text leading-tight max-w-3xl">
            {project.title}
          </h1>

          <p className="mt-6 text-text-muted text-lg max-w-2xl leading-relaxed">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle border border-ink-line px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 border border-ink-line bg-ink-surface">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-6">
              <p className="label mb-4">Gallery</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.gallery.map((src, i) => (
                  <div key={src} className="border border-ink-line bg-ink-surface overflow-hidden">
                    <img
                      src={src}
                      alt={`${project.title} — figure ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-5 text-text-muted leading-relaxed">
              <p>{project.longDescription ?? project.description}</p>
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-ink-line">
                <div className="px-5 py-3 border-b border-ink-line">
                  <span className="label">Details</span>
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
  <div className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">{label}</dt>
    <dd className="text-text col-span-2">{value}</dd>
  </div>
);

export default ProjectDetailPage;
