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
  build:{
    sourcemap: true,
  },
  resolve: {
    alias: {
      // TODO: .env 버그 있음
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {global: 'window'},
  server: {
    port: 3000, // 원하는 포트 번호를 설정
  },
})
