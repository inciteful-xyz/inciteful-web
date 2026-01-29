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
    sourcemap: true,
    rollupOptions: {
      output: {
        // Optimize chunk splitting for better caching
        manualChunks: (id) => {
          // Core Vue framework
          if (id.includes('node_modules/vue/') || id.includes('node_modules/vue-router/')) {
            return 'vendor-vue'
          }
          // Graph visualization libraries
          if (id.includes('node_modules/cytoscape')) {
            return 'vendor-graph'
          }
          // Sentry and replay (large, load separately)
          if (id.includes('node_modules/@sentry') || id.includes('rrweb')) {
            return 'vendor-sentry'
          }
          // Tour library (only needed for onboarding)
          if (id.includes('node_modules/v3-tour')) {
            return 'vendor-tour'
          }
          // HeadlessUI components
          if (id.includes('node_modules/@headlessui')) {
            return 'vendor-ui'
          }
        }
      }
    },
    // Optimize CSS
    cssCodeSplit: true
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'dev')
  }
})
