import { Crown, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  RECHARGE_PACKAGES,
  VIP_TIERS,
  getNextTier,
  getVipPerks,
  vipProgress,
} from '../../data/vip'
import { VipBadge } from '../VipBadge'
import { SheetModal } from './SheetModal'

export function VipCenterSheet({
  open,
  onClose,
  totalRecharge,
  coinBalance,
  rechargeHistory,
  onPurchase,
}) {
  const perks = useMemo(() => getVipPerks(totalRecharge), [totalRecharge])
  const next = getNextTier(perks.level)
  const progress = vipProgress(totalRecharge)
  const [picked, setPicked] = useState(RECHARGE_PACKAGES[1]?.id)
  const [msg, setMsg] = useState('')

  const handlePay = () => {
    const result = onPurchase?.(picked)
    if (result?.ok) {
      setMsg(result.message ?? '充值成功')
      setTimeout(() => setMsg(''), 2200)
    } else setMsg(result?.message ?? '充值失败')
  }

  return (
    <SheetModal open={open} title="会员中心" onClose={onClose} tall>
      <div className="pb-4">
        <div className="mx-4 overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br from-amber-500/35 via-white/30 to-violet-500/25 p-4 shadow-glass-sm backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="flex items-center gap-1.5 text-xs text-momo-sub">
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                当前等级
              </p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-momo-text">
                {perks.tier.name}会员
                <VipBadge level={perks.level} />
              </p>
              <p className="mt-1 text-[11px] text-momo-sub">
                累计充值 ¥{totalRecharge} · 寻伴币 {coinBalance ?? 0}
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-amber-500/80" strokeWidth={1.5} />
          </div>
          {next ? (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-momo-sub">
                <span>距 {next.name}</span>
                <span>
                  ¥{totalRecharge}/{next.minRecharge}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-momo transition-all"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-3 text-[11px] text-momo-sub">已达最高等级，尊享全部特权</p>
          )}
        </div>

        <p className="mx-4 mt-4 text-xs font-medium text-momo-sub">当前待遇</p>
        <ul className="mx-4 mt-2 space-y-1.5">
          {perks.tier.perks.map((line) => (
            <li key={line} className="flex items-start gap-2 text-xs text-momo-text">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-momo" />
              {line}
            </li>
          ))}
        </ul>

        <p className="mx-4 mt-5 text-xs font-medium text-momo-sub">选择充值金额</p>
        <p className="mx-4 mt-0.5 text-[10px] text-momo-sub">
          演示版模拟支付，金额累计计入会员等级（无真实扣款）
        </p>
        <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
          {RECHARGE_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setPicked(pkg.id)}
              className={`relative rounded-xl border px-3 py-3 text-left transition ${
                picked === pkg.id
                  ? 'border-momo/60 bg-momo/15 shadow-glass-sm'
                  : 'border-white/50 bg-white/30'
              }`}
            >
              {pkg.tag && (
                <span className="absolute right-2 top-2 rounded bg-momo/90 px-1 py-0.5 text-[9px] text-white">
                  {pkg.tag}
                </span>
              )}
              <p className="text-sm font-semibold text-momo-text">{pkg.label}</p>
              <p className="text-[11px] text-momo-sub">{pkg.subtitle}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handlePay}
          className="glass-primary-btn mx-4 mt-4 w-[calc(100%-2rem)] rounded-xl py-3 text-sm font-medium"
        >
          确认充值（演示）
        </button>

        <details className="mx-4 mt-4">
          <summary className="cursor-pointer text-xs text-momo-sub">等级说明</summary>
          <div className="mt-2 space-y-2">
            {VIP_TIERS.filter((t) => t.level > 0).map((t) => (
              <div key={t.level} className="glass-panel-sm rounded-lg px-3 py-2">
                <p className="flex items-center gap-2 text-xs font-medium text-momo-text">
                  <VipBadge level={t.level} />
                  累计满 ¥{t.minRecharge}
                </p>
                <ul className="mt-1 space-y-0.5 pl-1 text-[10px] text-momo-sub">
                  {t.perks.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        {(rechargeHistory ?? []).length > 0 && (
          <>
            <p className="mx-4 mt-4 text-xs font-medium text-momo-sub">最近充值</p>
            <ul className="mx-4 mt-2 divide-y divide-white/40 rounded-lg border border-white/40">
              {rechargeHistory.slice(0, 5).map((row) => (
                <li key={row.id} className="flex justify-between px-3 py-2 text-[11px]">
                  <span className="text-momo-text">¥{row.price}</span>
                  <span className="text-momo-sub">+{row.coins} 币</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {msg && (
          <p className="mx-4 mt-3 text-center text-xs text-momo">{msg}</p>
        )}
      </div>
    </SheetModal>
  )
}