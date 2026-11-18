import { APP_LINKS } from '../data/appLinks'
import { APP_VERSION_CODE, APP_VERSION_NAME } from '../config/appVersion'
import { openExternalUrl } from './openExternal'

const DISMISS_KEY = 'findmatch-update-dismiss-code'
const LAST_CHECK_KEY = 'findmatch-update-last-check'

const CHECK_INTERVAL_MS = 1000 * 60 * 30

/** 安卓必须拉远端；安装包内不再保留 version.json，避免误读本地副本 */
const ANDROID_VERSION_CHECK_URL =
  'https://meandyson66.github.io/findmatch/version.json'
const ANDROID_VERSION_FALLBACK_URL =
  'https://raw.githubusercontent.com/meandyson66/findmatch/main/public/version.json'

export function isAndroidApp() {
  if (typeof window === 'undefined') return false
  if (document.documentElement.classList.contains('android-app')) return true
  try {
    return new URL(window.location.href).hostname === 'appassets.androidplatform.net'
  } catch {
    return false
  }
}

export function versionCheckUrl() {
  if (isAndroidApp()) {
    return ANDROID_VERSION_CHECK_URL
  }
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}version.json`
}

function versionCheckUrls() {
  if (isAndroidApp()) {
    const bust = `t=${Date.now()}`
    return [
      `${ANDROID_VERSION_CHECK_URL}?${bust}`,
      `${ANDROID_VERSION_FALLBACK_URL}?${bust}`,
    ]
  }
  return [`${versionCheckUrl()}?t=${Date.now()}`]
}

async function fetchVersionFromUrl(url) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (typeof data.versionCode !== 'number') throw new Error('invalid version.json')
  return data
}

export async function fetchRemoteVersion() {
  const urls = versionCheckUrls()
  let lastErr
  for (const url of urls) {
    try {
      return await fetchVersionFromUrl(url)
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr ?? new Error('version check failed')
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

/** 手动检查无新版本时的提示文案 */
export function formatAlreadyLatestMessage(remote) {
  if (!remote?.versionName) return '已是最新版本'
  const remoteLabel = `v${remote.versionName} (${remote.versionCode})`
  if (remote.versionCode > APP_VERSION_CODE) {
    return `线上有更新 ${remoteLabel}，请重试或前往 GitHub Releases`
  }
  if (remote.versionCode < APP_VERSION_CODE) {
    return `当前 ${getCurrentVersionLabel()} 较新，线上 ${remoteLabel}`
  }
  return `已是最新版本，与线上一致 ${remoteLabel}`
}