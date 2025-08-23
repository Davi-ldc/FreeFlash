//Vercel entrypoint
import type { Manifest } from 'vite';
import { handle } from 'hono/vercel';
import { createApp } from './app';

import { Eta } from 'eta';
import { compiledTemplates } from './precompiled-templates.js';

import manifestData from '../.vercel/output/static/.vite/manifest.json';

const manifest: Manifest = manifestData as Manifest;

if (!manifest['src/main.ts'] || !manifest['src/main.ts'].css) {
  console.error('main.ts não ta no manifest.json ou você não importou o CSS👀');
  process.exit(1);
}

//Usa os templates compilados
const eta = new Eta({ varName: 'it' });
for (const name in compiledTemplates) {
  eta.loadTemplate(name, compiledTemplates[name]);
}

const app = createApp({
  isDev: false,
  viteJS: `/${manifest['src/main.ts'].file}`,
  viteCSS: `/${manifest['src/main.ts'].css[0]}`,
  manifest: manifest
}, eta);

export const GET = handle(app);
export const POST = handle(app);