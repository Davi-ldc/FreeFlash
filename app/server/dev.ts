import { serve } from '@hono/node-server';
import { createApp } from './app';

import { HONO_PORT } from './config/port';
import { VITE_PORT } from './config/port';

const { CODESPACE_NAME, CODESPACES_PORT } = process.env as Record<string, string | undefined>;
const viteBaseUrl =
  CODESPACE_NAME && CODESPACES_PORT
    ? `https://${CODESPACE_NAME}-${VITE_PORT}.${CODESPACES_PORT}`
    : `http://localhost:${VITE_PORT}`;

const app = createApp({
  isDev: true,
  viteJS: `${viteBaseUrl}/src/main.ts`,
  viteCSS: '',
  vitePort: VITE_PORT,
  viteBaseUrl
});

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