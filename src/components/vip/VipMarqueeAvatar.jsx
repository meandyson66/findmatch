import { MomoAvatar } from '../MomoAvatar'
import { VipBadge } from '../VipBadge'

/** 头像外围流光跑马灯（会员区专用） */
export function VipMarqueeAvatar({
  member,
  size = 44,
  showBadge = false,
  className = '',
  ring = true,
}) {
  const inner = size - (ring ? 6 : 0)

  return (
    <div
      className={`relative flex shrink-0 flex-col items-center ${className}`}
      style={{ width: size, minWidth: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {ring && <span className="vip-avatar-marquee-ring" aria-hidden />}
        <div
          className="relative z-[1] flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <MomoAvatar
            nickname={member.nickname}
            accent={member.accent}
            size={inner}
            online={member.online}
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