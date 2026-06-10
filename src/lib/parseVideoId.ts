/**
 * Extract a YouTube video ID from any of the common URL formats or a raw ID.
 * Returns null if the input does not look like a valid ID.
 *
 * Supported formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - https://m.youtube.com/watch?v=VIDEO_ID&t=42s
 *   - VIDEO_ID (raw 11-char id)
 */
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function parseVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') {
    const candidate = segments[0];
    if (candidate && VIDEO_ID_PATTERN.test(candidate)) return candidate;
    return null;
  }

  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v');
    if (v && VIDEO_ID_PATTERN.test(v)) return v;

    if (segments[0] === 'shorts' || segments[0] === 'embed' || segments[0] === 'live') {
      const candidate = segments[1];
      if (candidate && VIDEO_ID_PATTERN.test(candidate)) return candidate;
    }
  }

  return null;
}
