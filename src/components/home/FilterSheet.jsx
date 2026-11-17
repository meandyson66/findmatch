import { Lock } from 'lucide-react'
import { allFilterKmOptions } from '../../data/vip'
import { SheetModal } from '../me/SheetModal'

const GENDERS = [
  { id: 'all', label: '不限' },
  { id: '男', label: '男生' },
  { id: '女', label: '女生' },
]

export function FilterSheet({
  open,
  onClose,
  filters,
  onApply,
  onReset,
  maxFilterKm = 5,
  onNeedVip,
}) {
  const kmOpts = allFilterKmOptions()
  return (
    <SheetModal open={open} title="筛选附近的人" onClose={onClose}>
      <div className="px-4 py-3">
        <p className="text-xs text-momo-sub">性别</p>
        <div className="mt-2 flex gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onApply({ gender: g.id })}
              className={`flex-1 rounded-lg py-2 text-sm ${
                filters.gender === g.id
                  ? 'glass-primary-btn'
                  : 'border border-white/50 bg-white/35 text-momo-text backdrop-blur-md'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-momo-sub">最大距离</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {kmOpts.map((km) => {
            const locked = km > maxFilterKm
            return (
              <button
                key={km}
                type="button"
                onClick={() => {
                  if (locked) onNeedVip?.(km)
                  else onApply({ maxKm: km })
                }}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                  filters.maxKm === km
                    ? 'glass-primary-btn'
                    : locked
                      ? 'border border-dashed border-white/40 bg-white/20 text-momo-sub/80'
                      : 'border border-white/50 bg-white/35 text-momo-sub backdrop-blur-md'
                }`}
              >
                {locked && <Lock className="h-3 w-3" />}
                {km} km 内
              </button>
            )
          })}
        </div>
        <label className="mt-4 flex items-center justify-between">
          <span className="text-sm text-momo-text">仅看在线</span>
          <button
            type="button"
            onClick={() => onApply({ onlineOnly: !filters.onlineOnly })}
            className={`h-7 w-12 rounded-full p-0.5 transition ${
              filters.onlineOnly ? 'bg-momo' : 'bg-white/50'
            }`}
          >
            <span
              className={`block h-6 w-6 rounded-full bg-white shadow transition ${
                filters.onlineOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 w-full rounded-lg border border-white/50 py-2 text-sm text-momo-sub"
        >
          重置筛选
        </button>
      </div>
    </SheetModal>
  )
}