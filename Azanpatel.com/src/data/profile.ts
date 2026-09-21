/** The person, for the home page. Every line here is copy that already existed on the site. */
export const PROFILE = {
  name: 'Azan Patel',
  tagline: 'Translational Neuroengineering',
  statement:
    'I’m obsessed with brain-machine interfaces, neuroplasticity, and enhancing human experience.',
  bio:
    'Solving real clinical problems focused on the brain, leveraging closed-loop neuromodulatory techniques, computational modeling, and hardware engineering to better understand and treat stroke, Alzheimer’s, and neuropsychiatric disorders.',
  portrait: { src: '/images/Azan.jpg', alt: 'Azan Patel' },
};

export interface Affiliation {
  org: string;
  /** Lab, team, or programme within the organisation. */
  unit?: string;
  role: string;
  period: string;
  upcoming?: boolean;
}

/** Education first, then the posts held — the order the page reads in. */
export const EDUCATION: Affiliation[] = [
  { org: 'UC Davis', unit: 'Biomedical Engineering', role: 'Undergraduate', period: '2027' },
];

export const AFFILIATIONS: Affiliation[] = [
  {
    org: 'Tesla',
    unit: 'Optimus Humanoid Robotics',
    role: 'Engineering Manufacturing Intern',
    period: '2026',
    upcoming: true,
  },
  {
    org: 'NEXTfuge',
    role: 'Co-founder',
    period: '2024—',
  },
  {
    org: 'UC Davis Health',
    unit: 'Biomedical Engineering',
    role: 'Operating room observations and user needs analysis',
    period: '2024',
  },
  {
    org: 'UC Davis',
    unit: 'Aerospace Robotics and Propulsion Lab',
    role: 'Member',
    period: '2024',
  },
];

/** From the Goal journal, section 14 — lines worth keeping verbatim. */
export const QUOTE = {
  text: 'The goal isn’t to be a physician. It’s to see the same problem the physician sees.',
  source: 'Neuroengineering deserves its own footing',
  href: '/goal',
};
