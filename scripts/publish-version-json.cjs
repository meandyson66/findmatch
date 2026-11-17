const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'app-version.json'), 'utf8'))
const out = {
  versionName: manifest.versionName,
  versionCode: manifest.versionCode,
  releaseNotes: manifest.releaseNotes ?? '',
  apkUrl: manifest.apkUrl ?? manifest.releasesPage,
  releasesPage: manifest.releasesPage ?? '',
  checkedAt: Date.now(),
}

const publicDir = path.join(root, 'public')
fs.mkdirSync(publicDir, { recursive: true })
const target = path.join(publicDir, 'version.json')
fs.writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
console.log('Wrote', target)