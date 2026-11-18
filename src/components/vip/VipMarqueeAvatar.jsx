import { MomoAvatar } from '../MomoAvatar'
import { VipBadge } from '../VipBadge'

/** 头像外围流光跑马灯（会员区专用） */
const VIP_PLAIN_ACCENT = '#94A3B8'

export function VipMarqueeAvatar({
  member,
  size = 44,
  showBadge = false,
  className = '',
  ring = true,
  featured: featuredProp,
}) {
  const featured =
    featuredProp !== undefined ? featuredProp : Boolean(member?.fixed)
  const inner = size - (ring ? 6 : 0)
  const accent = featured ? member.accent : VIP_PLAIN_ACCENT

  return (
    <div
      className={`relative flex shrink-0 flex-col items-center ${className}`}
      style={{ width: size, minWidth: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {ring && featured && <span className="vip-avatar-marquee-ring" aria-hidden />}
        {ring && !featured && <span className="vip-avatar-plain-ring" aria-hidden />}
        <div
          className="relative z-[1] flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <MomoAvatar
            nickname={member.nickname}
            accent={accent}
            size={inner}
            online={member.online}
            imageUrl={member.avatarImage}
          />
        </div>
      </div>
      {showBadge && member.vipLevel > 0 && (
        <div className="mt-1 scale-[0.85]">
          <VipBadge level={member.vipLevel} />
        </div>
      )}
    </div>
  )
}