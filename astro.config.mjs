import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
	site: 'https://learning-astro-908653.netlify.app/',
	prefetch: {
		prefetchAll: true
	},
	integrations: [tailwind()]
})
