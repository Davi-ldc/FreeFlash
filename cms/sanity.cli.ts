import {defineCliConfig} from 'sanity/cli'
const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID

export default defineCliConfig({
  api: {
    projectId: projectId || '',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    // autoUpdates: true,
  },
})
