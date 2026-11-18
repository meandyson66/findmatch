import { Download, Sparkles, X } from 'lucide-react'
import { SheetModal } from './SheetModal'
import { APP_LINKS } from '../../data/appLinks'
import {
  getCurrentVersionLabel,
  isAndroidApp,
  openGithubRepo,
  openUpdateTarget,
} from '../../utils/updateCheck'

export function AppUpdateSheet({ open, remote, onClose, onDismiss }) {
  if (!remote) return null

  return (
    <SheetModal open={open} title="发现新版本" onClose={onClose}>
      <div className="px-4 pb-6">
        <div className="glass-panel rounded-xl px-4 py-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-momo-text">
            <Sparkles className="h-4 w-4 text-momo" />
            {remote.versionName}
          </p>
          <p className="mt-1 text-[11px] text-momo-sub">
            当前 {getCurrentVersionLabel()} → 最新 {remote.versionCode}
          </p>
          {remote.releaseNotes && (
            <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-momo-text">
              {remote.releaseNotes}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => openUpdateTarget(remote)}
          className="glass-primary-btn mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          {isAndroidApp() ? '下载安装包' : '查看更新说明'}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full rounded-xl border border-white/50 py-2.5 text-sm text-momo-sub"
        >
          稍后再说
        </button>
        <button
          type="button"
          onClick={() => openGithubRepo()}
          className="mt-2 w-full py-2 text-center text-[11px] text-momo underline-offset-2"
        >
          在 GitHub 搜索「{APP_LINKS.searchHint}」打开仓库
        </button>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-momo-sub">
          {isAndroidApp()
            ? '将跳转浏览器下载 APK；也可自行在 GitHub 搜索 findmatch → Releases。'
            : '网页版打开上述仓库或 Pages 预览；安卓请下载 APK。'}
        </p>
      </div>
    </SheetModal>
  )
}

/** 顶部细条提示（非阻断） */
export function AppUpdateBanner({ remote, onOpen, onDismiss }) {
  if (!remote) return null
  return (
    <div className="glass-bar flex items-center gap-2 border-b border-momo/25 bg-momo/12 px-3 py-2 text-xs">
      <span className="min-w-0 flex-1 text-momo-text">新版本 {remote.versionName} 可用</span>
      <button type="button" onClick={onOpen} className="shrink-0 font-medium text-momo">
        更新
      </button>
      <button type="button" onClick={onDismiss} className="shrink-0 text-momo-sub" aria-label="关闭">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}