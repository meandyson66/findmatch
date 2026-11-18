import { HeartHandshake, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MatchmakerDropletCard } from '../components/matchmaker/MatchmakerDropletCard'
import { MATCHMAKERS, MATCH_SERVICES } from '../data/matchmakers'
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

export function MatchmakerPage() {
  const { state, patch } = useApp()
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

  const requestMatch = (m) => {
    if (!canBook(m)) {
      showToast('该红娘为会员服务，请到「我的」充值升级')
      patch({ tab: 'me' })
      return
    }
    const entry = {
      id: `book-${Date.now()}`,
      matchmakerId: m.id,
      name: m.name,
      at: Date.now(),
    }
    setBookings(saveBooking(entry))
    showToast(`已提交牵线意向，${m.name} 会在演示消息中回复你`)
  }

  const buyService = (svc) => {
    if (vipLevel < svc.vipLevel) {
      showToast('会员等级不足，请到「我的」充值')
      patch({ tab: 'me' })
      return
    }
    if (svc.coin > (u.coinBalance ?? 0)) {
      showToast('寻伴币不足，请到「我的」充值会员礼包')
      patch({ tab: 'me' })
      return
    }
    showToast(`已预约「${svc.title}」（演示，未扣币）`)
  }

  return (
    <div className="relative flex h-full flex-col">
      <header className="glass-bar shrink-0 border-b px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h1 className="flex items-center gap-2 text-[17px] font-semibold text-momo-text">
          <HeartHandshake className="h-5 w-5 text-rose-500" />
          红娘牵线
        </h1>
        <p className="mt-0.5 text-[11px] text-momo-sub">
          一对一真人辅助 · 当前 {perks.tier.name}会员
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {MATCHMAKERS.map((m, i) => (
          <MatchmakerDropletCard
            key={m.id}
            matchmaker={m}
            index={i}
            locked={!canBook(m)}
            onBook={requestMatch}
          />
        ))}

        <ServicesSection buyService={buyService} />

        {bookings.length > 0 && (
          <div className="matchmaker-services-droplet mt-2 px-3 py-3">
            <p className="text-xs font-medium text-momo-sub">我的预约（本机）</p>
            <ul className="mt-2 space-y-1.5 text-[11px] text-momo-text">
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
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}
    </div>
  )
}

function ServicesSection({ buyService }) {
  return (
    <div className="matchmaker-services-droplet mt-1 px-3 py-3">
      <p className="flex items-center gap-1 text-xs font-medium text-momo-text">
        <Sparkles className="h-3.5 w-3.5 text-sky-500" />
        定制服务
      </p>
      <ServiceList buyService={buyService} />
    </div>
  )
}

function ServiceList({ buyService }) {
  return (
    <div className="mt-2 space-y-2">
      {MATCH_SERVICES.map((svc) => (
        <button
          key={svc.id}
          type="button"
          onClick={() => buyService(svc)}
          className="flex w-full items-center justify-between rounded-xl border border-white/40 bg-white/30 px-3 py-2.5 text-left backdrop-blur-md active:bg-white/45"
        >
          <div>
            <p className="text-sm font-medium text-momo-text">{svc.title}</p>
            <p className="text-[10px] text-momo-sub">{svc.desc}</p>
          </div>
          <span className="shrink-0 text-[10px] font-medium text-sky-700">
            {svc.coin ? `${svc.coin} 币` : '免费'}
          </span>
        </button>
      ))}
    </div>
  )
}