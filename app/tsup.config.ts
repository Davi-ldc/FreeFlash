import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  entry: ['./server/index.ts'],
  target: 'esnext',
  platform: 'browser',//em node não precisa disso
  format: 'esm',//edge -> esm, node -> cjs
  outDir: '.vercel/output/functions/index.func',
  clean: true,// Limpa a pasta dist antes de gerar o novo bundle  
  // metafile: true,  // legal pra ver o peso de cada arquivo no bundle
  noExternal: ['hono', 'eta'],//unicas libs que eu uso no bundle
  loader: {
    '.hbs': 'text',
  },
  minify: true,
  sourcemap: false, //true pra debug
  splitting: false,
  treeshake: true
});