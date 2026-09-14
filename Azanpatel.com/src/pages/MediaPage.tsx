import Layout from '../components/layout/Layout';
import MediaEmbed from '../components/media/MediaEmbed';
import SectionHeader from '../components/ui/SectionHeader';
import { MEDIA } from '../data/media';

const MediaPage = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            index="—"
            label="Media"
            title="Podcasts, talks, and conversations."
            description="Recorded appearances where I talk through the work and the thinking behind it. Play them here or open them on Spotify."
          />

          <div className="grid gap-8 max-w-3xl">
            {MEDIA.map((item, index) => (
              <MediaEmbed key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MediaPage;
