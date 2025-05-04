import React from 'react';
import ProjectCard, { ProjectData } from './ProjectCard';

const SAMPLE_PROJECTS: ProjectData[] = [
  {
    id: 'autonomous-drone',
    title: 'Autonomous Drone System',
    description: 'Designed and built an autonomous drone system with object detection capabilities using computer vision and machine learning algorithms.',
    tags: ['Robotics', 'AI', 'Computer Vision'],
    image: '/images/project1.jpg',
    featured: true
  },
  {
    id: 'smart-irrigation',
    title: 'Smart Irrigation Controller',
    description: 'Developed an IoT-based smart irrigation system that optimizes water usage based on soil moisture, weather forecasts, and plant needs.',
    tags: ['IoT', 'Embedded Systems', 'Sustainability'],
    image: '/images/project2.jpg',
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Harvester',
    description: 'Created a hybrid solar-wind energy harvesting system with adaptive power management for maximum efficiency in varying conditions.',
    tags: ['Renewable Energy', 'Electrical Engineering', 'Sustainability'],
    image: '/images/project3.jpg',
  },
  {
    id: 'structural-analysis',
    title: 'Structural Analysis Software',
    description: 'Built a computational tool for structural analysis of complex architectural designs, simulating stress distribution and load-bearing capacities.',
    tags: ['Structural Engineering', 'Simulation', 'Software'],
    image: '/images/project4.jpg',
  },
  {
    id: 'material-testing',
    title: 'Advanced Material Testing Apparatus',
    description: 'Engineered a testing apparatus for analyzing mechanical properties of novel composite materials under varying temperature and pressure conditions.',
    tags: ['Materials Science', 'Testing', 'Hardware'],
    image: '/images/project5.jpg',
    featured: true
  },
  {
    id: 'automated-assembly',
    title: 'Automated Assembly Line Optimizer',
    description: 'Designed an optimization system for manufacturing assembly lines that increases throughput by 35% while reducing energy consumption.',
    tags: ['Automation', 'Manufacturing', 'Optimization'],
    image: '/images/project6.jpg',
  }
];

interface ProjectsGridProps {
  limit?: number;
  filterTag?: string;
}

const ProjectsGrid = ({ limit, filterTag }: ProjectsGridProps) => {
  const filteredProjects = filterTag 
    ? SAMPLE_PROJECTS.filter(project => project.tags.includes(filterTag))
    : SAMPLE_PROJECTS;
    
  const displayProjects = limit 
    ? filteredProjects.slice(0, limit)
    : filteredProjects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProjects.map((project, index) => (
        <div 
          key={project.id}
          className={project.featured ? 'lg:col-span-2' : ''}
        >
          <ProjectCard project={project} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid; 