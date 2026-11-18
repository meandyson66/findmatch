import { Cherry, HeartHandshake } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MatchmakerDropletCard } from '../components/matchmaker/MatchmakerDropletCard'
import { MATCHMAKERS } from '../data/matchmakers'
import { getVipPerks, resolveVipLevel } from '../data/vip'
import { useApp } from '../context/AppContext'

const BOOK_KEY = 'findmatch-matchmaker-bookings'

function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOK_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveBooking(entry) {
  const list = [entry, ...loadBookings()].slice(0, 10)
  localStorage.setItem(BOOK_KEY, JSON.stringify(list))
  return list
}

export function MatchmakerPage({ onOpenChat }) {
  const { state, patch, ensureMatchmakerChat } = useApp()
  const u = state.user
  const vipLevel = resolveVipLevel(u.vipTotalRecharge ?? 0)
  const perks = getVipPerks(u.vipTotalRecharge ?? 0)
  const [bookings, setBookings] = useState(() => loadBookings())
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const canBook = useMemo(
    () => (m) => !m.vipOnly || vipLevel >= (m.minVipLevel ?? 1),
    [vipLevel]
  )

  const openMatchmaker = (m, boot) => {
    if (!canBook(m)) {
      showToast('该红娘为会员服务，请到「我的」充值升级')
      patch({ tab: 'me' })
      return
    }
    const chatId = ensureMatchmakerChat(m.id)
    if (!chatId) return
    const entry = {
      id: `book-${Date.now()}`,
      matchmakerId: m.id,
      name: m.name,
      at: Date.now(),
    }
    setBookings(saveBooking(entry))
    patch({ tab: 'messages' })
    setTimeout(() => onOpenChat?.(chatId, boot), 80)
  }

  return (
    <div className="matchmaker-sakura-page relative flex h-full flex-col">
      <header className="matchmaker-sakura-header glass-bar shrink-0 border-b px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h1 className="flex items-center gap-2 text-[17px] font-semibold text-rose-950">
          <HeartHandshake className="h-5 w-5 text-rose-500" />
          樱花红娘
        </h1>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-rose-900/70">
          <Cherry className="h-3 w-3 text-pink-500" />
          先私信聊聊 · 再进演示视频 · {perks.tier.name}会员
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {MATCHMAKERS.map((m, i) => (
          <MatchmakerDropletCard
            key={m.id}
            matchmaker={m}
            index={i}
            locked={!canBook(m)}
            onMessage={() => openMatchmaker(m)}
            onVideo={() => openMatchmaker(m, { openVideo: true, videoMode: 'video' })}
            onVoice={() => openMatchmaker(m, { openVideo: true, videoMode: 'voice' })}
          />
        ))}

        {bookings.length > 0 && (
          <div className="matchmaker-services-droplet matchmaker-sakura-note mt-2 px-3 py-3">
            <p className="text-xs font-medium text-rose-900/75">樱花预约（本机）</p>
            <ul className="mt-2 space-y-1.5 text-[11px] text-rose-950/85">
              {bookings.slice(0, 3).map((b) => (
                <li key={b.id}>
                  {b.name} · {new Date(b.at).toLocaleString('zh-CN')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-rose-950/80 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}
    </div>
  )
}