import { Link } from 'react-router-dom';
import { CONTACT } from '../../data/contact';
import { PROFILE } from '../../data/profile';
import Reveal from '../motion/Reveal';

const QUICK_LINKS = [
  { to: '/research', label: 'Research' },
  { to: '/projects', label: 'Projects' },
  { to: '/goal', label: 'Goal' },
];

const ELSEWHERE = [
  { href: `mailto:${CONTACT.email}`, label: 'Email' },
  { href: CONTACT.linkedin.href, label: 'LinkedIn' },
  { href: CONTACT.github.href, label: 'GitHub' },
];

/** Name, what this is, and the two ways out of the page — the way a title page opens. */
const Masthead = () => (
  <Reveal as="header" className="pt-16 sm:pt-20">
    <h1 className="text-4xl sm:text-5xl font-normal leading-none tracking-tight text-text">
      {PROFILE.name}
    </h1>
    <p className="mt-2 text-lg sm:text-xl italic text-text-muted">~ {PROFILE.tagline}</p>

    <nav aria-label="Sections" className="mt-7 flex flex-wrap items-baseline gap-x-7 gap-y-2">
      {QUICK_LINKS.map((item) => (
        <Link key={item.to} to={item.to} className="home-link text-lg">
          {item.label}
        </Link>
      ))}
    </nav>

    <ul className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
      {ELSEWHERE.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer noopener"
            className="home-link text-base text-text-muted"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </Reveal>
);

export default Masthead;
