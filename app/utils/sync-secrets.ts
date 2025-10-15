import { $ } from 'bun'
import { readFileSync } from 'fs'
import path from 'path'

const ENV_PATH = path.join(import.meta.dir, '../.env')

async function syncGitHubSecret(key: string, value: string): Promise<string> {
	await $`gh secret remove ${key}`.quiet().nothrow()
	await $`echo ${value} | gh secret set ${key}`.quiet()
	return key
}

async function main() {
	console.log('🔄 Syncing Secrets...\n')

	const envMap = new Map<string, string>()
	readFileSync(ENV_PATH, 'utf-8')
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.forEach((line) => {
			const [key, ...parts] = line.split('=')
			const value = parts.join('=').replace(/^["']|["']$/g, '')
			if (value) envMap.set(key.trim(), value)
		})

	const secrets = Array.from(envMap.entries())

	try {
		await $`gh auth status`.quiet()
	} catch {
		console.error('❌ GitHub CLI not installed or not authenticated')
		console.log('\n📦 Install: https://cli.github.com/')
		console.log('🔐 Login: gh auth login')
		process.exit(1)
	}

	const tasks: Promise<string>[] = []

	console.log('📤 Syncing to GitHub...\n')
	for (const [key, value] of secrets) {
		tasks.push(syncGitHubSecret(key, value))
	}

	// Executa em paralelo
	const results = await Promise.allSettled(tasks)

	const successCount = results.filter((r) => r.status === 'fulfilled').length
	const errorCount = results.length - successCount

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error(`❌ Error: ${result.reason}`)
		}
	}

	console.log(`\n✨ ${successCount} synced, ${errorCount} errors`)

	if (errorCount > 0) process.exit(1)
}

main().catch(console.error)
