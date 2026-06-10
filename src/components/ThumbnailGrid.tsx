import type { ThumbnailAsset } from '../types';
import { ThumbnailCard } from './ThumbnailCard';

interface Props {
  assets: ThumbnailAsset[];
  videoId: string;
}

export function ThumbnailGrid({ assets, videoId }: Props) {
  return (
    <section className="thumb-grid">
      <header className="thumb-grid__header">
        <h3 className="thumb-grid__title">
          <span>resolutions</span>
          <span className="thumb-grid__count">{assets.length} available</span>
        </h3>
        <p className="thumb-grid__hint">
          Click any card to download · img.youtube.com direct · 5 standard sizes
        </p>
      </header>
      <div className="thumb-grid__layout">
        {assets.map((asset, i) => (
          <ThumbnailCard
            key={asset.resolution.slug}
            asset={asset}
            videoId={videoId}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
