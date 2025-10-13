import { describe, expect, it } from 'bun:test'

describe('GitHub Token Validation', () => {
	it('should have GITHUB_REPO configured', () => {
		const githubRepo = process.env.GITHUB_REPO
		expect(githubRepo).toBeDefined()
		expect(githubRepo).toMatch(/^[\w-]+\/[\w-]+$/) // formato: usuario/repo
		console.log('✅ GITHUB_REPO:', githubRepo)
	})

	it('should have GITHUB_TOKEN configured', () => {
		const githubToken = process.env.GITHUB_TOKEN
		expect(githubToken).toBeDefined()
		expect(githubToken).toMatch(/^(ghp_|github_pat_)/) // formato do token
		console.log('✅ GITHUB_TOKEN configured (hidden)')
	})

	it('should be able to trigger GitHub Actions workflow', async () => {
		const githubRepo = process.env.GITHUB_REPO
		const githubToken = process.env.GITHUB_TOKEN

		if (!githubRepo || !githubToken) {
			throw new Error('GitHub credentials not configured')
		}

		const testPayload = {
			_id: 'test-123',
			OtherText: 'Testing GitHub Actions trigger',
			text: 'Test webhook',
		}

		const response = await fetch(`https://api.github.com/repos/${githubRepo}/dispatches`, {
			body: JSON.stringify({
				client_payload: testPayload,
				event_type: 'cms-update',
			}),
			headers: {
				Accept: 'application/vnd.github.v3+json',
				Authorization: `Bearer ${githubToken}`,
				'Content-Type': 'application/json',
				'User-Agent': 'FreeFlash-Test',
			},
			method: 'POST',
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('❌ GitHub API error:', response.status, errorText)
			throw new Error(`GitHub API returned ${response.status}: ${errorText}`)
		}

		expect(response.status).toBe(204) // GitHub retorna 204 No Content em sucesso
		console.log('✅ GitHub Actions workflow triggered successfully!')
	})

	it('should validate token permissions by checking repo access', async () => {
		const githubRepo = process.env.GITHUB_REPO
		const githubToken = process.env.GITHUB_TOKEN

		if (!githubRepo || !githubToken) {
			throw new Error('GitHub credentials not configured')
		}

		// Testa se o token tem acesso ao repositório
		const response = await fetch(`https://api.github.com/repos/${githubRepo}`, {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				Authorization: `Bearer ${githubToken}`,
				'User-Agent': 'FreeFlash-Test',
			},
		})

		expect(response.status).toBe(200)

		const repo = (await response.json()) as {
			full_name: string
			private: boolean
			permissions?: Record<string, boolean>
		}
		console.log('✅ Repository access verified:', repo.full_name)
		console.log('   - Private:', repo.private)
		console.log('   - Permissions:', repo.permissions)
	})
})
