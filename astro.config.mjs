import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import alpinejs from "@astrojs/alpinejs";
import svelte from "@astrojs/svelte";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [alpinejs(), svelte()]
});