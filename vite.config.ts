import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import yaml from '@rollup/plugin-yaml'

export default defineConfig({
  plugins: [
    vue(),
    yaml()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8081
  },
  build: {
    sourcemap: true
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'dev')
  }
})
