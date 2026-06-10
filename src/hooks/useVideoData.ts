import { useEffect, useRef, useState } from 'react';
import type { ThumbnailAsset, VideoData, VideoInfo } from '../types';
import { RESOLUTIONS, buildThumbnailUrl, isThumbnailAvailable } from '../lib/thumbnails';
import { fetchVideoInfo } from '../lib/fetchVideoInfo';

interface State {
  data: VideoData | null;
  loading: boolean;
  error: string | null;
}

const INITIAL: State = { data: null, loading: false, error: null };

export function useVideoData(videoId: string | null): State & { reload: () => void } {
  const [state, setState] = useState<State>(INITIAL);
  const [reloadCount, setReloadCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!videoId) {
      setState(INITIAL);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ data: null, loading: true, error: null });

    const run = async () => {
      try {
        const urls = RESOLUTIONS.map((r) => ({
          resolution: r,
          url: buildThumbnailUrl(videoId, r.slug),
        }));

        const availability = await Promise.all(
          urls.map((u) => isThumbnailAvailable(u.url, controller.signal)),
        );

        if (controller.signal.aborted) return;

        const assets: ThumbnailAsset[] = urls
          .map((u) => ({ ...u, sizeBytes: null as number | null }))
          .filter((_, i) => availability[i]);

        if (assets.length === 0) {
          setState({
            data: {
              videoId,
              info: null,
              infoError: null,
              assets: [],
            },
            loading: false,
            error: 'No thumbnails available for this video.',
          });
          return;
        }

        const info = await fetchVideoInfo(videoId, controller.signal);
        if (controller.signal.aborted) return;

        setState({
          data: {
            videoId,
            info: enrichInfo(info, assets),
            infoError: info ? null : 'Could not load video metadata',
            assets,
          },
          loading: false,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    void run();

    return () => controller.abort();
  }, [videoId, reloadCount]);

  return {
    ...state,
    reload: () => setReloadCount((n) => n + 1),
  };
}

function enrichInfo(info: VideoInfo | null, assets: ThumbnailAsset[]): VideoInfo | null {
  if (!info) return null;
  if (info.thumbnailUrl) return info;
  const hero = assets.find((a) => a.resolution.slug === 'maxresdefault') ?? assets[0];
  return { ...info, thumbnailUrl: hero.url };
}
