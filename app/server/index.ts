import type { Manifest } from 'vite'

import manifestData from '../out/static/.vite/manifest.json'
import { createApp } from './app'

// Type assertion para o manifest
const manifest = manifestData as Manifest

if (!manifest['src/main.ts'].css || !manifest['src/main.ts'].file) {
  throw new Error('Manifest inválido ou incompleto')
}

const app = createApp({
  isDev: false,
  manifest,
  viteCSS: `/${manifest['src/main.ts'].css[0]}`,
  viteJS: `/${manifest['src/main.ts'].file}`,
}).compile()

export default app
