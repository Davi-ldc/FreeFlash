import { Hono } from 'hono';

// Para diminuir o cold start
import contentData from '../content.json';

//@ts-ignore não vou criar um arquivo de tipos só pra isso
import templates from './precompiled-templates.js';
const partials = { header: templates.header, footer: templates.footer};

// Types
import type { ColecaoAgrupada } from '../src/types/sanity';
import type { Base, Home } from '../src/types/pages';
import type { Manifest } from 'vite';

const content: ColecaoAgrupada[] = contentData as ColecaoAgrupada[];

export interface AppConfig {
  isDev: boolean;
  viteJS: string;
  viteCSS: string;
  manifest?: Manifest;
  vitePort?: number;
}

function assetHelper(originalPath: string, isDev: boolean, manifest?: Manifest, vitePort?: number): string {
  // Em DEV, retorna o caminho pro servidor Vite
  if (isDev) {
    if (!vitePort) {console.warn('faltou o vitePort no assetHelper'); return `/${originalPath}`;}
    return `http://localhost:${vitePort}/${originalPath}`;
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
    site_title: 'Titulo',
    charset: 'UTF-8',
    lang: 'pt-br',
    is_dev: config.isDev,
    vite_js: config.viteJS,
    vite_css: config.viteCSS
  };

  const helpers = {
    asset: (path: string) => assetHelper(path, config.isDev, config.manifest, config.vitePort)
  };

  const handlebarsConfig = { partials: partials, helpers: helpers };

  const app = new Hono();

  app.get('/', async (c) => {
    const data: Home = {
      colecoes: content,
      latest_year: content[0]?.ano ?? new Date().getFullYear(),
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