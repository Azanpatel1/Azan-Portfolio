export type ResearchType = 'proposal' | 'report' | 'presentation';

export interface ResearchItem {
  /** Unique slug, used as the React key. */
  id: string;
  title: string;
  /** Short blurb for the widget card. */
  description: string;
  type: ResearchType;
  tags: string[];
  year?: string;
  /** Course, competition, or program the work was produced for. */
  venue?: string;
  /**
   * Preview image. Either a static path under `public/` or a remote
   * Google Drive thumbnail URL for documents too large to snapshot.
   */
  image: string;
  /** Link to the document on Google Drive. */
  driveUrl: string;
}

const driveThumb = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

export const PROPOSALS: ResearchItem[] = [
  {
    id: 'neural-stim-proposal',
    title: 'Closed-Loop Neural Stimulation for Speech Rehabilitation',
    description:
      'Initial design and research proposal for a task-based, closed-loop EEG neurostimulation system to rehabilitate cognitive-linguistic function in post-stroke and post-coma patients.',
    type: 'proposal',
    tags: ['Neurotech', 'EEG', 'Stroke Rehab'],
    year: '2026',
    venue: 'DecodeNeuro',
    image: '/images/research/neural-stim-proposal.jpg',
    driveUrl: 'https://docs.google.com/document/d/1PNquBJKKH0XMH5vuiaEArNFBLvG4rhnRvMHCEKltMQI/edit?usp=sharing',
  },
  {
    id: 'debut-proposal',
    title: 'NEXTfuge — NIH DEBUT Challenge Proposal',
    description:
      'Full proposal package for NEXTfuge, a centrifugal microfluidic point-of-care platform for rapid, multi-analyte blood diagnostics, submitted to the NIH DEBUT Challenge.',
    type: 'proposal',
    tags: ['Microfluidics', 'Diagnostics', 'Point-of-Care'],
    year: '2026',
    venue: 'NIH DEBUT Challenge',
    image: '/images/research/debut-proposal.jpg',
    driveUrl: 'https://drive.google.com/file/d/1apqaEfgmVo6095QfTyU8STLWoIEl58Va/view',
  },
  {
    id: 'sleep-memory-proposal',
    title: "Sleep's Influence on Contextual & Ordered Memory",
    description:
      'Research proposal to the Arnold and Mabel Beckman Foundation on how hippocampal-prefrontal dynamics and sharp wave ripples during sleep reorganize contextual and ordered memory.',
    type: 'proposal',
    tags: ['Neuroscience', 'Memory', 'Sleep'],
    year: '2025',
    venue: 'Beckman Foundation',
    image: '/images/research/sleep-memory-proposal.jpg',
    driveUrl: 'https://docs.google.com/document/d/1AgUz6K0A0AMhymOypH8LIXb4q_EGYd9iYNP8h_X4R2g/edit?usp=sharing',
  },
  {
    id: 'phage-igem',
    title: 'Phage Therapy to Combat Antibiotic Resistance',
    description:
      'iGEM research proposal for a systematic investigation of bacteriophage therapy against multidrug-resistant bacterial infections through in-vitro experiments and animal models.',
    type: 'proposal',
    tags: ['Synthetic Biology', 'Phage Therapy', 'iGEM'],
    year: '2025',
    venue: 'iGEM',
    image: '/images/research/phage-igem.jpg',
    driveUrl: 'https://docs.google.com/document/d/1G6iwnCvt2RenSiHQmS9kFURbIm_hhX-oEeZt3Lu0JfQ/edit?usp=sharing',
  },
  {
    id: 'nextfuge-proposal',
    title: 'NEXTfuge Diagnostics — MITTIC Proposal',
    description:
      'Fall 2024 NASA MITTIC proposal for NEXTfuge, laying out the science background, technology, and commercialization case for a portable centrifugal diagnostics platform.',
    type: 'proposal',
    tags: ['Microfluidics', 'NASA MITTIC', 'MedTech'],
    year: '2024',
    venue: 'NASA MITTIC',
    image: '/images/research/nextfuge-proposal.jpg',
    driveUrl: 'https://docs.google.com/document/d/1YnVNJjDX_gpsP69FAiVvcxZaJUkrCvQmVjSVF8zpO2I/edit?usp=sharing',
  },
  {
    id: 'pbl2-report',
    title: 'TENSile — Stretching Device for DMD Patients',
    description:
      'Written report on TENSile, a stretching device pairing Achilles-tendon therapy with TENS pain management to improve mobility outcomes in adolescent Duchenne muscular dystrophy patients.',
    type: 'report',
    tags: ['Medical Devices', 'DMD', 'BIM 116'],
    year: '2025',
    venue: 'UC Davis BIM 116',
    image: '/images/research/pbl2-report.jpg',
    driveUrl: 'https://docs.google.com/document/d/1JLUR_7h0sWrgXgHtJ0qFHqQoKWpz5ixiMEQtfUoMhQc/edit?usp=sharing',
  },
  {
    id: 'pbl1-report',
    title: 'rTMS & Neurofeedback for Alzheimer’s',
    description:
      'Written report on a BCI design combining repetitive transcranial magnetic stimulation with neurofeedback to slow cognitive decline in Alzheimer’s patients.',
    type: 'report',
    tags: ['Neurostimulation', 'BCI', 'BIM 116'],
    year: '2025',
    venue: 'UC Davis BIM 116',
    image: '/images/research/pbl1-report.jpg',
    driveUrl: 'https://docs.google.com/document/d/1PwnQDwaji4xny-nq0XCp9K9-8wNh2ylcFEnrcu5FYhQ/edit?usp=sharing',
  },
];

