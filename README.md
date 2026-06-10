# YT//THUMB — Download any YouTube thumbnail

A small, fast, single-page web app for grabbing every available YouTube video thumbnail in one click. No login, no tracking, no backend.

## What it does

- Accepts any YouTube URL (`watch?v=`, `youtu.be/`, `shorts/`) or raw 11-char video ID
- Fetches the video title, author and ID via the public oembed endpoint
- Pulls every available thumbnail resolution: `maxresdefault` (1280×720) down to `default` (120×90), automatically hiding resolutions that 404
- Lets you download each one individually, copy its direct URL, or grab them all as a single `.zip`

## Stack

- **React 18** + **Vite** + **TypeScript** (strict)
- **jszip** for client-side zip generation
- **Fraunces** (display serif) + **Geist** (UI) + **JetBrains Mono** (technical labels) — all self-hosted
- No backend, no API keys, no third-party cookies

## Get started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build to ./dist
npm run preview      # serve the production build
npm run typecheck    # strict tsc
npm run lint         # eslint
```

## Project layout

```
src/
├── components/      # presentational components (UrlInput, ThumbnailGrid, etc.)
├── lib/             # pure logic (parseVideoId, fetchVideoInfo, downloadZip, ...)
├── hooks/           # React hooks (useVideoData)
├── types/           # shared TypeScript types
├── App.tsx          # page composition
├── main.tsx         # entry point
└── styles.css       # design tokens + global styles
```

## Try it

Paste any of these in the input to see it work:

- `dQw4w9WgXcQ` — chart-topper with all 5 resolutions
- `jNQXAC9IVRw` — one of YouTube's first videos (no `maxresdefault` exists; the app hides that card automatically)
- `9bZkp7q19f0` — global phenomenon

## Notes on data sources

- **Thumbnails:** served directly from `img.youtube.com` with the standard public URL pattern
- **Video metadata:** proxied through `noembed.com` (a long-running CORS-friendly oembed proxy). The app still works for downloading even if the proxy is down
- **No analytics, no cookies, no third-party fonts loaded over the network** — every font is bundled

## Disclaimer

Thumbnails are © their respective owners. Respect YouTube's [Terms of Service](https://www.youtube.com/static?template=terms) when using downloaded assets.
