import { Elysia } from 'elysia'

const testApi = new Elysia({ prefix: '/api/test' })
  .get('/', () => ({
    message: 'Test API funcionando!',
    timestamp: new Date().toISOString(),
  }))
  .get('/hello', () => ({
    message: 'Hello from test API!',
  }))
  .post('/echo', ({ body }) => ({
    echo: body,
    received_at: new Date().toISOString(),
  }))

export default testApi
