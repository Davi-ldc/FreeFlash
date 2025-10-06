import fs from 'node:fs'
import path from 'node:path'

const OUTPUT_DIR = 'out'
const API_DIR = 'out/api'

const debug = process.argv.includes('--debug')

const BuildSettings = {
	format: 'esm',
	minify: true,
	splitting: false,
	target: 'browser', //sem fs pra rodar em edge
	tsconfig: './tsconfig.json',
} as const

async function buildWorker() {
	console.log('🔨 Bundling worker...')

	const result = await Bun.build({
		entrypoints: ['./server/index.ts'],
		naming: {
			entry: '_worker.js',
		},
		outdir: OUTPUT_DIR,
		sourcemap: debug ? 'external' : undefined,
		...BuildSettings,
	})

	if (!result.success) {
		console.error('❌ Build failed:', result.logs)
		process.exit(1)
	}

	const bundlePath = path.join(OUTPUT_DIR, '_worker.js')
	const bundleSize = (fs.statSync(bundlePath).size / 1024).toFixed(2)

	console.log('✅ Worker bundled:', bundlePath)
	console.log(`📦 Bundle size: ${bundleSize} KB`)
}

async function buildApis() {
	fs.rmSync(API_DIR, { force: true, recursive: true }) // Limpa a pasta antiga
	fs.mkdirSync(API_DIR, { recursive: true })

	const apiEntries = fs.readdirSync('./server/api').filter((file) => ['.ts', '.tsx'].includes(path.extname(file)))

	const results = await Promise.all(
		apiEntries.map((entry) =>
			Bun.build({
				entrypoints: [`./server/api/${entry}`],
				outdir: API_DIR,
				...BuildSettings,
			}),
		),
	)

	console.log(`✅ APIs geradas em ${API_DIR}/`)
	results.forEach((result, i) => {
		const entry = apiEntries[i]
		const success = result.success ? '✓' : '✗'

		if (result.success && result.outputs.length > 0) {
			const size = (result.outputs[0].size / 1024).toFixed(2)
			console.log(`   ${success} ${entry} (${size} KB)`)
		} else {
			console.log(`   ${success} ${entry}`)
		}
	})
}

async function main() {
	const start = Date.now()

	// Builda em paralelo
	await Promise.all([buildWorker(), buildApis()])

	const elapsed = ((Date.now() - start) / 1000).toFixed(2)

	console.log(`\n✨ Build completo em ${elapsed}s`)
	console.log(`📂 Output: ${OUTPUT_DIR}/`)
}

main().catch(console.error)
