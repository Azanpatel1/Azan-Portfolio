import { FUNDING } from '../../data/funding';
import Reveal from '../motion/Reveal';

/** Grants and fellowships. Renders nothing while the data file is empty. */
const FundingList = () => {
  if (FUNDING.length === 0) return null;
  return (
    <ol className="space-y-5 max-w-2xl">
      {FUNDING.map((item, i) => (
        <Reveal as="li" key={item.title} delay={Math.min(i, 6) * 60}>
          <p className="text-xl leading-snug text-text">{item.title}</p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-x-4 text-text-subtle italic tabular">
            <span>{item.source ? `${item.source} · ${item.period}` : item.period}</span>
            {item.amount && <span className="text-accent not-italic">{item.amount}</span>}
          </p>
        </Reveal>
      ))}
    </ol>
  );
};

export default FundingList;
