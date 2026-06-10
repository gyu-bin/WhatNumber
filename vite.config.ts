import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://whatnumber-mu.vercel.app').replace(
  /\/$/,
  '',
);

function getAdSenseClientId(): string | undefined {
  const explicit = process.env.VITE_ADSENSE_CLIENT_ID?.trim();
  if (explicit) return explicit;

  const publisher = process.env.VITE_ADSENSE_PUBLISHER_ID?.trim();
  if (!publisher) return undefined;
  if (publisher.startsWith('ca-pub-')) return publisher;
  if (publisher.startsWith('pub-')) return `ca-${publisher}`;
  return undefined;
}

const ADSENSE_CLIENT_ID = getAdSenseClientId();

function siteUrlHtmlPlugin() {
  return {
    name: 'site-url-html',
    transformIndexHtml(html: string) {
      let out = html.replaceAll('__SITE_URL__', SITE_URL);

      const adsense =
        ADSENSE_CLIENT_ID && process.env.NODE_ENV === 'production'
          ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}" crossorigin="anonymous"></script>`
          : '';

      return out.replace('<!-- __ADSENSE__ -->', adsense);
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@whatnumber/shared': path.resolve(__dirname, 'packages/shared/src/index.ts'),
    },
  },
  plugins: [
    react(),
    siteUrlHtmlPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: '몇번이야 — 몰라서 못 쓴 번호들',
        short_name: '몇번이야',
        description: '갑자기 쓸 일 생기는 공공 전화번호 모음',
        theme_color: '#111110',
        background_color: '#111110',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
