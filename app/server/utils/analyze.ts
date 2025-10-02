import { readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { gzipSync } from 'zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, '../../out/')
const CLOUDFLARE_LIMIT_KB = 1024 * 3 // 3MB

// Função para formatar bytes em KB com 2 casas decimais
const formatSize = (bytes: number): string => `${(bytes / 1024).toFixed(2)} KB`

console.log('🔍 Analisando bundle...')

const files = readdirSync(dir)
const bundleFilename = files.find((f) => f === '_worker.js')

if (!bundleFilename) {
	console.error('❌ Erro: Não foi possível encontrar "_worker.js" no diretório de saída.')
	process.exit(1)
}

const outputFilePath = path.join(dir, bundleFilename)
const sourcemapFilePath = `${outputFilePath}.map`

// Verifica se o arquivo de sourcemap existe
if (!files.includes(`${bundleFilename}.map`)) {
	console.error('❌ Erro: Arquivo de sourcemap não encontrado. Certifique-se de que o build foi gerado com sourcemaps.')
	process.exit(1)
}

// --- ANÁLISE GZIP (sem alterações) ---
try {
	const stats = statSync(outputFilePath)
	const originalSizeInBytes = stats.size
	const fileContent = readFileSync(outputFilePath)
	const gzippedSizeInBytes = gzipSync(fileContent).length
	const savingPercentage = ((originalSizeInBytes - gzippedSizeInBytes) / originalSizeInBytes) * 100
	const gzippedSizeInKB = gzippedSizeInBytes / 1024

	const status =
		gzippedSizeInKB <= CLOUDFLARE_LIMIT_KB
			? `✅ você ainda tem ${(CLOUDFLARE_LIMIT_KB - gzippedSizeInKB).toFixed(2)} KB de sobra`
			: `❌ Passou o limite por ${(gzippedSizeInKB - CLOUDFLARE_LIMIT_KB).toFixed(2)} KB`

	console.log(`
---
ANÁLISE GZIP (para Cloudflare Workers) 📄
  ${bundleFilename}: ${formatSize(originalSizeInBytes)} → ${formatSize(gzippedSizeInBytes)} (-${savingPercentage.toFixed(2)}%)

📊 RESUMO:
  Tamanho Original: ${formatSize(originalSizeInBytes)}
  Tamanho Gzip:     ${formatSize(gzippedSizeInBytes)}
  Economia:         ${savingPercentage.toFixed(2)}%
  Limite Cloudflare:  ${CLOUDFLARE_LIMIT_KB.toFixed(2)} KB
  Status:           ${status}
---
  `)
} catch (error) {
	console.error('❌ Erro ao calcular o tamanho do Gzip:', error)
}

// --- NOVA ANÁLISE DE SOURCE MAP ---
try {
	console.log('📄 Analisando o source map para detalhar o tamanho dos módulos...')

	const sourcemapContent = readFileSync(sourcemapFilePath, 'utf-8')
	const sourcemap = JSON.parse(sourcemapContent)

	if (!sourcemap.sources || !sourcemap.sourcesContent) {
		throw new Error('Sourcemap inválido. Os campos "sources" ou "sourcesContent" não foram encontrados.')
	}

	const sizeByPackage: Record<string, number> = {}
	let totalSize = 0

	// Função para extrair o nome do pacote de um caminho de arquivo
	const getPackageName = (sourcePath: string): string => {
		const normalizedPath = sourcePath.replace(/\\/g, '/')
		const nodeModulesIndex = normalizedPath.indexOf('node_modules/')

		if (nodeModulesIndex === -1) {
			return normalizedPath.replace(/(\.\.\/)+/g, '') // Arquivo local do projeto
		}

		const pathAfter = normalizedPath.substring(nodeModulesIndex + 'node_modules/'.length)
		const parts = pathAfter.split('/')

		// Verifica se é um pacote com escopo (ex: @elysiajs/html)
		if (parts[0].startsWith('@') && parts.length > 1) {
			return `${parts[0]}/${parts[1]}`
		}

		// Pacote normal (ex: cookie)
		return parts[0]
	}

	sourcemap.sources.forEach((source: string, index: number) => {
		const content = sourcemap.sourcesContent[index]

		if (typeof content !== 'string') return

		const sizeInBytes = Buffer.byteLength(content, 'utf8')
		const packageName = getPackageName(source)

		sizeByPackage[packageName] = (sizeByPackage[packageName] || 0) + sizeInBytes
		totalSize += sizeInBytes
	})

	const sortedPackages = Object.entries(sizeByPackage)
		.map(([name, size]) => ({ name, size }))
		.sort((a, b) => b.size - a.size)

	console.log(`
---
ANÁLISE POR PACOTE (do Source Map) 📦
Tamanho total (não minificado): ${formatSize(totalSize)}
---
`)

	// Imprime a tabela de pacotes
	console.log(`  ${'PACOTE'.padEnd(45)} | ${'TAMANHO'.padStart(10)} | ${'% DO TOTAL'.padStart(10)}`)
	console.log(`  ${'-'.repeat(45)}-|-${'-'.repeat(10)}-|-${'-'.repeat(10)}`)

	sortedPackages.forEach(({ name, size }) => {
		const percentage = ((size / totalSize) * 100).toFixed(2)
		const displayName = name.length > 43 ? `${name.substring(0, 40)}...` : name

		console.log(`  ${displayName.padEnd(45)} | ${formatSize(size).padStart(10)} | ${`${percentage}%`.padStart(10)}`)
	})
	console.log('---')
} catch (error) {
	console.error('❌ Falha ao analisar o source-map:', error)
}
