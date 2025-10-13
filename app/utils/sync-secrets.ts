import { $ } from 'bun'

interface Secret {
	name: string
	envVar: string
	required: boolean
}

const SECRETS: Secret[] = [
	{ envVar: 'CLOUDFLARE_API_TOKEN', name: 'CLOUDFLARE_API_TOKEN', required: true },
	{ envVar: 'CLOUDFLARE_ACCOUNT_ID', name: 'CLOUDFLARE_ACCOUNT_ID', required: true },
	{ envVar: 'SANITY_STUDIO_PROJECT_ID', name: 'SANITY_PROJECT_ID', required: true },
	{ envVar: 'SANITY_WEBHOOK_SECRET', name: 'SANITY_WEBHOOK_SECRET', required: true },
	{ envVar: 'GITHUB_REPO', name: 'GH_REPO', required: true },
	{ envVar: 'GITHUB_TOKEN', name: 'GH_TOKEN', required: true },
	{ envVar: 'TURBO_TOKEN', name: 'TURBO_TOKEN', required: false },
	{ envVar: 'TURBO_TEAM', name: 'TURBO_TEAM', required: false },
]

async function checkGitHubCLI(): Promise<boolean> {
	try {
		await $`gh --version`.quiet()
		return true
	} catch {
		return false
	}
}

async function syncSecret(secret: Secret): Promise<void> {
	const value = process.env[secret.envVar]

	if (!value) {
		if (secret.required) {
			console.error(`❌ ${secret.envVar} not found in .env`)
			throw new Error(`Missing required secret: ${secret.envVar}`)
		} else {
			console.warn(`⚠️  ${secret.envVar} not found (optional, skipping)`)
			return
		}
	}

	try {
		// Remove secret existente (ignora erro se não existir)
		await $`gh secret remove ${secret.name}`.quiet().nothrow()

		// Adiciona o novo secret
		await $`echo ${value} | gh secret set ${secret.name}`.quiet()

		console.log(`✅ ${secret.name} synced`)
	} catch (error) {
		console.error(`❌ Failed to sync ${secret.name}:`, error)
		throw error
	}
}

async function main() {
	console.log('🔄 Syncing GitHub Secrets...\n')

	// Verifica se GitHub CLI está instalado
	const hasGH = await checkGitHubCLI()
	if (!hasGH) {
		console.error('❌ GitHub CLI (gh) not installed')
		console.log('\n📦 Install: https://cli.github.com/')
		console.log('   Windows: winget install --id GitHub.cli')
		console.log('   Or: choco install gh')
		process.exit(1)
	}

	// Verifica se está autenticado
	try {
		await $`gh auth status`.quiet()
	} catch {
		console.error('❌ Not authenticated with GitHub CLI')
		console.log('\n🔐 Run: gh auth login')
		process.exit(1)
	}

	// Sincroniza cada secret
	let successCount = 0
	let errorCount = 0

	for (const secret of SECRETS) {
		try {
			await syncSecret(secret)
			successCount++
		} catch {
			errorCount++
		}
	}

	console.log(`\n✨ Done! ${successCount} secrets synced, ${errorCount} errors`)

	if (errorCount > 0) {
		process.exit(1)
	}
}

main().catch(console.error)
