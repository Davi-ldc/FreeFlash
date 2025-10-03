import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID

export default defineConfig({
	dataset: 'production',
	name: 'default',

	plugins: [structureTool(), visionTool()],

	projectId: projectId || '',

	schema: {
		types: schemaTypes,
	},
	title: 'freeflash',
})
