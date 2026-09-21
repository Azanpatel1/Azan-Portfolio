import { AFFILIATIONS, EDUCATION, PROFILE } from '../../data/profile';
import type { Affiliation } from '../../data/profile';
import Reveal from '../motion/Reveal';

/** The statement, the paragraph under it, and the posts held — in that order. */
const Introduction = () => (
  <section aria-labelledby="intro-heading" className="max-w-2xl">
    <h2 id="intro-heading" className="sr-only">
      About
    </h2>

    <Reveal>
      <p className="font-display text-3xl sm:text-4xl leading-[1.15] text-text">
        {PROFILE.statement}
      </p>
    </Reveal>

    <Reveal delay={90}>
      <p className="mt-6 text-lg leading-relaxed text-text-muted">{PROFILE.bio}</p>
    </Reveal>

    <Reveal delay={180} className="mt-10 space-y-8">
      <Group title="Education" items={EDUCATION} />
      <Group title="Positions" items={AFFILIATIONS} />
    </Reveal>
  </section>
);

const Group = ({ title, items }: { title: string; items: Affiliation[] }) => (
  <div>
    <h3 className="text-base italic text-text-subtle">{title}</h3>
    <ul className="mt-3 space-y-3">
      {items.map((item) => (
        <li key={`${item.org}-${item.role}`} className="sm:flex sm:items-baseline sm:gap-6">
          <p className="leading-snug text-text sm:flex-1">
            {item.org}
            {item.unit && <span className="text-text-muted"> · {item.unit}</span>}
          </p>
          <p className="text-text-subtle italic tabular sm:text-right sm:shrink-0">
            {item.role} · {item.period}
            {item.upcoming && <span className="text-accent"> · upcoming</span>}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

export default Introduction;
