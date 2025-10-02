import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'

export const testApi = new Elysia({ adapter: CloudflareAdapter, prefix: '/api/test' })
	.get('/', () => ({
		message: 'Test API funcionando!',
		timestamp: new Date().toISOString(),
	}))
	.get('/hello', () => ({
		message: 'Hello from test API!',
	}))

export default testApi.compile()
