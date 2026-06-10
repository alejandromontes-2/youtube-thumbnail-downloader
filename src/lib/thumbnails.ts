import type { ThumbnailResolution } from '../types';

/**
 * Ordered from highest to lowest resolution.
 * `tier` controls layout weight in the gallery:
 *   - hero: large 2-col-wide card (only maxres)
 *   - standard: regular 1-col card
 *   - compact: smaller 1-col card
 */
export const RESOLUTIONS: readonly ThumbnailResolution[] = [
  { slug: 'maxresdefault', label: 'MaxRes',  width: 1280, height: 720,  tier: 'hero' },
  { slug: 'sddefault',     label: 'SD',      width: 640,  height: 480,  tier: 'standard' },
  { slug: 'hqdefault',     label: 'HQ',      width: 480,  height: 360,  tier: 'standard' },
  { slug: 'mqdefault',     label: 'MQ',      width: 320,  height: 180,  tier: 'compact' },
  { slug: 'default',       label: 'Default', width: 120,  height: 90,   tier: 'compact' },
] as const;

export function buildThumbnailUrl(videoId: string, slug: ThumbnailResolution['slug']): string {
  return `https://img.youtube.com/vi/${videoId}/${slug}.jpg`;
}

export function buildWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Returns true if a thumbnail URL is reachable. We use HEAD to avoid
 * downloading the full image just to check availability.
 */
export async function isThumbnailAvailable(url: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal });
    return response.ok;
  } catch {
    return false;
  }
}
