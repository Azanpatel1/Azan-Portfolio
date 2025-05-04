import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ProjectsGrid from '../components/projects/ProjectsGrid';

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const tags = [
    'All',
    'Robotics',
    'IoT',
    'AI',
    'Sustainability',
    'Electrical Engineering',
    'Structural Engineering',
    'Materials Science',
    'Automation'
  ];
  
  const handleFilterClick = (tag: string) => {
    setActiveFilter(tag === 'All' ? null : tag);
  };

  return (
    <Layout>
      <section className="pt-40 pb-20">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                My Projects
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-400 max-w-3xl mx-auto">
              A collection of engineering projects that represent my skills, interests, and problem-solving approach.
              Browse through different categories or explore them all.
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleFilterClick(tag)}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all
                  ${activeFilter === (tag === 'All' ? null : tag)
                    ? 'bg-accent text-white'
                    : 'bg-dark-light text-gray-400 hover:bg-dark-lighter'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* Projects */}
          <ProjectsGrid filterTag={activeFilter || undefined} />
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage; 