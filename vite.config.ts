import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages is served at https://<user>.github.io/<repo>/, so the
// production bundle needs a base path. Local dev uses `/` so the URL
// stays http://localhost:5173/ without any prefix.
const REPO_NAME = 'youtube-thumbnail-downloader';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
}));
