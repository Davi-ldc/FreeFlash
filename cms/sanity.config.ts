import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID

export default defineConfig({
  name: 'default',
  title: 'freeflash',

  projectId: projectId || '',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
