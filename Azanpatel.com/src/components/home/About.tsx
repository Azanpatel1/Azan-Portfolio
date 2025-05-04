import React from 'react';

const About = () => {
  return (
    <section id="about" className="section bg-dark-light">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              About Me
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-6">Engineering Student & Innovator</h3>
            
            <div className="space-y-4 text-gray-300">
              <p>
                I'm an engineering student passionate about applying cutting-edge technology to solve real-world problems. 
                My academic journey has equipped me with strong fundamentals in [Your Engineering Field] and a drive for innovation.
              </p>
              
              <p>
                With a focus on [mention specialization areas], I've developed expertise in designing and implementing solutions that 
                combine technical excellence with practical application. My approach is guided by a belief in sustainable engineering 
                and human-centered design.
              </p>
              
              <p>
                Beyond academics, I'm actively involved in [mention relevant activities, clubs, or initiatives] where I collaborate 
                with fellow engineers to push the boundaries of what's possible.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="card">
                <div className="text-accent text-xl font-bold mb-2">Education</div>
                <div className="font-medium">University Name</div>
                <div className="text-sm text-gray-400">B.S. in Engineering</div>
                <div className="text-sm text-gray-400">Class of 20XX</div>
              </div>
              
              <div className="card">
                <div className="text-accent text-xl font-bold mb-2">Location</div>
                <div className="font-medium">City, State</div>
                <div className="text-sm text-gray-400">Available for opportunities</div>
                <div className="text-sm text-gray-400">Locally & Remotely</div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-lg rounded-lg"></div>
              <div className="relative p-1 bg-gradient-to-r from-primary to-accent rounded-lg">
                <div className="bg-dark-light p-6 rounded-md">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 font-mono text-sm text-gray-400">about.tsx</div>
                  </div>
                  
                  <div className="font-mono text-sm">
                    <div className="mb-1"><span className="text-primary-light">const</span> <span className="text-accent">engineer</span> = {"{"}</div>
                    <div className="mb-1 pl-4"><span className="text-primary-light">name</span>: <span className="text-white">'Your Name'</span>,</div>
                    <div className="mb-1 pl-4"><span className="text-primary-light">focus</span>: <span className="text-white">'Engineering Field'</span>,</div>
                    <div className="mb-1 pl-4"><span className="text-primary-light">skills</span>: [<span className="text-white">'Technical', 'Analytical', 'Problem-Solving'</span>],</div>
                    <div className="mb-1 pl-4"><span className="text-primary-light">passionate</span>: <span className="text-white">true</span>,</div>
                    <div className="mb-1 pl-4"><span className="text-primary-light">innovative</span>: <span className="text-white">true</span>,</div>
                    <div className="mb-1">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 