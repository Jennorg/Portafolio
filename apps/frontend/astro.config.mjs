import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import svgr from 'vite-plugin-svgr';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // ponytail: use server output to enable SSR and dynamic Server Islands in Astro 5
  output: 'server',
  adapter: vercel(),

  // ponytail: enable global hover prefetching to make page transitions load instantly
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss(), svgr()],
  },

  integrations: [react()],
});
