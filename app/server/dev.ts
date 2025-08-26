import { serve } from '@hono/node-server';
import { createApp } from './app';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

import { HONO_PORT } from './config/port';
import { VITE_PORT } from './config/port';

const { CODESPACE_NAME } = process.env as Record<string, string | undefined>;
const viteBaseUrl = CODESPACE_NAME 
  ? `https://${CODESPACE_NAME}-${VITE_PORT}.app.github.dev`
  : `http://localhost:${VITE_PORT}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewsDir = path.join(__dirname, '../src');

const eta = new Eta({
  varName: 'it',
  views: viewsDir,
  cache: false
});

const app = createApp({
  isDev: true,
  viteJS: `${viteBaseUrl}/src/main.ts`,
  viteCSS: '',
  vitePort: VITE_PORT,
  viteBaseUrl
}, eta);

try {
  serve({
    fetch: app.fetch,
    port: HONO_PORT,
  });
  console.log(`🚀 Página principal rodando em \x1b[36mhttp://localhost:\x1b[1m${HONO_PORT}\x1b[0m`);
  console.log(`🔌 Vite dev em: ${viteBaseUrl}`);
} catch (error) {
  console.error('❌ Erro ao iniciar o servidor:', error);
}