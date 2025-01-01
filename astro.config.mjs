import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import favicons from 'astro-favicons'

export default defineConfig({
	site: 'https://learning-astro-908653.netlify.app/',
	prefetch: {
		prefetchAll: true
	},
	compressHTML: import.meta.env.PROD,

	integrations: [
		tailwind(),

		favicons({
			masterPicture: './src/assets/favicon.svg',
			emitAssets: true,

			// You should adjust the following options accordingly
			appName: 'CiobanuT',
			appShortName: 'CiobanuT',
			appDescription: "Ciobanu Tudor's portfolio",
			// dir:"auto",
			lang: 'en-US',
			// display: "standalone",
			// orientation: "any",
			start_url: '/',
			background: '#fff',
			theme_color: '#fff',

			faviconsDarkMode: false // default `true`, Make favicon compatible with light and dark modes

			// appleStatusBarStyle: "black-translucent",

			//....
		})
	]
})
