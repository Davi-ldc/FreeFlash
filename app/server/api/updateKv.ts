import { Elysia, t } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
import fetchCMS from '../../fetch-cms'

type Env = {
	SANITY_WEBHOOK_SECRET: string
	CONTENT_KV: KVNamespace
}

const app = new Elysia({ adapter: CloudflareAdapter, prefix: '/api/webhook' })

app.post(
	'/sanity',
	async ({ body, query, set, request }) => {
		const env = (request as any).env as Env

		// Valida configuração
		if (!env?.SANITY_WEBHOOK_SECRET || !env?.CONTENT_KV) {
			set.status = 500
			return { error: 'Configuração inválida' }
		}

		// Valida secret (Sanity envia via query string ou header)
		const secret = query.secret || request.headers.get('sanity-webhook-secret')
		
		if (secret !== env.SANITY_WEBHOOK_SECRET) {
			set.status = 401
			return { error: 'Secret inválido' }
		}

		// Previne duplicatas e replay attacks
		// Usa hash do body inteiro para detectar qualquer modificação
		const bodyHash = await crypto.subtle.digest(
			'SHA-256',
			new TextEncoder().encode(JSON.stringify(body))
		)
		const hashHex = Array.from(new Uint8Array(bodyHash))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
		
		const lockKey = `lock:${hashHex}`
		const recentLock = await env.CONTENT_KV.get(lockKey)
		
		if (recentLock) {
			return { message: 'Request duplicada detectada', success: true }
		}
		
		await env.CONTENT_KV.put(lockKey, '1', { expirationTtl: 300 })

		// Atualiza conteúdo
		try {
			const data = await fetchCMS()
			await env.CONTENT_KV.put('content', JSON.stringify(data))

			return { 
				message: 'Atualizado com sucesso', 
				success: true,
				timestamp: new Date().toISOString()
			}
		} catch (error) {
			console.error('Erro ao atualizar:', error)
			set.status = 500
			return { error: 'Erro ao atualizar conteúdo' }
		}
	},
	{ 
		body: t.Any(),
		query: t.Object({
			secret: t.Optional(t.String())
		})
	},
)

export default app.compile()