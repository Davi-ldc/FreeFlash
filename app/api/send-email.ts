import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Elysia, t } from 'elysia';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const app = new Elysia({ prefix: '/api' })
  .post('/send-email', async ({ body, set }) => { 
    try {
      const { name, email, subject, message } = body;

      // Basic validation
      if (!name || !email || !message || !subject) {
        set.status = 400;
        return { error: 'Nome, email, assunto e mensagem são obrigatórios.' };
      }

      //garante que tenha algumacoisa@algumacoisa.algumacoisa
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        set.status = 400;
        return { error: 'Email inválido.' };
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
        set.status = 500;
        return { error: 'Erro ao enviar email. Tente novamente.' };
      }

      return { 
        message: 'Email enviado com sucesso!',
        id: data?.id 
      };
    } catch (err) {
      console.error('Erro:', err);
      set.status = 500;
      return { error: 'Erro. Tente novamente mais tarde.' };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      subject: t.String(),
      message: t.String()
    })
  });

export default app;