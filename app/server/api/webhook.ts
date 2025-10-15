import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
import type { Content } from 'src/types/sanity'

const te = new TextEncoder()

async function hmacSha256Base64url(payload: string, secret: string): Promise<string> {
	const key = await crypto.subtle.importKey('raw', te.encode(secret), { hash: 'SHA-256', name: 'HMAC' }, false, [
		'sign',
	])
	const sig = await crypto.subtle.sign('HMAC', key, te.encode(payload))
	// ArrayBuffer -> base64url
	const bytes = new Uint8Array(sig)
	let bin = ''
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
	// base64
	const b64 = btoa(bin)
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function constantTimeEqualStr(a: string, b: string): boolean {
	if (a.length !== b.length) return false
	let res = 0
	for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i)
	return res === 0
}

async function validateSignature(body: string, signature: string, secret: string): Promise<boolean> {
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

	const now = Date.now()
	const requestTime = Number.parseInt(timestamp, 10)
	const fiveMinutes = 5 * 60 * 1000
	if (now - requestTime > fiveMinutes) {
		console.warn('⚠️ Webhook signature expired')
		return false
	}

	const payload = `${timestamp}.${body}`
	const expectedHash = await hmacSha256Base64url(payload, secret)

	console.log('🔍 Debug signature validation:', {
		expectedHash,
		payload: payload,
		receivedHash,
		timestamp,
	})

	return constantTimeEqualStr(receivedHash, expectedHash)
}

const webhookApi = new Elysia({ adapter: CloudflareAdapter, prefix: '/api/webhook' }).post(
	'/',
	async ({ headers, request, set }) => {
		const signature = headers['sanity-webhook-signature']
		const secret = process.env.SANITY_WEBHOOK_SECRET

		if (!secret) {
			console.error('❌ SANITY_WEBHOOK_SECRET not configured')
			set.status = 500
			return { error: 'Internal server error' }
		}

		// Ler o body apenas uma vez
		const rawBody = await request.text()

		const isValid = await validateSignature(rawBody, signature || '', secret)

		if (!isValid) {
			console.warn('⚠️ Invalid webhook signature')
			set.status = 401
			return { error: 'Unauthorized' }
		}

		const parsedBody = JSON.parse(rawBody) as Content

		const payload = {
			_id: parsedBody._id,
			OtherText: parsedBody.OtherText,
			text: parsedBody.text,
		}

		console.log('✅ Valid webhook received:', payload)

		const githubRepo = process.env.GH_REPO
		const githubToken = process.env.GH_TOKEN

		if (!githubRepo || !githubToken) {
			console.error('❌ Variáveis GitHub não configuradas')
			set.status = 500
			return { error: 'Internal server error' }
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
				set.status = 500
				return { error: 'GitHub API error' }
			}

			return { message: 'Workflow triggered', success: true }
		} catch (error) {
			console.error('❌ Error calling GitHub API:', error)
			set.status = 500
			return { error: 'Internal server error' }
		}
	},
)

export default webhookApi.compile()

/*
		"_id": "dd972e9e-4a89-4905-9f36-57a82bdb52ce",
		"Field1": "Texto2",
		"field2": "Texto1"

		Qual objeto tem o id (O(1))
		Atualizar os fields*

		
		
*/
