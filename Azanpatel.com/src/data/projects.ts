export interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  image: string;
  year?: string;
  role?: string;
  featured?: boolean;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'tvc-rocket-arpl',
    title: 'TVC-Rocket',
    description:
      'Designed and built a thrust vector control rocket system with advanced guidance and control systems for precision flight operations.',
    longDescription:
      'Designed and fabricated a thrust-vector-controlled model rocket as part of the Aerospace Robotics and Propulsion Lab. Work spanned mechanical mount design for the gimbaled motor, integration of avionics for closed-loop attitude control, and ground testing of the control system before flight.',
    tags: ['Aerospace', 'Control Systems', 'Mechanical'],
    image: '/images/tvc-rocket.jpg',
    year: '2024',
    role: 'ARPL Member',
    featured: true,
  },
  {
    id: 'microfluidic-centrifuge-nextfuge',
    title: 'Microfluidic Centrifuge',
    description:
      'Developed an immunoassay point-of-care blood diagnostics device using microfluidic technology for rapid and accurate medical testing.',
    longDescription:
      'Co-developed a microfluidic centrifuge for point-of-care immunoassay diagnostics at Nextfuge. Responsibilities included mechanical design of the rotor and housing, prototyping with rapid manufacturing techniques, and validation testing against benchtop centrifuge baselines.',
    tags: ['Biomedical', 'Microfluidics', 'Medical Devices'],
    image: '/images/nextfuge.jpg',
    year: '2024',
    role: 'Co-founder',
    featured: true,
  },
  {
    id: 'pill-cutter-makeathon',
    title: 'Pill Cutter',
    description:
      'Engineered an ergonomic and precise pill cutting device with safety features and spring-loaded mechanism for accurate medication dosing.',
    longDescription:
      'Designed for the UC Davis Make-A-Thon, this device combines an ergonomic grip with a spring-loaded blade and finger guards to cut pills cleanly and safely. Iterated through CAD, FDM prototypes, and user testing.',
    tags: ['Product Design', 'Mechanical', 'Healthcare'],
    image: '/images/pill-cutter.jpg',
    year: '2023',
    role: 'Lead Designer',
  },
  {
    id: 'blood-draw-arm-bhours',
    title: 'Blood Draw Arm',
    description:
      'Created a stable and adjustable blood collection device with cross-shaped base for improved patient comfort and phlebotomist efficiency.',
    longDescription:
      'A blood-draw stabilization fixture developed during B-Hours. The cross-shaped base improves stability across patient anatomies while keeping the arm at an angle that is comfortable for the patient and ergonomic for the phlebotomist.',
    tags: ['Biomedical', 'Medical Devices', 'Ergonomics'],
    image: '/images/blood-draw-arm.jpg',
    year: '2023',
    role: 'Designer',
  },
];

export const getProjectById = (id: string) => PROJECTS.find((p) => p.id === id);
