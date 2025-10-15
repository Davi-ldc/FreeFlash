import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createApp } from './app'
import { DEV_PORT, VITE_PORT } from './config/port'

const { CODESPACE_NAME } = process.env as Record<string, string | undefined>

const viteBaseUrl = CODESPACE_NAME
	? `https://${CODESPACE_NAME}-${VITE_PORT}.app.github.dev`
	: `http://localhost:${VITE_PORT}`

async function DevApis(mainInstance: ReturnType<typeof createApp>) {
	const apiDir = path.join(import.meta.dir, './api')
	console.log('📂 Carregando APIs de', apiDir)
	if (!fs.existsSync(apiDir)) {
		console.warn('[API] diretório /api não encontrado')
		return
	}
	const files = fs.readdirSync(apiDir)

	for (const file of files) {
		if (!/\.(ts|js|mjs|cjs)$/.test(file)) continue
		const fullPath = path.join(apiDir, file)
		try {
			const mod = await import(pathToFileURL(fullPath).href)
			const sub = mod.default
			if (sub) {
				mainInstance.use(sub)
				console.log('[API] montada:', file)
			} else {
				console.warn('[API] ignorada (sem export default):', file)
			}
		} catch (e) {
			console.error('[API] erro ao importar', file, e)
		}
	}
}

function logRoutes(app: ReturnType<typeof createApp>) {
	const routes: string[] = []

	if (app.routes && Array.isArray(app.routes)) {
		for (const route of app.routes) {
			const methods = Array.isArray(route.method) ? route.method : [route.method || 'GET']

			for (const method of methods) {
				routes.push(`${method.padEnd(7)} ${route.path}`)
			}
		}
	}

	if (routes.length) {
		console.log('\n📍 Rotas disponíveis:')

		routes
			.sort((a, b) => {
				// Agrupa por path, depois por método
				const [methodA, pathA] = a.split(' ')
				const [methodB, pathB] = b.split(' ')

				return pathA.localeCompare(pathB) || methodA.localeCompare(methodB)
			})
			.forEach((route) => {
				console.log(`   - ${route}`)
			})
		console.log('')
	}
}

async function main() {
	const app = createApp({
		isDev: true,
		viteBaseUrl,
		viteCSS: `${viteBaseUrl}/src/styles/main.scss`,
		viteJS: `${viteBaseUrl}/src/main.ts`,
		vitePort: VITE_PORT,
	})

	await DevApis(app)

	app.listen(DEV_PORT, () => {
		console.log(`\n🚀 Servidor rodando em \x1b[36mhttp://localhost:\x1b[1m${DEV_PORT}\x1b[0m`)

		if (CODESPACE_NAME) {
			console.log(`   Codespace:  \x1b[36mhttps://${CODESPACE_NAME}-${DEV_PORT}.app.github.dev\x1b[0m`)
		}
		console.log(`⚡ Vite DevServer: ${viteBaseUrl}`)

		logRoutes(app)
	})
}

main()
