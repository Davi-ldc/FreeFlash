import { Hono } from 'hono/tiny';
import { handle } from 'hono/vercel';
// import { Resend } from 'resend';

const app = new Hono().basePath('/api');

app.post('/send-email', async (c) => {
  return c.json({ message: 'Email sending is currently disabled.' });
});

export const POST = handle(app);