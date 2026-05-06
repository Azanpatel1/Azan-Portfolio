import React, { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';

const CONTACT_ROWS = [
  { label: 'Email', value: 'hello@azanpatel.com', href: 'mailto:hello@azanpatel.com' },
  { label: 'Location', value: 'San Francisco, CA' },
  { label: 'LinkedIn', value: 'linkedin.com/in/azanpatel', href: 'https://linkedin.com' },
  { label: 'GitHub', value: 'github.com/azanpatel', href: 'https://github.com' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader
          index="04"
          label="Contact"
          title="Have a project or opportunity? Let's talk."
        />

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="border border-ink-line">
              <div className="px-5 py-3 border-b border-ink-line">
                <span className="label">Channels</span>
              </div>
              <dl className="divide-y divide-ink-line">
                {CONTACT_ROWS.map((row) => (
                  <div key={row.label} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle col-span-1">
                      {row.label}
                    </dt>
                    <dd className="col-span-2">
                      {row.href ? (
                        <a
                          href={row.href}
                          target={row.href.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer noopener"
                          className="text-text hover:text-accent transition-colors"
                        >
                          {row.value}
                        </a>
                      ) : (
                        <span className="text-text">{row.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="border border-ink-line">
              <div className="px-5 py-3 border-b border-ink-line flex items-center justify-between">
                <span className="label">Send a message</span>
                <span className="font-mono text-[10px] text-text-subtle">FORM-01</span>
              </div>

              {isSubmitted ? (
                <div className="p-6 text-center">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
                    Transmission received
                  </p>
                  <p className="text-text-muted text-sm">
                    Thanks for reaching out—I'll respond shortly.
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-ink border border-ink-line text-text px-3 py-2 focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="job">Job Opportunity</option>
                      <option value="project">Project Collaboration</option>
                      <option value="information">Information Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-ink border border-ink-line text-text px-3 py-2 focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-accent w-full ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

const Field = ({ label, name, value, onChange, required, type = 'text' }: FieldProps) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-ink border border-ink-line text-text px-3 py-2 focus:outline-none focus:border-accent transition-colors"
    />
  </div>
);

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label
    htmlFor={htmlFor}
    className="block font-mono text-[11px] uppercase tracking-[0.2em] text-text-subtle mb-2"
  >
    {children}
  </label>
);

export default Contact;
