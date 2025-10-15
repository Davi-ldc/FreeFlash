import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'
// import imageUrlBuilder from '@sanity/image-url'
import type { Content } from 'src/types/sanity'

const defaultQuery = `*[_type == "simpleText"] {
			_id,
      text,
			OtherText
    }`

const client = createClient({
	apiVersion: '2025-02-19',
	dataset: 'production',
	projectId: process.env.SANITY_STUDIO_PROJECT_ID,
	useCdn: true,
})

// const builder = imageUrlBuilder(client)

export default async function fetchCMS(query: string = defaultQuery) {
	const time = performance.now()
	console.log('🔄 Buscando dados do Sanity...')

	try {
		const data = (await client.fetch(query)) as Content[]

		console.log(`✅ dados obtidos em ${((performance.now() - time) / 1000).toFixed(2)} segundos.`)
		return data
	} catch (error) {
		console.error('❌ Erro:', error)
		process.exit(1)
	}
}

const data = await fetchCMS()
const dataPath = path.join(import.meta.dir, '/content.json')
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
console.log(`📝 Dados salvos em ${dataPath}`)
