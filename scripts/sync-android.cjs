const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const dist = path.join(root, 'dist-android')
const assets = path.join(root, 'android', 'app', 'src', 'main', 'assets')

if (!fs.existsSync(dist)) {
  console.error('Missing dist-android/. Run: npm run build:android')
  process.exit(1)
}

const indexHtml = path.join(dist, 'index.html')
const indexBody = fs.readFileSync(indexHtml, 'utf8')
if (!indexBody.includes('./assets/') || indexBody.includes('src="/findmatch/')) {
  console.error(
    'dist-android/index.html is not an Android build (need ./assets/). Re-run: npm run build:android'
  )
  process.exit(1)
}

fs.rmSync(assets, { recursive: true, force: true })
fs.mkdirSync(assets, { recursive: true })

function copyDir(src, dest) {
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name)
    const to = path.join(dest, name)
    const stat = fs.statSync(from)
    if (stat.isDirectory()) {
      fs.mkdirSync(to, { recursive: true })
      copyDir(from, to)
    } else {
      fs.copyFileSync(from, to)
    }
  }
}

copyDir(dist, assets)
console.log(`Synced ${dist} -> ${assets}`)