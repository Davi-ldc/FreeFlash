import { Hono } from 'hono/tiny';
import { compiledTemplates } from './precompiled-templates.js';
import contentData from '../content.json';

// Types
// import type { types } from '../src/types/sanity';
import type { Base, Home } from '../src/types/pages';
import type { Manifest } from 'vite';
import type { Eta } from 'eta';

export interface AppConfig {
  isDev: boolean;
  viteJS: string;
  viteCSS: string;
  manifest?: Manifest;
  vitePort?: number;
  viteBaseUrl?: string;
}

function assetHelper(originalPath: string, isDev: boolean, manifest?: Manifest, viteBaseUrl?: string): string {
  // Em DEV -> servidor Vite
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
    console.warn('faltou o manifest no assetHelper');
    return `/${originalPath}`;
  }

  //Em prod lê o manifest e retorna o caminho para o arquivo hasheado
  const manifestKey = originalPath; // O manifest do Vite usa o caminho a partir da raiz como chave.
  if (manifest[manifestKey]) {
    return `/${manifest[manifestKey].file}`;
  }
  
  console.warn(`Asset não encontrado no manifest.json: ${originalPath}`);
  return `/${originalPath}`;
}

export function createApp(config: AppConfig, eta: Eta) {
  const baseTemplateData: Base = {
    site_title: 'FreeFlash✨',
    charset: 'UTF-8',
    lang: 'pt-br',
    is_dev: config.isDev,
    vite_js: config.viteJS,
    vite_css: config.viteCSS
  };

  const helpers = {
    asset: (path: string) => assetHelper(path, config.isDev, config.manifest, config.viteBaseUrl)
  };

  const app = new Hono();

  app.get('/', (c) => {
    const data: Home = {
      description: 'Renato Vaz, um olhar além das lentes',
      ...baseTemplateData,
      ...helpers
    };

    const html = eta.render('/pages/home', data) as string;
    return c.html(html);
  });

  // app.get('/sobre', async (c) => {
  //   const data = {
  //     ...baseTemplateData,
  //     ...helpers
  //   };

  //   const html = eta.render('@pages/home', data) as string;
  //   return c.html(html);
  // });

  // app.get('/site/:slug', async (c) => {

  // });

  return app;
}