import path from 'path'
import { defineConfig } from 'vite'

import { VITE_PORT } from './server/config/port'

const port = VITE_PORT

export default defineConfig({
	build: {
		assetsDir: 'assets',
		assetsInlineLimit: 0,
		emptyOutDir: true,
		manifest: true,
		outDir: 'out/static',
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/main.ts'),
			},
			output: {
				assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
				chunkFileNames: 'assets/js/[name].[hash].js',
				entryFileNames: 'assets/js/[name].[hash].js',
			},
		},
	},
	plugins: [
		{
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.tsx')) {
					console.log(`🔄 Template alterado: ${path.basename(file)}`)

					server.ws.send({
						path: '*',
						type: 'full-reload',
					})

					return []
				}
			},
			name: 'watcher',
		},
	],
	root: '.',
	server: {
		cors: true, //Por causa do codespaces,
		//sem isso ele vai responder como se os assets estivessem em localhost:DEV_PORT/
		origin: `http://localhost:${port}`,
		port: port,
	},
})
