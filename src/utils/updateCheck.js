import { APP_LINKS } from '../data/appLinks'
import { APP_VERSION_CODE, APP_VERSION_NAME } from '../config/appVersion'
import { openExternalUrl } from './openExternal'

const DISMISS_KEY = 'findmatch-update-dismiss-code'
const LAST_CHECK_KEY = 'findmatch-update-last-check'

const CHECK_INTERVAL_MS = 1000 * 60 * 30

/** 安卓 APK 内 version.json 与安装包同源，无法判断是否有新版本，必须拉线上 */
const ANDROID_VERSION_CHECK_URL =
  'https://meandyson66.github.io/findmatch/version.json'

export function isAndroidApp() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('android-app')
}

export function versionCheckUrl() {
  if (isAndroidApp()) {
    return ANDROID_VERSION_CHECK_URL
  }
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}version.json`
}

export async function fetchRemoteVersion() {
  const url = `${versionCheckUrl()}?t=${Date.now()}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (typeof data.versionCode !== 'number') throw new Error('invalid version.json')
  return data
}

export function hasNewVersion(remote) {
  if (!remote || typeof remote.versionCode !== 'number') return false
  return remote.versionCode > APP_VERSION_CODE
}

export function isUpdateDismissed(remoteVersionCode) {
  try {
    const dismissed = Number.parseInt(localStorage.getItem(DISMISS_KEY) ?? '', 10)
    return Number.isFinite(dismissed) && dismissed >= remoteVersionCode
  } catch {
    return false
  }
}

export function dismissUpdate(remoteVersionCode) {
  try {
    localStorage.setItem(DISMISS_KEY, String(remoteVersionCode))
  } catch {
    /* quota */
  }
}

export function shouldRunAutoCheck() {
  try {
    const last = Number.parseInt(localStorage.getItem(LAST_CHECK_KEY) ?? '', 10)
    if (!Number.isFinite(last)) return true
    return Date.now() - last > CHECK_INTERVAL_MS
  } catch {
    return true
  }
}

export function markUpdateChecked() {
  try {
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))
  } catch {
    /* quota */
  }
}

export function openUpdateTarget(remote) {
  const url =
    (isAndroidApp() && remote?.apkUrl) ||
    remote?.releasesPage ||
    remote?.apkUrl ||
    APP_LINKS.releasesLatest
  openExternalUrl(url)
}

export function openGithubReleases() {
  openExternalUrl(APP_LINKS.releasesLatest)
}

export function openGithubRepo() {
  openExternalUrl(APP_LINKS.repo)
}

export function getCurrentVersionLabel() {
  return `v${APP_VERSION_NAME} (${APP_VERSION_CODE})`
}