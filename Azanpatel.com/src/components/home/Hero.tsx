import React from 'react';

const Hero = () => {
  return (
    <section className="relative pb-20 pt-40 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent opacity-5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-2 bg-dark-lighter rounded-full mb-6">
              <span className="text-gray-400">Engineering Student</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Future Engineer.</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                Innovative Thinker.
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Creating tomorrow's solutions today. Passionate about designing and building innovative engineering projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="#projects" 
                className="btn btn-primary"
              >
                View My Work
                <svg 
                  className="w-5 h-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </a>
              <a 
                href="#contact" 
                className="btn border border-gray-600 text-white hover:bg-dark-lighter"
              >
                Contact Me
              </a>
            </div>
            
            <div className="mt-12 flex items-center justify-center md:justify-start gap-6">
              <p className="text-gray-500">Find me on</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative border-2 border-dark-lighter bg-dark-light rounded-lg p-1 shadow-xl">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-md"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-md"></div>
              <div className="absolute top-1/2 -right-3 w-4 h-20 bg-primary-light rounded-md transform -translate-y-1/2"></div>
              <div className="absolute top-1/4 -left-3 w-4 h-10 bg-accent rounded-md"></div>
              
              <div className="w-full aspect-[4/3] rounded bg-gradient-to-br from-dark to-dark-light flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="relative w-52 h-52 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 animate-pulse-slow"></div>
                    <div className="absolute inset-2 rounded-full bg-dark"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-9xl font-black text-white opacity-20">AP</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-light">
                      <span>YOUR PHOTO HERE</span>
                    </div>
                  </div>
                  <div className="mt-6 text-accent font-mono">
                    <span>Engineering_Student.exe</span>
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

export default Hero; 