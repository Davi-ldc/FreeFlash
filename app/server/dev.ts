import { createApp } from './app';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

import { DEV_PORT, VITE_PORT } from './config/port';

const { CODESPACE_NAME } = process.env as Record<string, string | undefined>;
const viteBaseUrl = CODESPACE_NAME 
  ? `https://${CODESPACE_NAME}-${VITE_PORT}.app.github.dev`
  : `http://localhost:${VITE_PORT}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function DevApis(root: any) {
  const apiDir = path.join(__dirname, '../api');
  if (!fs.existsSync(apiDir)) {
    console.warn('[API] diretório /api não encontrado');
    return;
  }
  const files = fs.readdirSync(apiDir);

  for (const file of files) {
    if (!/\.(ts|js|mjs|cjs)$/.test(file)) continue;
    const fullPath = path.join(apiDir, file);
    try {
      const mod = await import(pathToFileURL(fullPath).href);
      const sub = mod.default;
      if (sub) {
        root.use(sub);
        console.log('[API] montada:', file);
      } else {
        console.warn('[API] ignorada (sem export default):', file);
      }
    } catch (e) {
      console.error('[API] erro ao importar', file, e);
    }
  }
}

(async () => {
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

  await DevApis(app);

  try {
    app.listen(DEV_PORT);
    console.log(`🚀 Página principal rodando em \x1b[36mhttp://localhost:\x1b[1m${DEV_PORT}\x1b[0m`);
    console.log(`🔌 Vite dev em: ${viteBaseUrl}`);
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
  }
})();