import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  clean: true, // Limpa a pasta dist antes de gerar o novo bundle
  entry: ['./server/index.ts'],
  format: 'esm', //edge -> esm, node -> cjs
  loader: {
    // metafile: true,  // legal pra ver o peso de cada arquivo no bundle
    '.hbs': 'text',
  },
  minify: true,
  noExternal: ['hono'], //unicas libs que eu uso no bundle
  outDir: '.vercel/output/functions/index.func',
  platform: 'browser', //em node não precisa disso
  sourcemap: false, //true pra debug
  splitting: false,
  target: 'esnext',
  treeshake: true,
})
