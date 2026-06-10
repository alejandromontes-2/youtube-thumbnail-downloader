import { useState } from 'react';
import type { ThumbnailAsset } from '../types';
import { downloadAllAsZip } from '../lib/downloadZip';

interface Props {
  videoId: string;
  assets: ThumbnailAsset[];
}

interface ZipFeedback {
  type: 'success' | 'partial' | 'error';
  message: string;
}

export function ActionBar({ videoId, assets }: Props) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [feedback, setFeedback] = useState<ZipFeedback | null>(null);

  const handleDownloadAll = async () => {
    if (busy) return;
    setBusy(true);
    setProgress({ done: 0, total: assets.length });
    setFeedback(null);
    try {
      const result = await downloadAllAsZip(videoId, assets, (done, total) => {
        setProgress({ done, total });
      });
      if (result.skipped.length === 0) {
        setFeedback({
          type: 'success',
          message: `packaged ${result.included.length} files · ${formatBytes(result.totalBytes)}`,
        });
      } else {
        setFeedback({
          type: 'partial',
          message: `${result.included.length} packed · ${result.skipped.length} skipped (${result.skipped.map((s) => s.slug).join(', ')})`,
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not build the zip',
      });
    } finally {
      setBusy(false);
      setProgress(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="action-bar">
      <div className="action-bar__left">
        <div className="action-bar__label">
          <span className="action-bar__label-line">batch</span>
          <span className="action-bar__label-line">operation</span>
        </div>
        <div className="action-bar__copy">
          <strong>download all {assets.length}</strong>
          <span>single zip · preserves source filenames · ready to share</span>
        </div>
      </div>
      <div className="action-bar__right">
        <button
          type="button"
          className={`action-bar__btn ${busy ? 'is-busy' : ''}`}
          onClick={handleDownloadAll}
          disabled={busy || assets.length === 0}
        >
          {busy && progress ? (
            <>
              <span className="action-bar__progress" aria-hidden="true">
                <span
                  className="action-bar__progress-bar"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </span>
              <span className="action-bar__btn-text">
                zipping {progress.done}/{progress.total}
              </span>
            </>
          ) : (
            <>
              <span className="action-bar__btn-icon" aria-hidden="true">⊞</span>
              <span className="action-bar__btn-text">build zip</span>
              <span className="action-bar__btn-arrow" aria-hidden="true">→</span>
            </>
          )}
        </button>
        {feedback && (
          <p className={`action-bar__feedback action-bar__feedback--${feedback.type}`} role="status">
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
