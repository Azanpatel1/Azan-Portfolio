import { Link } from 'react-router-dom';
import { QUOTE } from '../../data/profile';
import Reveal from '../motion/Reveal';

/** One line from the Goal journal, given the room a pull quote needs. */
const Quotation = () => (
  <Reveal as="figure" className="max-w-2xl">
    <blockquote className="border-l-2 border-accent pl-6 sm:pl-8">
      <p className="font-display text-2xl sm:text-3xl italic leading-snug text-text">
        {QUOTE.text}
      </p>
    </blockquote>
    <figcaption className="mt-4 pl-6 sm:pl-8 text-text-subtle italic">
      <Link to={QUOTE.href} className="home-link">
        {QUOTE.source}
      </Link>
    </figcaption>
  </Reveal>
);

export default Quotation;
