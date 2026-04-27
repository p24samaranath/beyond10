// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://beyond10.in',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    maxDuration: 30,
  }),
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  integrations: [sitemap()],
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
