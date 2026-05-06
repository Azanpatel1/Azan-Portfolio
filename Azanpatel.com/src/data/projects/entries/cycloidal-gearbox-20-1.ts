import type { ProjectData } from '../types';

const project: ProjectData = {
  id: 'cycloidal-gearbox-20-1',
  title: 'Cycloidal Gearbox',
  description:
    'Designed and manufactured a compact cycloidal speed reducer with a 20:1 torque ratio—parametric CAD, printed housings and disks, and a NEMA stepper input.',
  longDescription:
    'I developed the cycloidal disk profile from first principles using parametric equations, validated the geometry in Desmos, and recreated the curve in SolidWorks with an equation-driven sketch for a 25-roller ring (20:1 reduction stage). Parts were FDM-printed and fitted with precision pins and bearings; the assembly includes the motor mount, eccentric drive, dual cycloidal disks, output carrier, and bolted housing. The project spans math-heavy CAD through physical integration and test-ready hardware.',
  tags: [
    'Mechanical Design',
    'CAD / SolidWorks',
    'Gear Systems',
    '3D Printing',
    'Manufacturing',
  ],
  image: '/images/cycloidal-gearbox-cross-section.png',
  gallery: [
    '/images/cycloidal-gearbox-exploded.png',
    '/images/cycloidal-gearbox-assembly.png',
    '/images/cycloidal-gearbox-equations.png',
    '/images/cycloidal-gearbox-desmos.png',
    '/images/cycloidal-gearbox-solidworks.png',
    '/images/cycloidal-gearbox-printing.png',
    '/images/cycloidal-gearbox-prototype.png',
  ],
  year: '2026',
  role: 'Designer & manufacturer',
  featured: true,
};

export default project;
