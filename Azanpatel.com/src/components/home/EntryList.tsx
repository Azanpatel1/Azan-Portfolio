import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';

export interface Entry {
  id: string;
  title: string;
  /** Year, range, or venue line set under the title. */
  meta?: string;
  description?: string;
  /** Internal route, or an external URL. */
  href?: string;
  external?: boolean;
}

/**
 * The editorial list the home page is built from: title, a line of context,
 * and a sentence. No cards — the rhythm comes from the space between entries.
 */
const EntryList = ({ entries }: { entries: Entry[] }) => (
  <ol className="space-y-8">
    {entries.map((entry, i) => (
      <Reveal as="li" key={entry.id} delay={Math.min(i, 5) * 70} className="max-w-2xl">
        <h3 className="text-xl sm:text-2xl leading-snug text-text">
          {entry.href ? (
            entry.external ? (
              <a href={entry.href} target="_blank" rel="noreferrer noopener" className="home-link">
                {entry.title}
              </a>
            ) : (
              <Link to={entry.href} className="home-link">
                {entry.title}
              </Link>
            )
          ) : (
            entry.title
          )}
        </h3>
        {entry.meta && <p className="mt-0.5 italic text-text-subtle tabular">{entry.meta}</p>}
        {entry.description && (
          <p className="mt-2 leading-relaxed text-text-muted">{entry.description}</p>
        )}
      </Reveal>
    ))}
  </ol>
);

export default EntryList;
