import fs from 'node:fs'
import path from 'node:path'
import type { BaseSchema } from '@turbo/types'
import turboJson from '../turbo.json'
import wranglerJson from '../wrangler.json'
import packageJson from './package.json'

const API_DIR = 'out/api'
const BASE_URL = 'freeflash.dev'
const TURBO_CONFIG = '../turbo.json'
const PACKAGE_JSON = './package.json'

const colors = {
	blue: '\x1b[34m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	reset: '\x1b[0m',
	yellow: '\x1b[33m',
}

// Atualiza turbo.json com tasks de deploy
async function updateTurboConfig(apiNames: string[]) {
	const turboConfig: BaseSchema = structuredClone(turboJson)

	// tasks duplicadas
	const seen = new Set<string>()
	for (const name of apiNames) {
		if (seen.has(name)) {
			console.warn(`${colors.yellow}⚠️  Warning: Duplicate API name "${name}"${colors.reset}`)
		}
		seen.add(name)
	}

	const apiTasks = apiNames.map((name) => `app#deploy:api:${name}`)
	const newTaskNames = new Set(['app#deploy', ...apiTasks])

	// Remove tasks obsoletas
	for (const taskName of Object.keys(turboConfig.tasks)) {
		if (taskName.startsWith('app#deploy') && !newTaskNames.has(taskName)) {
			delete turboConfig.tasks[taskName]
			console.log(`${colors.red}- ${colors.reset}${taskName}`)
		}
	}

	// Adiciona/atualiza tasks das APIs
	for (const apiName of apiNames) {
		const taskName = `app#deploy:api:${apiName}`
		const newTask = {
			cache: true,
			dependsOn: ['app#build:apis'],
			env: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'],
			inputs: [`server/api/${apiName}.ts`],
		}

		const prev = turboConfig.tasks[taskName]
		if (!prev) {
			console.log(`${colors.green}added ${colors.reset}${taskName}`)
		} else if (JSON.stringify(prev) !== JSON.stringify(newTask)) {
			console.log(`${colors.green}updated ${colors.reset}${taskName}`)
		}

		turboConfig.tasks[taskName] = newTask
	}

	// Atualiza task principal de deploy
	const deployTask = {
		cache: true,
		dependsOn: ['app#build', ...apiTasks],
		env: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'],
		inputs: ['out/_worker.js'],
	}

	const prevDeployTask = turboConfig.tasks['app#deploy']
	if (!prevDeployTask || JSON.stringify(prevDeployTask) !== JSON.stringify(deployTask)) {
		console.log(`${colors.green}updated ${colors.reset}app#deploy`)
	}

	turboConfig.tasks['app#deploy'] = deployTask

	fs.writeFileSync(TURBO_CONFIG, `${JSON.stringify(turboConfig, null, 2)}\n`)

	// Formata com Biome
	await Bun.$`bunx biome format --write ${TURBO_CONFIG}`.quiet()

	console.log(`${colors.green}✓${colors.reset} turbo config updated`)
}

// Atualiza scripts no package.json
async function updatePackageScripts(apiNames: string[]) {
	const scripts: Record<string, string> = { ...packageJson.scripts }

	// Scripts das APIs
	const desiredApiKeys = new Set<string>()
	for (const apiName of apiNames) {
		const key = `deploy:api:${apiName}`
		const value = `bun run deploy.ts api ${apiName}`
		desiredApiKeys.add(key)

		if (!(key in scripts)) {
			scripts[key] = value
			console.log(`${colors.green}added ${colors.reset}${key}`)
		}
	}

	// Remove scripts obsoletos
	for (const key of Object.keys(scripts)) {
		if (key.startsWith('deploy:api:') && !desiredApiKeys.has(key)) {
			delete scripts[key]
			console.log(`${colors.red}- ${colors.reset}${key}`)
		}
	}

	// Ordena alfabeticamente
	const sortedScripts = Object.fromEntries(Object.entries(scripts).sort(([a], [b]) => a.localeCompare(b)))

	// Só escreve se algo mudou
	if (JSON.stringify(packageJson.scripts) !== JSON.stringify(sortedScripts)) {
		fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify({ ...packageJson, scripts: sortedScripts }, null, 2)}\n`)

		console.log(`${colors.green}✓${colors.reset} package.json updated`)
	} else {
		console.log(`${colors.blue}ℹ${colors.reset} package.json already up to date`)
	}
}

// Faz o deploy de um worker
async function deployWorker(name: string, main: string, route: string, customDomain = false) {
	const template = JSON.stringify(wranglerJson)
	//resolve ${VAR} com variáveis de ambiente (caso você queira usar kv, por exemplos)
	const baseConfig = JSON.parse(template.replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] || ''))

	const safeName = name.replace(/[^a-z0-9-]/gi, '_')
	const tempConfig = path.join('..', `${safeName}.wrangler.deploy.json`)

	const config = {
		...baseConfig,
		main: main, //arquivo .js
		name: name, //nome
		//rota
		routes: customDomain ? [{ custom_domain: true, pattern: route }] : [{ pattern: route, zone_name: BASE_URL }],
	}

	// APIs não servem assets
	if (!customDomain) {
		delete (config as Record<string, unknown>).assets
	}

	fs.writeFileSync(tempConfig, JSON.stringify(config, null, 2))

	console.log(`\n🚀 Deploying ${name}...`)
	console.log(`   📍 Route: ${route}`)
	console.log(`   📄 Main: ${main}`)

	try {
		await Bun.$`bunx wrangler deploy --config ${tempConfig}`
		console.log(`✅ ${name} deployed successfully`)
	} catch (error) {
		console.error(`❌ Failed to deploy ${name}:`, error)
		throw error
	} finally {
		if (fs.existsSync(tempConfig)) {
			try {
				fs.unlinkSync(tempConfig)
			} catch (err) {
				console.warn(`⚠️ Failed to remove temp config: ${err}`)
			}
		}
	}
}

async function main() {
	const [mode, apiName] = process.argv.slice(2)
	const apiNames = fs.existsSync(API_DIR)
		? fs.readdirSync(API_DIR).flatMap((file) => (file.endsWith('.js') ? [path.basename(file, '.js')] : []))
		: []
	switch (mode) {
		case 'config':
			if (!fs.existsSync(API_DIR)) {
				console.log('📝 No APIs found, configs up to date')
				return
			}
			updateTurboConfig(apiNames)
			updatePackageScripts(apiNames)
			break

		case 'main':
			await deployWorker('freeflash', 'app/out/_worker.js', BASE_URL, true)
			break

		case 'api':
			if (!apiName) {
				console.error('❌ API name required: bun deploy.ts api <name>')
				process.exit(1)
			}
			await deployWorker(`freeflash-api-${apiName}`, `app/out/api/${apiName}.js`, `${BASE_URL}/api/${apiName}*`)
			break

		case 'all':
			await Promise.all([
				deployWorker('freeflash', 'app/out/_worker.js', BASE_URL, true),
				...apiNames.map((name) =>
					deployWorker(`freeflash-api-${name}`, `app/out/api/${name}.js`, `${BASE_URL}/api/${name}/*`),
				),
			])
			break

		default:
			throw new Error(`❌ Invalid mode: ${mode}. Use: main | api <name> | all | config`)
	}
}

main().catch(console.error)
