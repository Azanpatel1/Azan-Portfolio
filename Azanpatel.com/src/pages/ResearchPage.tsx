import Layout from '../components/layout/Layout';
import ResearchCard from '../components/research/ResearchCard';
import SectionHeader from '../components/ui/SectionHeader';
import { PROPOSALS, PRESENTATIONS } from '../data/research';

const ResearchPage = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            index="—"
            label="Research"
            title="Research proposals, written reports, and presentations."
            description="Proposals and talks spanning neurotechnology, medical devices, and diagnostics. Each card opens the full document on Google Drive."
          />

          <div className="mb-20">
            <div className="section-header">
              <span className="label">Proposals & Reports</span>
              <span className="section-header-rule" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROPOSALS.map((item, index) => (
                <ResearchCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>

          <div>
            <div className="section-header">
              <span className="label">Presentations</span>
              <span className="section-header-rule" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRESENTATIONS.map((item, index) => (
                <ResearchCard key={item.id} item={item} index={PROPOSALS.length + index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResearchPage;
