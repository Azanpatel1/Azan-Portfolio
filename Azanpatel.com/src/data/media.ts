export interface MediaItem {
  /** Unique slug, used as the React key. */
  id: string;
  title: string;
  /** Short blurb shown under the title. */
  description?: string;
  /** Podcast, publication, or outlet the appearance is on. */
  outlet?: string;
  year?: string;
  /** Spotify embed URL (https://open.spotify.com/embed/...). */
  embedUrl: string;
  /** Canonical public link, for the "Open on Spotify" action. */
  externalUrl: string;
  /** Embed iframe height in px. Spotify: 352 full, 152 compact. */
  height?: number;
}

export const MEDIA: MediaItem[] = [
  {
    id: 'spotify-3FhYoWTXXHkDHyR64orRzi',
    title: 'Podcast appearance',
    outlet: 'Spotify',
    embedUrl: 'https://open.spotify.com/embed/episode/3FhYoWTXXHkDHyR64orRzi?utm_source=generator',
    externalUrl: 'https://open.spotify.com/episode/3FhYoWTXXHkDHyR64orRzi',
    height: 352,
  },
];
