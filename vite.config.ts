import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/quizzo/',

  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: { enabled: true },
      workbox: { globPatterns: ['**/*'] },
      includeAssets: ['**/*'],
      manifest: {
        id: '/quizzo/',
        name: 'Quizzo',
        short_name: 'Quizzo',
        description: 'The ultimate quiz app for entertainment!',
        theme_color: '#e5383b',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
