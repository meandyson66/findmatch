import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = path.dirname(fileURLToPath(import.meta.url))
const entry = path.resolve(root, 'index.html')
const appVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'app-version.json'), 'utf8')
)

export default defineConfig(({ mode }) => {
  let base = process.env.VITE_BASE
  if (!base) {
    if (mode === 'pages') base = '/findmatch/'
    else if (mode === 'android') base = './'
    else base = mode === 'production' ? './' : '/'
  }

  const outDir =
    mode === 'android' ? 'dist-android' : mode === 'pages' ? 'dist' : 'dist'

  return {
    root,
    base,
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: entry,
      },
    },
    define: {
      __APP_VERSION_NAME__: JSON.stringify(appVersion.versionName),
      __APP_VERSION_CODE__: appVersion.versionCode,
    },
    plugins: [react()],
    optimizeDeps: {
      entries: [entry],
    },
    server: {
      port: 5173,
      open: true,
      watch: {
        ignored: [
          '**/android/**',
          '**/parkour-3d/**',
          '**/physics-2048/**',
          '**/recommend/**',
          '**/*.apk',
        ],
      },
    },
  }
})