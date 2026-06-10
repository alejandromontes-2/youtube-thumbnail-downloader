/**
 * Trigger a browser download for an in-memory blob with the given filename.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // give the browser a moment to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Fetch a single image and return its blob + content length.
 * Throws on non-OK responses so callers can decide how to recover.
 */
export async function fetchImageAsBlob(url: string, signal?: AbortSignal): Promise<Blob> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.blob();
}
