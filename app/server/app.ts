import { Hono } from 'hono';

// Para diminuir o cold start
import contentData from '../content.json';

//@ts-ignore não vou criar um arquivo de tipos só pra importar esse js
import templates from './precompiled-templates.js';
const partials = { header: templates.header, footer: templates.footer};

// Types
// import type { types } from '../src/types/sanity';
import type { Base, Home } from '../src/types/pages';
import type { Manifest } from 'vite';

export interface AppConfig {
  isDev: boolean;
  viteJS: string;
  viteCSS: string;
  manifest?: Manifest;
  vitePort?: number;
  viteBaseUrl?: string; // URL completa do Vite em dev (ex: https://<codespace>-3000.app.github.dev)
}

function assetHelper(originalPath: string, isDev: boolean, manifest?: Manifest, viteBaseUrl?: string): string {
  // Em DEV, retorna o caminho pro servidor Vite (URL completa)
  if (isDev) {
    if (!viteBaseUrl) {
      console.warn('faltou o viteBaseUrl no assetHelper');
      return `/${originalPath}`;
    }
    const base = viteBaseUrl.replace(/\/+$/, '');
    const path = String(originalPath).replace(/^\/+/, '');
    return `${base}/${path}`;
  }
  
  // Fallback de segurança
  if (!manifest) {
    return `/${originalPath}`;
  }

  const manifestKey = originalPath; // O manifest do Vite usa o caminho a partir da raiz como chave.
  if (manifest[manifestKey]) {
    return `/${manifest[manifestKey].file}`;
  }
  
  console.warn(`Asset não encontrado no manifest.json: ${originalPath}`);
  return `/${originalPath}`;
}

export function createApp(config: AppConfig) {
  const baseTemplateData: Base = {
    site_title: 'Renato Vaz',
    charset: 'UTF-8',
    lang: 'pt-br',
    is_dev: config.isDev,
    vite_js: config.viteJS,
    vite_css: config.viteCSS
  };

  const helpers = {
    asset: (path: string) => assetHelper(path, config.isDev, config.manifest, config.viteBaseUrl)
  };

  const handlebarsConfig = { partials: partials, helpers: helpers };

  const app = new Hono();

  app.get('/', async (c) => {
    const data: Home = {
      description: "Renato Vaz, um olhar além das lentes",
      ...baseTemplateData
    };

    const html = templates.home(data, handlebarsConfig);

    return c.html(html);
  });

  // app.get('/sobre', async (c) => {
  //   const data = {
  //     ...baseTemplateData
  //   };

  //   return c.html(html);
  // });

  // app.get('/site/:slug', async (c) => {

  // });

  return app;
}