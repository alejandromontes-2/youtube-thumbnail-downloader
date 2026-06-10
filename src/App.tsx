import { useCallback, useState } from 'react';
import { parseVideoId } from './lib/parseVideoId';
import { useVideoData } from './hooks/useVideoData';
import { UrlInput } from './components/UrlInput';
import { VideoInfoCard } from './components/VideoInfoCard';
import { ThumbnailGrid } from './components/ThumbnailGrid';
import { ActionBar } from './components/ActionBar';
import { EmptyState } from './components/EmptyState';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';

export function App() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const { data, loading, error, reload } = useVideoData(videoId);

  const handleSubmit = useCallback((input: string) => {
    const id = parseVideoId(input);
    setVideoId(id);
  }, []);

  const showResults = !!data && data.assets.length > 0;
  const showEmpty = !loading && !data;

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere__glow" />
        <div className="atmosphere__grain" />
        <div className="atmosphere__grid" />
      </div>

      <TopBar />

      <main className="main">
        <section className="hero">
          <h1 className="hero__title">
            <span className="hero__line hero__line--mono">DOWNLOAD</span>
            <span className="hero__line hero__line--serif">
              <em>any</em>&nbsp;youtube
            </span>
            <span className="hero__line hero__line--display">
              thumbnail<span className="hero__period">.</span>
            </span>
          </h1>
          <p className="hero__lede">
            Every resolution from <strong>1280 × 720</strong> down to{' '}
            <strong>120 × 90</strong>. <em>No login. No tracking.</em> Just paste
            a link and grab the still frame.
          </p>
        </section>

        <UrlInput onSubmit={handleSubmit} />

        {loading && <SkeletonState />}

        {error && !loading && (
          <div className="error-banner" role="alert">
            <span className="error-banner__label">ERR</span>
            <span>{error}</span>
            <button type="button" className="error-banner__retry" onClick={reload}>
              retry
            </button>
          </div>
        )}

        {showResults && data && (
          <section className="results">
            <VideoInfoCard info={data.info} videoId={data.videoId} infoError={data.infoError} />
            <ActionBar videoId={data.videoId} assets={data.assets} />
            <ThumbnailGrid assets={data.assets} videoId={data.videoId} />
          </section>
        )}

        {showEmpty && <EmptyState onPickExample={handleSubmit} />}
      </main>

      <Footer />
    </div>
  );
}

function SkeletonState() {
  return (
    <div className="skeleton" aria-hidden="true">
      <div className="skeleton__bar skeleton__bar--lg" />
      <div className="skeleton__bar skeleton__bar--md" />
      <div className="skeleton__bar skeleton__bar--sm" />
      <div className="skeleton__grid">
        <div className="skeleton__card skeleton__card--hero" />
        <div className="skeleton__card" />
        <div className="skeleton__card" />
        <div className="skeleton__card" />
        <div className="skeleton__card" />
      </div>
    </div>
  );
}
