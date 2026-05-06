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
  year?: string;
  role?: string;
  /** Shown first on home when using `limit`; optional badge on cards. */
  featured?: boolean;
}
