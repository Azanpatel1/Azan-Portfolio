import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-28 border-b border-ink-line">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-accent" />
              <span className="label">Translational Neuroengineering</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight text-text">
              Translational
              <br />
              Neuroengineering.
            </h1>

            <p className="mt-6 text-text-muted/90 text-base sm:text-lg italic max-w-xl leading-relaxed">
              I&rsquo;m obsessed with brain-machine interfaces, neuroplasticity, and enhancing human experience.
            </p>

            <p className="mt-6 text-text-muted text-lg max-w-xl leading-relaxed">
              I'm Azan Patel &mdash; Engineer, Entrepreneur, and Researcher solving real clinical
              problems focused on the brain, leveraging closed-loop neuromodulation, computational
              neuroscience, and hardware engineering to tackle Stroke, Alzheimer's, and
              Psychotherapy.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/goal" className="btn btn-primary">
                The Goal
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative border border-ink-line bg-ink-surface">
              <Tick className="-top-1.5 -left-1.5" />
              <Tick className="-top-1.5 -right-1.5" />
              <Tick className="-bottom-1.5 -left-1.5" />
              <Tick className="-bottom-1.5 -right-1.5" />

              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/Azan.jpg"
                  alt="Azan Patel"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="border-t border-ink-line px-4 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                <span>AP—001</span>
                <span>UC Davis · 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Tick = ({ className = '' }: { className?: string }) => (
  <span className={`absolute w-3 h-3 border border-text-muted ${className}`} />
);

export default Hero;
