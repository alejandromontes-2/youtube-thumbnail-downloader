import type { VideoInfo } from '../types';

interface Props {
  info: VideoInfo | null;
  videoId: string;
  infoError: string | null;
}

export function VideoInfoCard({ info, videoId, infoError }: Props) {
  const title = info?.title ?? 'Untitled video';
  const author = info?.author ?? null;
  const previewUrl = info?.thumbnailUrl;

  return (
    <article className="video-info">
      <div className="video-info__frame">
        {previewUrl ? (
          <img
            className="video-info__image"
            src={previewUrl}
            alt=""
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0.2';
            }}
          />
        ) : (
          <div className="video-info__placeholder" aria-hidden="true">
            <span>no preview</span>
          </div>
        )}
        <div className="video-info__frame-overlay" aria-hidden="true">
          <span className="video-info__badge">YT</span>
        </div>
      </div>

      <div className="video-info__body">
        <div className="video-info__eyebrow">
          <span className="video-info__eyebrow-dot" />
          video metadata
        </div>
        <h2 className="video-info__title">{title}</h2>
        <div className="video-info__meta">
          {author && <span className="video-info__author">{author}</span>}
          {author && <span className="video-info__divider" aria-hidden="true">/</span>}
          <code className="video-info__id">{videoId}</code>
        </div>
        {infoError && (
          <p className="video-info__warning" role="status">
            ⚠ {infoError}. Thumbnails below are still available.
          </p>
        )}
      </div>
    </article>
  );
}
