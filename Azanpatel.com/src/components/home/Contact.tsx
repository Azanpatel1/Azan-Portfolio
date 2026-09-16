import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Reveal from '../motion/Reveal';
import { ArrowUpRight, Check, Copy } from '../ui/Icon';
import { CONTACT } from '../../data/contact';

const DETAILS = [
  { label: 'Location', value: CONTACT.location },
  { label: 'LinkedIn', value: CONTACT.linkedin.label, href: CONTACT.linkedin.href },
  { label: 'GitHub', value: CONTACT.github.label, href: CONTACT.github.href },
];

/** How long the copy button reads "Copied" before it resets. */
const COPIED_MS = 1500;

const Contact = () => {
  return (
    <section id="contact" className="section scroll-mt-16">
      <div className="container">
        <SectionHeader
          index="04"
          label="Contact"
          title="Have a project or opportunity? Let's talk."
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="text-text-muted leading-relaxed max-w-xl">
              For research, internships, or a conversation about neurotechnology &mdash;
              email is the best way to reach me.
            </p>
            <EmailRow />
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-2">
              <span className="label">Details</span>
              <span className="flex-1 h-px bg-ink-line" />
            </div>
            <dl>
              {DETAILS.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr] items-baseline gap-4 py-4 border-b border-ink-line"
                >
                  <dt className="meta">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 text-text">
                    {row.href ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="arrow-nudge-up group inline-flex items-center gap-2 max-w-full hover:text-accent transition-colors"
                      >
                        <span className="truncate">{row.value}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-text-subtle group-hover:text-accent transition-colors" />
                      </a>
                    ) : (
                      <span>{row.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/** The email as an object: a mono address in a bordered row with Copy and Mail actions. */
const EmailRow = () => {
  const [copied, setCopied] = useState(false);
  const addressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
    } catch {
      // No clipboard access (insecure context, old browser): select the address instead.
      const node = addressRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div className="mt-8 border border-ink-line bg-ink-surface/50">
      <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between gap-4">
        <span className="label">Email</span>
        <span className="meta">Primary</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex-1 min-w-0 px-5 py-5 flex items-center">
          <span
            ref={addressRef}
            className="font-mono text-lg sm:text-xl lg:text-2xl tracking-tight text-text break-all"
          >
            {CONTACT.email}
          </span>
        </div>

        <div className="flex border-t sm:border-t-0 sm:border-l border-ink-line divide-x divide-ink-line">
          <button
            type="button"
            onClick={copy}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              copied ? 'text-accent' : 'text-text-muted hover:text-text hover:bg-ink-surface'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="w-[8ch] text-left">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <a
            href={`mailto:${CONTACT.email}`}
            className="arrow-nudge-up flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted hover:text-text hover:bg-ink-surface transition-colors"
          >
            Mail
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </div>
  );
};

export default Contact;
