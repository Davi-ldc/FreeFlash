import { serve } from '@hono/node-server';
import { createApp } from './app';

import { HONO_PORT } from './config/port';
import { VITE_PORT } from './config/port';

const app = createApp({
  isDev: true,
  viteJS: `http://localhost:${VITE_PORT}/src/main.ts`,
  viteCSS: '',
  vitePort: VITE_PORT
});

// Iniciar servidor de desenvolvimento
try {
  serve({
    fetch: app.fetch,
    port: HONO_PORT,
  });
  console.log(`🚀 Página principal rodando em \x1b[36mhttp://localhost:\x1b[1m${HONO_PORT}\x1b[0m`);
} catch (error) {
  console.error('❌ Erro ao iniciar o servidor:', error);
}
