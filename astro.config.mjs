import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: "https://learning-astro-908653.netlify.app/",
  integrations: [tailwind(), prefetch()],
});
