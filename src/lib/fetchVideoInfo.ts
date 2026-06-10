import type { VideoInfo } from '../types';

const OEMBED_PROXIES = [
  (watchUrl: string) => `https://noembed.com/embed?url=${encodeURIComponent(watchUrl)}`,
  (watchUrl: string) => `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
] as const;

interface NoembedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
  error?: string;
}

/**
 * Fetch video metadata via public oembed proxies.
 * Tries noembed first (CORS friendly), then falls back to the canonical
 * YouTube oembed endpoint. Returns null on total failure — callers should
 * still allow downloading thumbnails even when info fails.
 */
export async function fetchVideoInfo(videoId: string, signal?: AbortSignal): Promise<VideoInfo | null> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  for (const buildUrl of OEMBED_PROXIES) {
    const url = buildUrl(watchUrl);
    try {
      const response = await fetch(url, { signal });
      if (!response.ok) continue;
      const data = (await response.json()) as NoembedResponse;
      if (data.error) continue;
      if (!data.title) continue;
      return {
        title: data.title,
        author: data.author_name ?? 'Unknown channel',
        thumbnailUrl: data.thumbnail_url ?? '',
      };
    } catch {
      // try next proxy
    }
  }

  return null;
}
