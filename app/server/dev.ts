import { serve } from '@hono/node-server'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import Layout from '../src/views/layout'
import { createApp } from './app'
import { DEV_PORT, VITE_PORT } from './config/port'

const { CODESPACE_NAME } = process.env as Record<string, string | undefined>

const viteBaseUrl = CODESPACE_NAME
  ? `https://${CODESPACE_NAME}-${VITE_PORT}.app.github.dev`
  : `http://localhost:${VITE_PORT}`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function DevApis(root: any) {
  const apiDir = path.join(__dirname, '../api')

  if (!fs.existsSync(apiDir)) {
    console.warn('[API] diretório /api não encontrado')

    return
  }
  const files = fs.readdirSync(apiDir)
  const discovered: string[] = []

  for (const file of files) {
    if (!/\.(ts|js|mjs|cjs)$/.test(file)) continue
    const fullPath = path.join(apiDir, file)

    try {
      const mod = await import(pathToFileURL(fullPath).href)
      const sub = mod.default

      if (sub) {
        root.route('/', sub)

        if (Array.isArray((sub as any).routes)) {
          for (const r of (sub as any).routes) {
            const methods = Array.isArray(r.method) ? r.method : [r.method || 'ANY']

            for (const m of methods) {
              discovered.push(`${m || 'ANY'} ${r.path}`)
            }
          }
        }
        console.log('[API] montada:', file)
      } else {
        console.warn('[API] ignorada (sem export default app):', file)
      }
    } catch (e) {
      console.error('[API] erro ao importar', file, e)
    }
  }

  if (discovered.length) {
    const list = discovered
      .sort((a, b) => a.localeCompare(b))
      .map((l) => '  - ' + l)
      .join('\n')
    console.log('APIs disponíveis:\n' + list)
  } else {
    console.log('Nenhuma rota de API encontrada.')
  }
}

;(async () => {
  const app = createApp(
    {
      isDev: true,
      viteBaseUrl,
      viteCSS: '',
      viteJS: `${viteBaseUrl}/src/main.ts`,
      vitePort: VITE_PORT,
    },
    { Layout },
  )

  await DevApis(app)

  try {
    serve({
      fetch: app.fetch,
      port: DEV_PORT,
    })
    console.log(`🚀 Página principal rodando em \x1b[36mhttp://localhost:\x1b[1m${DEV_PORT}\x1b[0m`)
    console.log(`🔌 Vite dev em: ${viteBaseUrl}`)
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error)
  }
})()
