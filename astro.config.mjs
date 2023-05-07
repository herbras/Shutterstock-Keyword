import { defineConfig } from 'astro/config';
import alpinejs from "@astrojs/alpinejs";
import svelte from "@astrojs/svelte";

import cloudflare from "@astrojs/cloudflare";


import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [alpinejs(), svelte()]
});