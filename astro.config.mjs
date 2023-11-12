import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import prefetch from '@astrojs/prefetch'

export default defineConfig({
	site: 'https://learning-astro-908653.netlify.app/',
	integrations: [tailwind(), prefetch()]
})
