import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Split framework code out of the app chunk: better caching and the
          // browser can interleave vendor parsing with app rendering.
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](vue|@vue|vue-router|vue-i18n|@intlify)[\\/]/.test(id)) {
              return 'vendor-vue'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
