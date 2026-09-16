import Layout from '../components/layout/Layout';
import MediaEmbed from '../components/media/MediaEmbed';
import Reveal from '../components/motion/Reveal';
import SectionHeader from '../components/ui/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';
import { MEDIA } from '../data/media';

const pad = (n: number) => String(n).padStart(2, '0');

const MediaPage = () => {
  usePageTitle('Media');

  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            level={1}
            index="—"
            label="Media"
            title="Podcasts, talks, and conversations."
            description="Recorded appearances where I talk through the work and the thinking behind it. Play them here or open them on Spotify."
            action={
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-subtle">
                {pad(MEDIA.length)} {MEDIA.length === 1 ? 'RECORDING' : 'RECORDINGS'}
              </span>
            }
          />

          {/* A plate list: on lg the number sits in the margin, the way figures are indexed. */}
          <ol className="max-w-3xl">
            {MEDIA.map((item, i) => (
              <Reveal
                as="li"
                key={item.id}
                delay={i * 90}
                className="lg:grid lg:grid-cols-[4rem_1fr] mb-8 last:mb-0"
              >
                <span
                  aria-hidden="true"
                  className="hidden lg:block pt-5 font-mono text-xs text-accent tracking-[0.2em]"
                >
                  {pad(i + 1)}
                </span>
                <MediaEmbed item={item} index={i} />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
};

export default MediaPage;
