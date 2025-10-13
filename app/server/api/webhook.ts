import crypto from 'node:crypto'
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'

function validateSignature(body: string, signature: string, secret: string): boolean {
	if (!signature) return false

	const parts = signature.split(',').reduce(
		(acc, part) => {
			const [key, value] = part.split('=')
			acc[key] = value
			return acc
		},
		{} as Record<string, string>,
	)

	const timestamp = parts.t
	const receivedHash = parts.v1

	if (!timestamp || !receivedHash) return false

	// Prevene replay attacks
	const now = Date.now()
	const requestTime = Number.parseInt(timestamp, 10)
	const fiveMinutes = 5 * 60 * 1000

	if (now - requestTime > fiveMinutes) {
		console.warn('⚠️ Webhook signature expired')
		return false
	}

	const payload = `${timestamp}.${body}`
	const expectedHash = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('base64')

	// Comparação timing-safe
	return crypto.timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash))
}

const webhookApi = new Elysia({ adapter: CloudflareAdapter, prefix: '/api/webhook' }).post(
	'/',
	async ({ headers, request, status }) => {
		const signature = headers['sanity-webhook-signature']
		const secret = process.env.SANITY_WEBHOOK_SECRET

		if (!secret) {
			console.error('❌ SANITY_WEBHOOK_SECRET not configured')
			return status(500)
		}

		const rawBody = await request.text()
		const isValid = validateSignature(rawBody, signature || '', secret)

		if (!isValid) {
			console.warn('⚠️ Invalid webhook signature')
			return status(401)
		}

		const parsedBody = JSON.parse(rawBody)

		// Como eu só tenho um schema to ignorando o _type
		const payload = {
			_id: parsedBody._id,
			OtherText: parsedBody.OtherText,
			text: parsedBody.text,
		}

		console.log('✅ Valid webhook received:', payload)

		// Disparar GitHub Actions
		const githubRepo = process.env.GITHUB_REPO
		const githubToken = process.env.GITHUB_TOKEN

		if (!githubRepo || !githubToken) {
			console.error('❌ Variáveis GitHub não configuradas')
			return status(500)
		}

		try {
			const response = await fetch(`https://api.github.com/repos/${githubRepo}/dispatches`, {
				body: JSON.stringify({
					client_payload: payload,
					event_type: 'cms-update',
				}),
				headers: {
					Accept: 'application/vnd.github.v3+json',
					Authorization: `Bearer ${githubToken}`,
					'Content-Type': 'application/json',
					'User-Agent': 'FreeFlash-Webhook',
				},
				method: 'POST',
			})

			if (!response.ok) {
				const errorText = await response.text()
				console.error('❌ GitHub API error:', response.status, errorText)
				return status(500)
			}

			return { message: 'Workflow triggered', success: true }
		} catch (error) {
			console.error('❌ Error calling GitHub API:', error)
			return status(500)
		}
	},
)

export default webhookApi.compile()
