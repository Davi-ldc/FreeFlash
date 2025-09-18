// Vercel entrypoint
import { handle } from 'hono/vercel'
import type { Manifest } from 'vite'

import manifestData from '../.vercel/output/static/.vite/manifest.json'
// importa as views pré-compiladas (geradas por precompile-views.ts)
import Layout from '../src/views/layout'
import { createApp } from './app'

const manifest: Manifest = manifestData as Manifest

if (!manifest['src/main.ts'] || !manifest['src/main.ts'].css) {
  console.error('main.ts não ta no manifest.json ou você não importou o CSS👀')
  process.exit(1)
}

const app = createApp(
  {
    isDev: false,
    manifest,
    viteCSS: `/${manifest['src/main.ts'].css[0]}`,
    viteJS: `/${manifest['src/main.ts'].file}`,
  },
  { Layout },
)

export const GET = handle(app)
export const POST = handle(app)
