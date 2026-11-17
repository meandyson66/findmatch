const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'app-version.json'), 'utf8'))
const gradlePath = path.join(root, 'android', 'app', 'build.gradle')
let gradle = fs.readFileSync(gradlePath, 'utf8')

gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${manifest.versionCode}`)
gradle = gradle.replace(/versionName\s+"[^"]*"/, `versionName "${manifest.versionName}"`)

fs.writeFileSync(gradlePath, gradle, 'utf8')
console.log(`Android -> ${manifest.versionName} (${manifest.versionCode})`)