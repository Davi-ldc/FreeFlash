import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
// import imageUrlBuilder from '@sanity/image-url'
import dotenv from 'dotenv'
import type { Content } from 'src/types/sanity'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env') })

const client = createClient({
	apiVersion: '2025-02-19',
	dataset: 'production',
	projectId: process.env.SANITY_PROJECT_ID,
	useCdn: true,
})

// const builder = imageUrlBuilder(client)

export default async function fetchCMS() {
	const time = performance.now()
	console.log('🔄 Buscando dados do Sanity...')

	try {
		const query = `*[_type == "simpleText"] {
      text
    }`

		//preprocessa os dados aqui

		const data = (await client.fetch(query)) as Content[]

		console.log(`✅ dados obtidos em ${((performance.now() - time) / 1000).toFixed(2)} segundos.`)

		return data
	} catch (error) {
		console.error('❌ Erro:', error)
		process.exit(1)
	}
}
