const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const out = path.join(root, 'gh-pages-bundle')
const dist = path.join(root, 'dist')

if (!fs.existsSync(dist)) {
  console.error('Missing dist/. Run: npm run build:pages')
  process.exit(1)
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name)
    const to = path.join(dest, name)
    if (fs.statSync(from).isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

fs.rmSync(out, { recursive: true, force: true })
copyDir(dist, out)
fs.copyFileSync(path.join(dist, 'index.html'), path.join(out, '404.html'))
console.log('Prepared gh-pages-bundle at', out)