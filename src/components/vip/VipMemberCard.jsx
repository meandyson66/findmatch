import { ChevronRight } from 'lucide-react'
import { VipMarqueeAvatar } from './VipMarqueeAvatar'
import { VipBadge } from '../VipBadge'
function summaryLine(m) {
  return [
    `${m.gender} ${m.age}`,
    m.city,
    m.education,
    `${m.heightCm}cm`,
    m.income,
  ].join(' · ')
}

export function VipMemberCard({ member, onPress }) {
  return (
    <button
      type="button"
      onClick={() => onPress?.(member)}
      className="flex w-full items-center gap-2 border-b border-white/35 px-1 py-2.5 text-left active:bg-white/35 last:border-0"
    >
      <VipMarqueeAvatar member={member} size={46} ring />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium text-momo-text">{member.nickname}</span>
          <VipBadge level={member.vipLevel} />
        </div>
        <p className="mt-0.5 truncate text-[11px] text-momo-sub">{summaryLine(member)}</p>
      </div>
      <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-momo">
        沟通
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  )
}