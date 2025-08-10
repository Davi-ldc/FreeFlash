import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  entry: ['./server/index.ts'],
  format: 'esm',//edge -> esm, node -> cjs
  outDir: '.vercel/output/functions/index.func',
  clean: true,// Limpa a pasta dist antes de gerar o novo bundle  
  // metafile: true,  // legal pra ver o peso de cada arquivo no bundle
  noExternal: ['hono', 'handlebars/runtime'],
  loader: {
    '.hbs': 'text',
  },
  minify: true,
  sourcemap: false, //true pra debug
  splitting: false,
  treeshake: true
});