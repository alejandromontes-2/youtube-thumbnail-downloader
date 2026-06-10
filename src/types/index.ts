export interface VideoInfo {
  title: string;
  author: string;
  thumbnailUrl: string;
}

export interface ThumbnailResolution {
  slug: 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default';
  label: string;
  width: number;
  height: number;
  tier: 'hero' | 'standard' | 'compact';
}

export interface ThumbnailAsset {
  resolution: ThumbnailResolution;
  url: string;
  sizeBytes: number | null;
}

export interface VideoData {
  videoId: string;
  info: VideoInfo | null;
  infoError: string | null;
  assets: ThumbnailAsset[];
}
