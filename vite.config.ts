/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { OutputAsset } from 'rollup'
import fs from 'node:fs'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import yaml from '@rollup/plugin-yaml'

// Link previews for /zotero: crawlers don't run JS, so write a static copy of
// index.html with the page's title, description and Open Graph tags. Cloudflare
// serves it at /academic/zotero via assets.html_handling "auto-trailing-slash".
const ZOTERO_TITLE = 'Zotero Plugin | Inciteful Academic'
const ZOTERO_DESCRIPTION =
  "Free, open-source plugin for Zotero 8, 9 and 10. Open the papers in your Zotero library and collections in Inciteful's citation network."

function zoteroPageHtml(): Plugin {
  let base = '/'
  return {
    name: 'zotero-page-html',
    apply: 'build',
    configResolved(c) {
      base = c.base
    },
    writeBundle(options, bundle) {
      const url = 'https://incitefulmed.com' + base + 'zotero'
      const card = 'https://incitefulmed.com' + base + 'og_profile.png'
      const replace = (html: string, pattern: RegExp, replacement: string) => {
        if (!pattern.test(html)) {
          throw new Error(`zotero-page-html: no match for ${pattern} in index.html`)
        }
        return html.replace(pattern, replacement)
      }
      let html = String((bundle['index.html'] as OutputAsset).source)
      html = replace(html, /<title>[\s\S]*?<\/title>/, `<title>${ZOTERO_TITLE}</title>`)
      html = replace(
        html,
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${ZOTERO_DESCRIPTION}" />`
      )
      const tags = [
        `<meta property="og:title" content="${ZOTERO_TITLE}" />`,
        `<meta property="og:description" content="${ZOTERO_DESCRIPTION}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${card}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="Inciteful" />`,
        `<meta name="twitter:title" content="${ZOTERO_TITLE}" />`,
        `<meta name="twitter:description" content="${ZOTERO_DESCRIPTION}" />`,
        `<meta name="twitter:image" content="${card}" />`,
        `<link rel="canonical" href="${url}">`
      ]
      html = replace(html, /<\/head>/, `  ${tags.join('\n  ')}\n</head>`)
      fs.writeFileSync(path.join(options.dir!, 'zotero.html'), html)
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.VITE_BASE_PATH || '/'

  // For subdirectory deployments (e.g., /academic/), output to dist/academic/
  // so Cloudflare Workers can serve from the correct path
  const outDir = basePath !== '/'
    ? `dist${basePath.endsWith('/') ? basePath.slice(0, -1) : basePath}`
    : 'dist'

  return {
    base: basePath,
    plugins: [
    vue(),
    yaml(),
    zoteroPageHtml()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8081
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.spec.ts']
  },
  build: {
    outDir,
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
    // CF_PAGES_COMMIT_SHA is set automatically by Cloudflare Pages builds
    __COMMIT_HASH__: JSON.stringify(
      process.env.COMMIT_HASH || process.env.CF_PAGES_COMMIT_SHA || 'dev'
    )
  }
  }
})
