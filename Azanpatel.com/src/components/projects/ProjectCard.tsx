import React from 'react';
import { Link } from 'react-router-dom';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <div className="group relative">
      <div 
        className={`
          relative rounded-lg overflow-hidden border-2 border-dark-lighter
          group-hover:border-primary/30 transition-all duration-300
          ${project.featured ? 'md:col-span-2' : ''}
        `}
      >
        {/* Animation elements */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          bg-gradient-to-tr from-primary/20 to-accent/20"></div>
        
        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 blur-xl rounded-lg transition-opacity duration-500"></div>
        
        {/* Project Image with overlay */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={project.image || `https://picsum.photos/seed/${index + 100}/800/500`} 
            alt={project.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-dark bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-300"></div>
          
          {/* Project Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-2 py-1 text-xs rounded-full bg-dark bg-opacity-80 text-white"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent text-white">
                Featured
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 bg-dark-light relative z-10">
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>
          
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center text-primary-light hover:text-accent transition-colors"
          >
            View Project
            <svg 
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 