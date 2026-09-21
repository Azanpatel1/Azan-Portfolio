import path from 'node:path'
import { copyFileSync, existsSync } from 'node:fs'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Production-only HTML tweaks for static hosts (Cloudflare Pages, caching CDNs). */
function productionHtml(): Plugin {
  // Paints the page before the stylesheet arrives. The head script in index.html
  // has already set data-theme, so this must honour it — keep both colours in
  // step with --ink / --text in src/index.css.
  const bootSnippet = `<style>html{background:#050505;color:#fafafa}html[data-theme=light]{background:#fafaf9;color:#111110}</style>
<script>
(function(){
  function show(title, detail) {
    var r = document.getElementById('root');
    if (!r) return;
    r.innerHTML = '<pre style="padding:16px;font-family:JetBrains Mono,ui-monospace,monospace;font-size:12px;color:#f59e0b;background:#111;border:1px solid #525252;white-space:pre-wrap;max-width:100vw;overflow:auto">' +
      title + (detail ? '\\n\\n' + detail : '') + '</pre>';
  }
  window.addEventListener('error', function (e) {
    if (e.message && /ResizeObserver/.test(e.message)) return;
    var detail = (e.filename || '') + ':' + (e.lineno || '') + (e.colno ? ':' + e.colno : '');
    if (e.error && e.error.stack) detail += '\\n' + e.error.stack;
    show(e.message || 'Script error', detail);
  });
  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason;
    show('Unhandled rejection', reason && (reason.stack || String(reason)));
  });
})();
</script>`

  return {
    name: 'production-html',
    apply: 'build',
    transformIndexHtml(html) {
      let out = html
      out = out.replace(/<script type="module"/g, '<script data-cfasync="false" type="module"')
      out = out.replace(
        /<script data-cfasync="false" type="module" crossorigin src=/g,
        '<script data-cfasync="false" type="module" src=',
      )
      out = out.replace(
        /<link rel="stylesheet" crossorigin href=/g,
        '<link rel="stylesheet" href=',
      )
      out = out.replace(/<body([^>]*)>/, `<body$1>${bootSnippet}`)
      return out
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
  plugins: [react(), productionHtml(), spa404Clone()],
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
