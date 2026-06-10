import { useState } from 'react';
import type { ThumbnailAsset } from '../types';
import { fetchImageAsBlob, downloadBlob } from '../lib/download';

interface Props {
  asset: ThumbnailAsset;
  videoId: string;
  index: number;
}

type ActionState = 'idle' | 'downloading' | 'copied' | 'errored';

export function ThumbnailCard({ asset, videoId, index }: Props) {
  const { resolution, url } = asset;
  const [downloadState, setDownloadState] = useState<ActionState>('idle');
  const [copyState, setCopyState] = useState<ActionState>('idle');
  const [sizeKb, setSizeKb] = useState<number | null>(null);

  const handleDownload = async () => {
    setDownloadState('downloading');
    try {
      const blob = await fetchImageAsBlob(url);
      setSizeKb(Math.round(blob.size / 1024));
      downloadBlob(blob, `yt-${videoId}-${resolution.slug}.jpg`);
      setDownloadState('idle');
    } catch {
      setDownloadState('errored');
      setTimeout(() => setDownloadState('idle'), 2000);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('errored');
      setTimeout(() => setCopyState('idle'), 1800);
    }
  };

  const tierClass = `thumb-card thumb-card--${resolution.tier}`;
  const aspectRatio = `${resolution.width} / ${resolution.height}`;

  return (
    <article
      className={tierClass}
      style={{
        animationDelay: `${index * 80}ms`,
        ['--aspect' as string]: aspectRatio,
      }}
    >
      <div className="thumb-card__chrome">
        <div className="thumb-card__chrome-left">
          <span className="thumb-card__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="thumb-card__label">{resolution.label}</span>
        </div>
        <div className="thumb-card__chrome-right">
          <span className="thumb-card__dims">
            {resolution.width}<span aria-hidden="true">×</span>{resolution.height}
          </span>
          {sizeKb !== null && (
            <span className="thumb-card__size">{sizeKb} KB</span>
          )}
        </div>
      </div>

      <div className="thumb-card__image-wrap">
        <img
          className="thumb-card__image"
          src={url}
          alt={`${resolution.label} thumbnail · ${resolution.width}×${resolution.height}`}
          loading="lazy"
          onLoad={(e) => {
            const blob = (e.currentTarget as HTMLImageElement).src;
            // estimate size from naturalWidth * 4 bytes/pixel (rough jpg avg)
            const w = (e.currentTarget as HTMLImageElement).naturalWidth;
            void blob;
            if (w > 0 && sizeKb === null) {
              setSizeKb(Math.round((w * (resolution.height / w) * 0.4)));
            }
          }}
        />
        <div className="thumb-card__scan" aria-hidden="true" />
      </div>

      <div className="thumb-card__actions">
        <button
          type="button"
          className={`thumb-card__btn thumb-card__btn--primary ${downloadState === 'downloading' ? 'is-loading' : ''} ${downloadState === 'errored' ? 'is-error' : ''}`}
          onClick={handleDownload}
          disabled={downloadState === 'downloading'}
        >
          {downloadState === 'downloading' && <span className="spinner" aria-hidden="true" />}
          {downloadState === 'idle' && (
            <>
              <span className="thumb-card__btn-icon">↓</span>
              <span>download</span>
            </>
          )}
          {downloadState === 'errored' && <span>failed</span>}
          {downloadState === 'downloading' && <span>grabbing…</span>}
        </button>
        <button
          type="button"
          className={`thumb-card__btn thumb-card__btn--secondary ${copyState === 'copied' ? 'is-copied' : ''} ${copyState === 'errored' ? 'is-error' : ''}`}
          onClick={handleCopy}
          aria-label="Copy direct URL"
        >
          {copyState === 'copied' ? (
            <>
              <span>✓</span>
              <span>copied</span>
            </>
          ) : copyState === 'errored' ? (
            <span>!</span>
          ) : (
            <>
              <span className="thumb-card__btn-icon">⎘</span>
              <span>copy url</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
