import Layout from '../components/layout/Layout';
import MediaEmbed, { MediaDetails } from '../components/media/MediaEmbed';
import Reveal from '../components/motion/Reveal';
import SectionHeader from '../components/ui/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';
import { pad } from '../lib/format';
import { MEDIA } from '../data/media';

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
              <span className="meta">
                {pad(MEDIA.length)} {MEDIA.length === 1 ? 'Recording' : 'Recordings'}
              </span>
            }
          />

          {/* Each recording is a plate with its details alongside, the way a project page is split. */}
          <ol className="space-y-12 lg:space-y-16">
            {MEDIA.map((item, i) => (
              <Reveal
                as="li"
                key={item.id}
                delay={i * 90}
                className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-start"
              >
                <div className="lg:col-span-8">
                  <MediaEmbed item={item} index={i} />
                </div>
                <aside aria-label="Recording details" className="lg:col-span-4">
                  <MediaDetails item={item} index={i} total={MEDIA.length} />
                </aside>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
};

export default MediaPage;
