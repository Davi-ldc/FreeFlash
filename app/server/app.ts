import type { FC } from 'hono/jsx'
import { Hono } from 'hono/tiny'
import type { Manifest } from 'vite'

import type { LayoutProps, PageModel, SectionMap } from '../src/types/views'

export interface AppConfig {
  isDev: boolean
  manifest?: Manifest
  viteBaseUrl?: string
  viteCSS: string
  viteJS: string
  vitePort?: number
}

export type Views = {
  Layout: FC<LayoutProps>
}

function assetHelper(originalPath: string, isDev: boolean, manifest?: Manifest, viteBaseUrl?: string): string {
  // Em DEV -> servidor Vite
  if (isDev) {
    if (!viteBaseUrl) {
      console.warn('faltou o viteBaseUrl no assetHelper')

      return `/${originalPath}`
    }
    const base = viteBaseUrl.replace(/\/+$/, '')
    const path = String(originalPath).replace(/^\/+/, '')

    return `${base}/${path}`
  }

  // Fallback de segurança
  if (!manifest) {
    console.warn('faltou o manifest no assetHelper')

    return `/${originalPath}`
  }

  // Em prod lê o manifest e retorna o caminho para o arquivo hasheado
  const manifestKey = originalPath // o manifest usa a raiz como chave (ex: 'src/main.ts')

  if (manifest[manifestKey]) {
    return `/${manifest[manifestKey].file}`
  }

  console.warn(`Asset não encontrado no manifest.json: ${originalPath}`)

  return `/${originalPath}`
}

const section = <T extends keyof SectionMap>(type: T, props: SectionMap[T]): { _type: T } & SectionMap[T] => ({
  _type: type,
  ...props,
})

export function createApp(config: AppConfig, views: Views) {
  const baseProps: Omit<LayoutProps, 'page'> = {
    asset: (p) => assetHelper(p, config.isDev, config.manifest, config.viteBaseUrl),
    description: 'Descrição',
    is_dev: config.isDev,
    lang: 'pt-br',
    site_title: 'FreeFlash✨',
    vite_css: config.viteCSS,
    vite_js: config.viteJS,
  }

  const app = new Hono()

  app.get('/', (c) => {
    const page: PageModel = {
      content: [
        section('welcome', { text: 'Bem-vindo ao FreeFlash!' }),
        section('welcome', { text: 'Esta é uma seção de boas-vindas.' }),
      ],
    }

    const props: LayoutProps = {
      ...baseProps,
      page,
    }

    const el = views.Layout(props)

    if (!el) {
      return c.text('error rendering the app', 500)
    }

    return c.html(el)
  })

  return app
}
