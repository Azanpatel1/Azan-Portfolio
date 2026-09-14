export interface GraphItem {
  /** Unique slug, used as the React key. */
  id: string;
  title: string;
  /** Short blurb shown under the title. */
  description?: string;
  /**
   * Desmos embed URL. Desmos frames a graph when `?embed` is appended to
   * its URL; if a gallery link ever refuses to frame, swap in the
   * `https://www.desmos.com/calculator/<hash>?embed` form for that graph.
   */
  embedUrl: string;
  /** Canonical public link, for the "Open in Desmos" action. */
  externalUrl: string;
}

const gallery = (uuid: string) => `https://www.desmos.com/gallery/${uuid}`;

export const GRAPHS: GraphItem[] = [
  {
    id: 'desmos-6b53bf3a',
    title: 'Desmos graph 01',
    embedUrl: `${gallery('6b53bf3a-55a5-4c4e-b28d-741a06053dfa')}?embed`,
    externalUrl: gallery('6b53bf3a-55a5-4c4e-b28d-741a06053dfa'),
  },
  {
    id: 'desmos-b2aa70ab',
    title: 'Desmos graph 02',
    embedUrl: `${gallery('b2aa70ab-cf81-4c1e-8b91-047095ab9d85')}?embed`,
    externalUrl: gallery('b2aa70ab-cf81-4c1e-8b91-047095ab9d85'),
  },
];
