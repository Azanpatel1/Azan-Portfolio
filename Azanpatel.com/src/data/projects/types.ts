export interface ProjectData {
  /** URL slug — must be unique, lowercase, use hyphens (e.g. `my-new-device`). */
  id: string;
  title: string;
  /** Short blurb for cards and detail hero. */
  description: string;
  /** Optional longer copy on the project detail page. */
  longDescription?: string;
  tags: string[];
  /** Path under `public/` (e.g. `/images/photo.jpg`). */
  image: string;
  /** Extra images on the project detail page (e.g. process shots, CAD). */
  gallery?: string[];
  year?: string;
  role?: string;
  /** Optional badge on cards; the home page shows the first three entries. */
  featured?: boolean;
}
