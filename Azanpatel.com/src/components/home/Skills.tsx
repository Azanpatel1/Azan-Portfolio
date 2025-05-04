import React from 'react';

interface Skill {
  name: string;
  level: number;
  category: 'technical' | 'software' | 'soft-skills';
}

const Skills = () => {
  const skills: Skill[] = [
    // Technical skills
    { name: 'Mechanical Design', level: 90, category: 'technical' },
    { name: 'CAD/CAM', level: 85, category: 'technical' },
    { name: 'Circuit Design', level: 75, category: 'technical' },
    { name: 'Materials Science', level: 80, category: 'technical' },
    { name: 'Thermodynamics', level: 70, category: 'technical' },
    
    // Software skills
    { name: 'MATLAB', level: 85, category: 'software' },
    { name: 'Python', level: 80, category: 'software' },
    { name: 'AutoCAD', level: 90, category: 'software' },
    { name: 'Fusion 360', level: 85, category: 'software' },
    { name: 'SolidWorks', level: 75, category: 'software' },
    
    // Soft skills
    { name: 'Problem Solving', level: 90, category: 'soft-skills' },
    { name: 'Team Leadership', level: 85, category: 'soft-skills' },
    { name: 'Project Management', level: 80, category: 'soft-skills' },
    { name: 'Communication', level: 85, category: 'soft-skills' },
    { name: 'Critical Thinking', level: 90, category: 'soft-skills' },
  ];

  const technicalSkills = skills.filter(skill => skill.category === 'technical');
  const softwareSkills = skills.filter(skill => skill.category === 'software');
  const softSkills = skills.filter(skill => skill.category === 'soft-skills');

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              My Skills
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical capabilities, software proficiency, and soft skills
            that I've developed throughout my academic and project experiences.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <SkillCategory title="Technical Skills" skills={technicalSkills} accentColor="from-primary to-primary-light" />
          <SkillCategory title="Software Proficiency" skills={softwareSkills} accentColor="from-primary-light to-accent" />
          <SkillCategory title="Soft Skills" skills={softSkills} accentColor="from-secondary to-accent" />
        </div>
      </div>
    </section>
  );
};

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
  accentColor: string;
}

const SkillCategory = ({ title, skills, accentColor }: SkillCategoryProps) => {
  return (
    <div className="card h-full">
      <h3 className="text-xl font-bold mb-6 pb-4 border-b border-dark-lighter">
        {title}
      </h3>
      <div className="space-y-5">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-gray-400">{skill.level}%</span>
            </div>
            <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${accentColor} rounded-full`} 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills; 