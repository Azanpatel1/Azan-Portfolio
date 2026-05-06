/**
 * All projects shown on the site. Order here = order on /projects and the home “featured” grid
 * (home still uses `ProjectsGrid` `limit` for the first N items only).
 *
 * Add a project:
 * 1. Add `public/images/<name>.jpg` (or png)
 * 2. Copy `entries/_template.ts` → `entries/<your-slug>.ts` and edit
 * 3. `import` it below and append to `PROJECTS`
 */
import type { ProjectData } from './types';
import bloodDrawArmBhours from './entries/blood-draw-arm-bhours';
import cycloidalGearbox20to1 from './entries/cycloidal-gearbox-20-1';
import microfluidicCentrifugeNextfuge from './entries/microfluidic-centrifuge-nextfuge';
import pillCutterMakeathon from './entries/pill-cutter-makeathon';
import tvcRocketArpl from './entries/tvc-rocket-arpl';

export const PROJECTS: ProjectData[] = [
  tvcRocketArpl,
  microfluidicCentrifugeNextfuge,
  cycloidalGearbox20to1,
  pillCutterMakeathon,
  bloodDrawArmBhours,
];

export const getProjectById = (id: string) => PROJECTS.find((p) => p.id === id);
