import { html } from '@elysiajs/html'
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
import type { Manifest } from 'vite'

import type { LayoutProps, PageModel, SectionMap } from '../src/types/views'
import Layout from '../src/views/layout'

export interface AppConfig {
	isDev: boolean
	manifest?: Manifest
	viteBaseUrl?: string
	viteCSS: string
	viteJS: string
	vitePort?: number
}

function assetHelper(originalPath: string, isDev: boolean, manifest?: Manifest, viteBaseUrl?: string): string {
	// Em DEV -> servidor Vite
	if (isDev) {
		if (!viteBaseUrl) return `/${originalPath}`
		const base = viteBaseUrl.replace(/\/+$/, '')
		const path = String(originalPath).replace(/^\/+/, '')

		return `${base}/${path}`
	}

	if (!manifest) return `/${originalPath}`

	// Em prod lê o manifest e retorna o caminho para o arquivo hasheado
	const manifestKey = originalPath // o manifest usa a raiz como chave (ex: 'src/main.ts')

	if (manifest[manifestKey]) return `/${manifest[manifestKey].file}`

	return `/${originalPath}`
}

const section = <T extends keyof SectionMap>(type: T, props: SectionMap[T]): { _type: T } & SectionMap[T] => ({
	_type: type,
	...props,
})

export function createApp(config: AppConfig) {
	const baseProps: Omit<LayoutProps, 'page'> = {
		asset: (p) => assetHelper(p, config.isDev, config.manifest, config.viteBaseUrl),
		description: 'Descrição',
		is_dev: config.isDev,
		lang: 'pt-br',
		site_title: 'FreeFlash✨',
		vite_css: config.viteCSS,
		vite_js: config.viteJS,
	}

	//Só usa o adapter em dev
	const app = new Elysia({ adapter: config.isDev ? undefined : CloudflareAdapter }).use(html())

	app.get('/', () => {
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

		return <Layout {...props} />
	})

	return app
}
