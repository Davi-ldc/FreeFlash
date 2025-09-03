import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Hono } from 'hono/tiny';
import { handle } from 'hono/vercel';
import { Resend } from 'resend';

const app = new Hono().basePath('/api');

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-email', async (c) => { 
  try {
    const body = await c.req.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !message || !subject) {
      return c.json({ 
        error: 'Nome, email, assunto e mensagem são obrigatórios.' 
      }, 400);
    }

    //garante que tenha algumacoisa@algumacoisa.algumacoisa
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ 
        error: 'Email inválido.' 
      }, 400);
    }

    const { data, error } = await resend.emails.send({
      from: 'Contato Site <onboarding@resend.dev>',
      to: ['davilimacarv2536@gmail.com'],
      subject: subject,
      text: `
        Nova mensagem de contato
        
        Nome: ${name}
        Email: ${email}
        Assunto: ${subject}

        Mensagem:
        ${message}
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return c.json({ 
        error: 'Erro ao enviar email. Tente novamente.' 
      }, 500);
    }

    return c.json({ 
      message: 'Email enviado com sucesso!',
      id: data?.id 
    });
  } catch (err) {
    console.error('Erro:', err);
    return c.json({ 
      error: 'Erro. Tente novamente mais tarde.' 
    }, 500);
  }
});

export const POST = handle(app);

export default app;