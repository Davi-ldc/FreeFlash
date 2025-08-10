// app/vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import { VITE_PORT } from './server/config/port';

const port = VITE_PORT;

export default defineConfig({
  root: '.',
  server: {
    port: port,
    //se não ele vai responder como se os assets estivessem em localhost:honoPort/
    origin: `http://localhost:${port}`
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
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
      }
    },
    assetsInlineLimit: 0
  }
})