import Layout from '../components/layout/Layout';
import UCDavisHealthInternship from '../components/internships/UCDavisHealthInternship';
import TeslaInternship from '../components/internships/TeslaInternship';
import SectionHeader from '../components/ui/SectionHeader';

const InternshipsPage = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-28">
        <div className="container">
          <SectionHeader
            index="—"
            label="Internships"
            title="Professional experiences shaping my engineering practice."
            description="Field work and observations from internships across biomedical and robotics."
          />

          <div className="space-y-10">
            <UCDavisHealthInternship />
            <TeslaInternship />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InternshipsPage;
