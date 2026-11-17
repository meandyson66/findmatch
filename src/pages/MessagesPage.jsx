import { Bell, ChevronRight, MoreHorizontal, Pin, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MomoAvatar } from '../components/MomoAvatar'
import { SheetModal } from '../components/me/SheetModal'
import { NEARBY_USERS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { formatRelative } from '../utils/formatTime'

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  if (sameDay) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function lastPreview(messages) {
  if (!messages?.length) return '暂无消息'
  const last = [...messages].reverse().find((m) => m.from !== 'system') ?? messages[messages.length - 1]
  return last.text
}

function matchChat(row, q) {
  if (!q) return true
  const hay = `${row.chat.title}${lastPreview(row.chat.messages)}`.toLowerCase()
  return hay.includes(q)
}

export function MessagesPage({ onOpenChat }) {
  const {
    state,
    deleteChat,
    togglePinChat,
    markAllChatsRead,
    markSystemNoticesRead,
  } = useApp()

  const [search, setSearch] = useState('')
  const [menuChatId, setMenuChatId] = useState(null)
  const [noticesOpen, setNoticesOpen] = useState(false)
  const [toast, setToast] = useState('')

  const systemUnread = (state.systemNotices ?? []).filter((n) => !n.read).length

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return Object.entries(state.chats)
      .map(([id, chat]) => {
        const user = NEARBY_USERS.find((u) => u.id === chat.partnerId)
        const pinned = state.chatMeta?.[id]?.pinned
        return {
          id,
          chat,
          user,
          pinned,
          time: chat.updatedAt ?? chat.messages?.at(-1)?.at,
        }
      })
      .filter((row) => matchChat(row, q))
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return (b.time ?? 0) - (a.time ?? 0)
      })
  }, [state.chats, state.chatMeta, search])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const openNotices = () => {
    setNoticesOpen(true)
    markSystemNoticesRead()
  }

  return (
    <div className="relative flex h-full flex-col">
      <header className="glass-bar shrink-0 border-b px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <h1 className="text-[17px] font-semibold tracking-tight text-momo-text">消息</h1>
          <button
            type="button"
            onClick={() => {
              markAllChatsRead()
              showToast('已全部标为已读')
            }}
            className="text-xs text-momo"
          >
            全部已读
          </button>
        </div>
        <div className="glass-input mt-2 flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-momo-sub" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索会话"
            className="w-full bg-transparent text-sm text-momo-text outline-none placeholder:text-momo-sub"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-momo-sub">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <button
        type="button"
        onClick={openNotices}
        className="glass-row flex shrink-0 items-center gap-3 px-3 py-3 text-left"
      >
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/50 bg-white/55 shadow-glass-sm backdrop-blur-xl">
          <Bell className="h-5 w-5 text-amber-500" />
          {systemUnread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">
              {systemUnread}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-momo-text">系统通知</p>
          <p className="truncate text-xs text-momo-sub">
            {(state.systemNotices ?? [])[0]?.title ?? '暂无通知'}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-momo-sub" />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <p className="glass-panel mx-4 mt-6 px-6 py-16 text-center text-sm text-momo-sub">
            {search ? '没有匹配的会话' : '还没有聊天'}
            {!search && (
              <>
                <br />
                去首页向附近的人打个招呼吧
              </>
            )}
          </p>
        ) : (
          rows.map(({ id, chat, user, time, pinned }) => (
            <div key={id} className="glass-row flex items-center gap-2 pr-2">
              <button
                type="button"
                onClick={() => onOpenChat?.(id)}
                className="glass-row-active flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
              >
                <MomoAvatar
                  nickname={user?.nickname ?? chat.title}
                  accent={user?.accent ?? '#3EB575'}
                  size={50}
                  online={user?.online}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1">
                    {pinned && <Pin className="h-3 w-3 shrink-0 text-momo" />}
                    <span className="truncate text-[15px] font-medium text-momo-text">
                      {chat.title}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] text-momo-sub">
                      {formatTime(time)}
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-momo-sub">
                      {lastPreview(chat.messages)}
                    </span>
                    {(chat.unread ?? 0) > 0 && (
                      <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                        {chat.unread}
                      </span>
                    )}
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMenuChatId(menuChatId === id ? null : id)}
                className="shrink-0 rounded-full p-2 text-momo-sub active:bg-white/40"
                aria-label="更多操作"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <SheetModal
        open={Boolean(menuChatId)}
        title="会话操作"
        onClose={() => setMenuChatId(null)}
      >
        {menuChatId && (
          <div className="px-4 py-2">
            <button
              type="button"
              onClick={() => {
                const wasPinned = state.chatMeta?.[menuChatId]?.pinned
                togglePinChat(menuChatId)
                setMenuChatId(null)
                showToast(wasPinned ? '已取消置顶' : '已置顶')
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-momo-text active:bg-white/40"
            >
              <Pin className="h-4 w-4 text-momo" />
              {state.chatMeta?.[menuChatId]?.pinned ? '取消置顶' : '置顶聊天'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('确定删除该会话？本地聊天记录将被清除')) {
                  deleteChat(menuChatId)
                  setMenuChatId(null)
                  showToast('会话已删除')
                }
              }}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-500 active:bg-white/40"
            >
              <Trash2 className="h-4 w-4" />
              删除会话
            </button>
          </div>
        )}
      </SheetModal>

      <SheetModal open={noticesOpen} title="系统通知" onClose={() => setNoticesOpen(false)} tall>
        <ul className="divide-y divide-white/40 px-2 pb-4">
          {(state.systemNotices ?? []).map((n) => (
            <li key={n.id} className="glass-panel-sm mx-2 my-2 px-3 py-3">
              <p className="text-sm font-medium text-momo-text">{n.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-momo-sub">{n.body}</p>
              <p className="mt-2 text-[10px] text-momo-sub">{formatRelative(n.at)}</p>
            </li>
          ))}
        </ul>
      </SheetModal>

      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}
    </div>
  )
}