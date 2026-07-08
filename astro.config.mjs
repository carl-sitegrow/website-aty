import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';
import basicSsl from '@vitejs/plugin-basic-ssl';

import { fileURLToPath } from 'url';
import { resolve } from 'path';
import rehypeHeadingSlug from './rehype-heading-slug.js';
import rehypeExternalLinks from './rehype-external-links.js';
import externalLinksIntegration from './astro-external-links.js';

import tailwind from '@astrojs/tailwind';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  site: process.env.SITE_URL || 'https://boutiqueatypique.com',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  markdown: {
    rehypePlugins: [rehypeHeadingSlug, rehypeExternalLinks],
  },
  server: {
    port: parseInt(process.env.PORT || '4325', 10),
    host: true,
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [externalLinksIntegration(), tailwind({ applyBaseStyles: false })],
  vite: {
    plugins: process.env.DEV_HTTPS === 'true' ? [basicSsl()] : [],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@layouts': resolve(__dirname, './src/layouts'),
      },
    },
  },
});
