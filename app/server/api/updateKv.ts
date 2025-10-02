// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
// import dotenv from 'dotenv'
// import { Elysia } from 'elysia'
// import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
// import type { Content } from 'src/types/sanity'

// import fetchCMS from '../../fetch-cms'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// dotenv.config({ path: path.resolve(__dirname, '.env') })

// async function uploadToKV(data: Content[]) {
// 	const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
// 	const NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID
// 	const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

// 	if (!ACCOUNT_ID || !NAMESPACE_ID || !API_TOKEN) {
// 		console.warn('⚠️  Variáveis do Cloudflare KV não configuradas. Pulando upload para KV.')
// 		console.warn('   Configure: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID, CLOUDFLARE_API_TOKEN')

// 		return false
// 	}

// 	try {
// 		console.log('📤 Enviando para Cloudflare KV...')

// 		const response = await fetch(
// 			`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/content`,
// 			{
// 				body: JSON.stringify(data),
// 				headers: {
// 					Authorization: `Bearer ${API_TOKEN}`,
// 					'Content-Type': 'application/json',
// 				},
// 				method: 'PUT',
// 			},
// 		)

// 		if (!response.ok) {
// 			const error = await response.text()
// 			throw new Error(`Erro HTTP ${response.status}: ${error}`)
// 		}
// 		console.log('✅ Conteúdo enviado para Cloudflare KV com sucesso')

// 		return true
// 	} catch (error) {
// 		console.error('❌ Erro ao fazer upload para KV:', error)

// 		return false
// 	}
// }

// const data = await fetchCMS()
// await uploadToKV(data)

// // Export compilado para produção
// export default updateKvApi.compile()
