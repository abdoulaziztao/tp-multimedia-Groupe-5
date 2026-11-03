// Copie le worker de MapLibre dans public/ : Next ne sait pas résoudre son URL tout seul.
import { copyFileSync, mkdirSync } from 'node:fs'
mkdirSync('public/vendor', { recursive: true })
copyFileSync('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', 'public/vendor/maplibre-gl-worker.mjs')
