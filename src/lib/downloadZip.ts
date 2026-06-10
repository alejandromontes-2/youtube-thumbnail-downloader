import JSZip from 'jszip';
import { fetchImageAsBlob } from './download';
import { downloadBlob } from './download';
import type { ThumbnailAsset } from '../types';

export interface ZipResult {
  filename: string;
  totalBytes: number;
  included: { slug: string; bytes: number }[];
  skipped: { slug: string; reason: string }[];
}

/**
 * Bundle every available thumbnail into a single zip and trigger its download.
 * Skips assets that fail to fetch but reports them so the UI can show what
 * did not make it.
 */
export async function downloadAllAsZip(
  videoId: string,
  assets: ThumbnailAsset[],
  onProgress?: (done: number, total: number) => void,
): Promise<ZipResult> {
  const zip = new JSZip();
  const folder = zip.folder(videoId) ?? zip;
  const included: ZipResult['included'] = [];
  const skipped: ZipResult['skipped'] = [];
  let totalBytes = 0;

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    try {
      const blob = await fetchImageAsBlob(asset.url);
      folder.file(`${asset.resolution.slug}.jpg`, blob);
      totalBytes += blob.size;
      included.push({ slug: asset.resolution.slug, bytes: blob.size });
    } catch (error) {
      skipped.push({
        slug: asset.resolution.slug,
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    onProgress?.(i + 1, assets.length);
  }

  if (included.length === 0) {
    throw new Error('No thumbnails could be downloaded');
  }

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  const filename = `yt-thumb-${videoId}.zip`;
  downloadBlob(zipBlob, filename);

  return { filename, totalBytes, included, skipped };
}
