import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'

const testApi = new Elysia({ adapter: CloudflareAdapter, prefix: '/api/test' })
	.get('/', () => ({
		message: 'Test API funcionando!',
		timestamp: new Date().toISOString(),
	}))
	.get('/api/test', () => ({
		message: 'Hello from test API!',
	}))
export default testApi.compile()
