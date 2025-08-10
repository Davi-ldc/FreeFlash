//Vercel entrypoint
import { handle } from 'hono/vercel';
import { createApp } from './app';

import manifestData from '../.vercel/output/static/.vite/manifest.json';
import type { Manifest } from 'vite';

const manifest: Manifest = manifestData as Manifest;

if (!manifest['src/main.ts'] || !manifest['src/main.ts'].css) {
  console.error('main.ts não ta no manifest.json ou você não importou o CSS👀');
  process.exit(1);
}

const app = createApp({
  isDev: false,
  viteJS: `/${manifest['src/main.ts'].file}`,
  viteCSS: `/${manifest['src/main.ts'].css[0]}`,
  manifest: manifest
});

export const GET = handle(app);
export const POST = handle(app);