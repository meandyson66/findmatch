import { getVipTier } from '../data/vip'

export function VipBadge({ level, className = '' }) {
  if (!level) return null
  const tier = getVipTier(level)
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm ${className}`}
      style={{
        background:
          level >= 4
            ? `linear-gradient(135deg, #5a3d8a, ${tier.color})`
            : `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
      }}
    >
      {tier.name}
    </span>
  )
}