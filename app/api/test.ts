import { Hono } from 'hono/tiny'
import { handle } from 'hono/vercel'

console.log('[api/test] boot')
console.log(`[api/test] process.env.VERCEL_URL: ${process.env.VERCEL_URL}`)

const app = new Hono().basePath('/api/test')

app.get('/', (c) => {
  return c.json({ message: 'API is working!' })
})

export const config = { runtime: 'nodejs' }

export const GET = handle(app)

export default app
