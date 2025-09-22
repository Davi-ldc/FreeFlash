import fs from 'fs'
import path from 'path'

const OUTPUT_DIR = 'out'

const debug = process.argv.includes('--debug')

async function buildWorker() {
  console.log('🔨 Bundling worker...')

  const result = await Bun.build({
    entrypoints: ['./server/index.ts'],
    format: 'esm',
    minify: true,
    naming: {
      entry: '_worker.js',
    },
    outdir: OUTPUT_DIR,
    sourcemap: debug ? 'external' : undefined,
    splitting: false,
    target: 'browser',
    tsconfig: './tsconfig.json',
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

async function main() {
  const start = Date.now()

  // Builda em paralelo
  await buildWorker()

  const elapsed = ((Date.now() - start) / 1000).toFixed(2)

  console.log(`\n✨ Build completo em ${elapsed}s`)
  console.log(`📂 Output: ${OUTPUT_DIR}/`)
}

main().catch(console.error)
