import path from 'node:path'
import { copyFileSync, existsSync } from 'node:fs'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Cloudflare "Rocket Loader" can defer module scripts and leave React apps as a blank white screen.
 * Opt critical bundles out with data-cfasync="false" (see Cloudflare docs).
 */
function cloudflareCfAsync(): Plugin {
  return {
    name: 'cloudflare-cfasync',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(/<script type="module"/g, '<script data-cfasync="false" type="module"')
    },
  }
}

/** Same HTML as index helps hosts that serve 404.html before SPA rules run. */
function spa404Clone(): Plugin {
  return {
    name: 'spa-404-html',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(process.cwd(), 'dist')
      const indexHtml = path.join(dist, 'index.html')
      const notFoundHtml = path.join(dist, '404.html')
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflareCfAsync(), spa404Clone()],
})
