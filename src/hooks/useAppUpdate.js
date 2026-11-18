import { useCallback, useEffect, useState } from 'react'
import {
  dismissUpdate,
  fetchRemoteVersion,
  hasNewVersion,
  isUpdateDismissed,
  markUpdateChecked,
  shouldRunAutoCheck,
  isAndroidApp,
} from '../utils/updateCheck'

export function useAppUpdate() {
  const [remote, setRemote] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const applyRemote = useCallback((data) => {
    if (!hasNewVersion(data)) {
      setRemote(null)
      return false
    }
  if (isUpdateDismissed(data.versionCode)) {
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
        const isNew = applyRemote(data)
        if (isNew && openSheetOnNew) setSheetOpen(true)
        if (!isNew && !silent) setError('已是最新版本')
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
    checkForUpdate({ silent: true, openSheetOnNew: true })
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