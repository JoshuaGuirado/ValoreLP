// Insere o HTML pré-renderizado de cada página dentro de <div id="root"> em dist/.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const ssrDir = resolve(root, 'dist-ssr')
const { render, files } = await import(pathToFileURL(resolve(ssrDir, 'prerender.js')).href)

for (const file of files) {
  const path = resolve(root, 'dist', file)
  const html = readFileSync(path, 'utf8')
  const marker = '<div id="root"></div>'
  if (!html.includes(marker)) throw new Error(`Marcador não encontrado em ${file}`)
  writeFileSync(path, html.replace(marker, `<div id="root">${render(file)}</div>`))
  console.log(`pré-renderizado: ${file}`)
}
rmSync(ssrDir, { recursive: true, force: true })