export const PRESENTATIONS: ResearchItem[] = [
  {
    id: 'makeathon-2026',
    title: 'The Plinko — Make-A-Thon 2026',
    description:
      'Final pitch for The Plinko, a low-cost 3D-printed attachment that gravity-feeds blood-draw tubes to stabilize the needle during phlebotomy — refined through ~15 CAD iterations and PFMECA/DFMECA analysis to a sub-$4 production cost.',
    type: 'presentation',
    tags: ['Medical Devices', '3D Printing', 'DFMECA'],
    year: '2026',
    venue: 'UC Davis Make-A-Thon',
    image: driveThumb('1gxE-rCs6xCyIbxU8VHK9zAmqNzLqYjdfHBI5Y0mjhzI'),
    driveUrl: 'https://docs.google.com/presentation/d/1gxE-rCs6xCyIbxU8VHK9zAmqNzLqYjdfHBI5Y0mjhzI/edit?usp=sharing',
  },
  {
    id: 'intuitive',
    title: 'Portable Diagnostic Centrifuge — Intuitive',
    description:
      'Deep-dive presentation for Intuitive Surgical on a portable electro-mechanical centrifuge for blood diagnostics: mechanical design, BLDC motor electronics with CAN and a spectral sensor, and closed-loop PID speed control.',
    type: 'presentation',
    tags: ['Mechatronics', 'Motor Control', 'Medical Devices'],
    year: '2026',
    image: driveThumb('1jBj-Ah0S9Y1qN6te5X16Ia8H1qok2Fggg3l7axrFa_4'),
    driveUrl: 'https://docs.google.com/presentation/d/1jBj-Ah0S9Y1qN6te5X16Ia8H1qok2Fggg3l7axrFa_4/edit?usp=sharing',
  },
  {
    id: 'pbl2-presentation',
    title: 'TENSile — Design Presentation',
    description:
      'Team presentation of TENSile, a novel Achilles-tendon stretching device with integrated TENS pain management for adolescent DMD patients.',
    type: 'presentation',
    tags: ['Medical Devices', 'DMD', 'BIM 116'],
    year: '2025',
    venue: 'UC Davis BIM 116',
    image: '/images/research/pbl2-presentation.jpg',
    driveUrl: 'https://docs.google.com/presentation/d/155lUtpKhr4IQk9uJwCUnyGD78Y7mySJY36RN-t06lLI/edit?usp=sharing',
  },
  {
    id: 'neuromodulation',
    title: 'NeuroModulation via rTMS & NeuroFeedback',
    description:
      'BCI design presentation on treating memory disorders with rTMS and neurofeedback — data collection, stimulation specifics, limitations, and alternative approaches.',
    type: 'presentation',
    tags: ['Neurostimulation', 'BCI', 'BIM 116'],
    year: '2025',
    venue: 'UC Davis BIM 116',
    image: '/images/research/neuromodulation.jpg',
    driveUrl: 'https://docs.google.com/presentation/d/19EG-6oVRerVCC2fFxK4JIWMMiPjpzYYWCLoINJC-MlA/edit?usp=sharing',
  },
  {
    id: 'bim180-arterial',
    title: 'Arterial Decalcification for Blood Flow Management',
    description:
      'Solo presentation proposing an approach to arterial calcification — background, current technologies, solution concept, feasibility, impact, and regulatory pathway.',
    type: 'presentation',
    tags: ['Cardiovascular', 'MedTech', 'BIM 180'],
    year: '2025',
    venue: 'UC Davis BIM 180',
    image: '/images/research/bim180-arterial.jpg',
    driveUrl: 'https://docs.google.com/presentation/d/1qCLxtMmG72ulnccn60KDFBXM9K4kG8XWtnKypYYSnks/edit?usp=sharing',
  },
  {
    id: 'sleep-memory-presentation',
    title: "Sleep's Influence on Contextual & Ordered Memory",
    description:
      'Research presentation on the MemSleep project: a Psychtoolbox-based memory task piloted on UC Davis students, with behavioral analysis ahead of iEEG recordings in epilepsy patients.',
    type: 'presentation',
    tags: ['Neuroscience', 'Memory', 'MATLAB'],
    year: '2025',
    image: driveThumb('1NRXfntu83DA7biksyr4leTq5iAF0L8HRHKdWIxujm1c'),
    driveUrl: 'https://docs.google.com/presentation/d/1NRXfntu83DA7biksyr4leTq5iAF0L8HRHKdWIxujm1c/edit?usp=sharing',
  },
  {
    id: 'journal-club',
    title: 'How Does Our Brain Choose What To Remember',
    description:
      'Journal club talk on Yang et al. (2024, Science) — hippocampal sharp wave ripples selecting experiences for memory consolidation — and its implications for the MemSleep project.',
    type: 'presentation',
    tags: ['Neuroscience', 'Journal Club'],
    year: '2025',
    image: driveThumb('1Eq7acMk0iH6dQGmIOmz4mqj4whlXc9ETW7dsS6IrrW4'),
    driveUrl: 'https://docs.google.com/presentation/d/1Eq7acMk0iH6dQGmIOmz4mqj4whlXc9ETW7dsS6IrrW4/edit?usp=sharing',
  },
  {
    id: 'makeathon-2025',
    title: 'ExactaPill — Make-A-Thon 2025',
    description:
      'Team pitch for ExactaPill, a precision pill-splitting device with a self-aligning funnel, hinged blade, and lever arm that cuts accurately with minimal force.',
    type: 'presentation',
    tags: ['Product Design', 'Prototyping'],
    year: '2025',
    venue: 'UC Davis Make-A-Thon',
    image: '/images/research/makeathon-2025.jpg',
    driveUrl: 'https://docs.google.com/presentation/d/17GAiDhEyhxBHl_zTErAaG-d2iUtFPUqTSMhw66o_4BE/edit?usp=sharing',
  },
  {
    id: 'pca',
    title: 'Principal Component Analysis',
    description:
      'Explainer talk on PCA (Lever et al., Nature Methods 2017): reducing high-dimensional biological data onto axes of variance, and where its linear assumptions break down.',
    type: 'presentation',
    tags: ['Data Analysis', 'Statistics'],
    year: '2025',
    image: '/images/research/pca.jpg',
    driveUrl: 'https://docs.google.com/presentation/d/1-51OY7R8J5g0yO8BGB5-iYGFY22dlmBDJOQmgKbtEpY/edit?usp=sharing',
  },
];

export const RESEARCH: ResearchItem[] = [...PROPOSALS, ...PRESENTATIONS];
