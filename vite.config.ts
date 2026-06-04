import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://whatnumber-mu.vercel.app').replace(
  /\/$/,
  '',
);

function siteUrlHtmlPlugin() {
  return {
    name: 'site-url-html',
    transformIndexHtml(html: string) {
      return html.replaceAll('__SITE_URL__', SITE_URL);
    },
  };
}

export default defineConfig({
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
