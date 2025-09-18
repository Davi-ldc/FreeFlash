import { defineConfig } from 'vite'
import path from 'path'
import { VITE_PORT } from './server/config/port'

const port = VITE_PORT

export default defineConfig({
  root: '.',
  plugins: [
    {
      name: 'watcher',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.tsx')) {
          console.log(`🔄 Template alterado: ${path.basename(file)}`)

          server.ws.send({
            type: 'full-reload',
            path: '*',
          })

          return []
        }
      },
    },
  ],
  server: {
    port: port,
    //sem isso ele vai responder como se os assets estivessem em localhost:honoPort/
    origin: `http://localhost:${port}`,
    cors: true, //Por causa do codespaces,
  },
  build: {
    outDir: '.vercel/output/static',
    assetsDir: 'assets',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.ts'),
      },
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
      },
    },
    assetsInlineLimit: 0,
  },
})
