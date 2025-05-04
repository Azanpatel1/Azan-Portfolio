import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Skills from '../components/home/Skills';
import Contact from '../components/home/Contact';
import ProjectsGrid from '../components/projects/ProjectsGrid';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      
      <About />
      
      <section id="projects" className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                Featured Projects
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-400 max-w-3xl mx-auto">
              Explore some of my most significant engineering projects that showcase my skills, creativity and problem-solving approach.
            </p>
          </div>
          
          <ProjectsGrid limit={3} />
          
          <div className="mt-12 text-center">
            <a 
              href="/projects" 
              className="btn btn-primary inline-flex items-center"
            >
              View All Projects
              <svg 
                className="w-5 h-5 ml-2" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      <Skills />
      
      <Contact />
    </Layout>
  );
};

export default HomePage; 