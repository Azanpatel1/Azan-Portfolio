import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Masthead from '../components/home/Masthead';
import Introduction from '../components/home/Introduction';
import Quotation from '../components/home/Quotation';
import FundingList from '../components/home/FundingList';
import EntryList from '../components/home/EntryList';
import type { Entry } from '../components/home/EntryList';
import Reveal from '../components/motion/Reveal';
import Tick from '../components/ui/Tick';
import { PROFILE } from '../data/profile';
import { FUNDING } from '../data/funding';
import { RESEARCH } from '../data/research';
import { PROJECTS } from '../data/projects';

/** How many of the sixteen research entries the landing page carries. */
const RESEARCH_SHOWN = 6;

const researchEntries: Entry[] = RESEARCH.slice(0, RESEARCH_SHOWN).map((item) => ({
  id: item.id,
  title: item.title,
  meta: [item.venue, item.year].filter(Boolean).join(' · '),
  description: item.description,
  href: item.driveUrl,
  external: true,
}));

const projectEntries: Entry[] = PROJECTS.map((project) => ({
  id: project.id,
  title: project.title,
  meta: [project.year, project.role].filter(Boolean).join(' · '),
  description: project.description,
  href: `/projects/${project.id}`,
}));

const HomePage = () => (
  <Layout>
    <div className="container max-w-3xl pb-24">
      <Masthead />

      <Rule className="mt-10" />

      <Reveal as="figure" className="mt-10 max-w-xl">
        <div className="relative border border-ink-line bg-ink-surface">
          <Tick className="-top-1.5 -left-1.5" />
          <Tick className="-top-1.5 -right-1.5" />
          <Tick className="-bottom-1.5 -left-1.5" />
          <Tick className="-bottom-1.5 -right-1.5" />
          <img
            src={PROFILE.portrait.src}
            alt={PROFILE.portrait.alt}
            className="block w-full h-auto"
          />
        </div>
      </Reveal>

      <div className="mt-12">
        <Introduction />
      </div>

      <Rule className="mt-16" />

      <div className="mt-12">
        <Quotation />
      </div>

      <Rule className="mt-16" />

      {FUNDING.length > 0 && (
        <Section title="Funding">
          <FundingList />
        </Section>
      )}

      <Section title="Research" action={{ to: '/research', label: 'All research' }}>
        <EntryList entries={researchEntries} />
      </Section>

      <Section title="Side projects" action={{ to: '/projects', label: 'All projects' }}>
        <EntryList entries={projectEntries} />
      </Section>
    </div>
  </Layout>
);

const Rule = ({ className = '' }: { className?: string }) => (
  <div className={`h-px bg-ink-line ${className}`.trim()} aria-hidden="true" />
);

interface SectionProps {
  title: string;
  action?: { to: string; label: string };
  children: ReactNode;
}

const Section = ({ title, action, children }: SectionProps) => (
  <section className="mt-14">
    <Reveal className="flex items-baseline justify-between gap-6 mb-8">
      <h2 className="text-3xl sm:text-4xl font-normal leading-none text-text">{title}</h2>
      {action && (
        <Link to={action.to} className="home-link shrink-0 text-text-muted">
          {action.label}
        </Link>
      )}
    </Reveal>
    {children}
  </section>
);

export default HomePage;
