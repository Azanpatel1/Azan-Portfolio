/**
 * TEMPLATE — copy this file to `your-project-slug.ts`, rename `project`, fill fields,
 * then import the default in `registry.ts` and add it to the PROJECTS array.
 *
 * 1. Put a cover image in `public/images/your-photo.jpg`
 * 2. `id` must match the filename style (hyphens) and be unique
 * 3. Route will be `/projects/<id>`
 */
import type { ProjectData } from '../types';

const project: ProjectData = {
  id: 'your-project-slug',
  title: 'Project title',
  description: 'One or two sentences for cards and the top of the detail page.',
  longDescription: 'Optional longer story, design process, results — shown on the detail page only.',
  tags: ['Tag One', 'Tag Two'],
  image: '/images/your-photo.jpg',
  // gallery: ['/images/extra-1.png', '/images/extra-2.png'],
  year: '2026',
  role: 'Your role',
  featured: false,
};

export default project;
