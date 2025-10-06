import { createClient } from '@sanity/client'
// import imageUrlBuilder from '@sanity/image-url'
import type { Content } from 'src/types/sanity'

const client = createClient({
	apiVersion: '2025-02-19',
	dataset: 'production',
	projectId: process.env.SANITY_STUDIO_PROJECT_ID,
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
