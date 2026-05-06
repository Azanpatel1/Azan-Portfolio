import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import SectionHeader from '../components/ui/SectionHeader';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <About />

      <section id="projects" className="section border-b border-ink-line">
        <div className="container">
          <SectionHeader
            index="02"
            label="Selected work"
            title="Projects spanning aerospace, medical devices, and product design."
          />

          <ProjectsGrid limit={3} />

          <div className="mt-12 flex justify-start">
            <Link to="/projects" className="btn btn-ghost">
              View All Projects
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Contact />
    </Layout>
  );
};

export default HomePage;
