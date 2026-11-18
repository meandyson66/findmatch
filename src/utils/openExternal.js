import { isAndroidApp } from './updateCheck'

export function openExternalUrl(url) {
  if (!url) return
  if (isAndroidApp()) {
    window.location.href = url
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}