import { useCallback, useEffect, useState } from 'react'
import {
  dismissUpdate,
  fetchRemoteVersion,
  hasNewVersion,
  isUpdateDismissed,
  markUpdateChecked,
  shouldRunAutoCheck,
  isAndroidApp,
  formatAlreadyLatestMessage,
} from '../utils/updateCheck'

export function useAppUpdate() {
  const [remote, setRemote] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const applyRemote = useCallback((data, { ignoreDismiss = false } = {}) => {
    if (!hasNewVersion(data)) {
      setRemote(null)
      return false
    }
    if (!ignoreDismiss && isUpdateDismissed(data.versionCode)) {
      setRemote(null)
      return false
    }
    setRemote(data)
    return true
  }, [])

  const checkForUpdate = useCallback(
    async ({ silent = false, openSheetOnNew = false } = {}) => {
      setChecking(true)
      setError('')
      try {
        const data = await fetchRemoteVersion()
        markUpdateChecked()
        const ignoreDismiss = openSheetOnNew && !silent
        const isNew = applyRemote(data, { ignoreDismiss })
        if (isNew && openSheetOnNew) setSheetOpen(true)
        if (!isNew && !silent) setError(formatAlreadyLatestMessage(data))
        return data
      } catch {
        if (!silent) {
          setError(
            isAndroidApp()
              ? '检查失败，请确认网络正常后重试'
              : '检查失败，请稍后再试'
          )
        }
        return null
      } finally {
        setChecking(false)
      }
    },
    [applyRemote]
  )

  useEffect(() => {
    if (!shouldRunAutoCheck()) return
    const t = window.setTimeout(() => {
      checkForUpdate({ silent: true, openSheetOnNew: true })
    }, 0)
    return () => window.clearTimeout(t)
  }, [checkForUpdate])

  const dismiss = useCallback(() => {
    if (remote?.versionCode) dismissUpdate(remote.versionCode)
    setSheetOpen(false)
    setRemote(null)
  }, [remote])

  const showBanner = Boolean(remote) && !sheetOpen

  return {
    remote,
    sheetOpen,
    setSheetOpen,
    checking,
    error,
    checkForUpdate,
    dismiss,
    showBanner,
  }
}