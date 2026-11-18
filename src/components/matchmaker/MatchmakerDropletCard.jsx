import { motion } from 'framer-motion'
import { Cherry, Lock, MapPin, MessageCircle, Phone, Star, Video } from 'lucide-react'
import { MomoAvatar } from '../MomoAvatar'

export function MatchmakerDropletCard({
  matchmaker,
  locked,
  index,
  onMessage,
  onVideo,
  onVoice,
}) {
  const [a, b] = matchmaker.accent ?? ['#F472B6', '#FB7185']
  const delay = index * 0.08

  return (
    <motion.article
      className="matchmaker-droplet-card matchmaker-sakura-card relative mb-4 overflow-hidden"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className="matchmaker-droplet-orb matchmaker-droplet-orb-a pointer-events-none"
        style={{ background: `radial-gradient(circle, ${a}55, transparent 70%)` }}
        aria-hidden
      />
      <span
        className="matchmaker-droplet-orb matchmaker-droplet-orb-b pointer-events-none"
        style={{ background: `radial-gradient(circle, ${b}44, transparent 68%)` }}
        aria-hidden
      />
      <span className="matchmaker-droplet-shine pointer-events-none" aria-hidden />

      <div className="relative z-[1] p-4">
        <div className="flex gap-3">
          <div className="matchmaker-droplet-avatar-shell shrink-0">
            <span
              className="matchmaker-droplet-blob"
              style={{
                background: `linear-gradient(145deg, ${a}ee, ${b}cc)`,
              }}
              aria-hidden
            />
            <div className="relative z-[2] flex h-[76px] w-[76px] items-center justify-center">
              <MomoAvatar
                nickname={matchmaker.name}
                accent={a}
                size={64}
                emoji={matchmaker.emoji}
                imageUrl={matchmaker.avatarImage}
              />
            </div>
            <Cherry
              className="matchmaker-droplet-icon absolute -bottom-1 -right-1 z-[3] text-pink-500"
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <motion.h2
              className="flex flex-wrap items-center gap-1.5 text-[15px] font-semibold text-momo-text"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.12 }}
            >
              {matchmaker.name}
              {matchmaker.vipOnly && (
                <span className="rounded-full bg-gradient-to-r from-amber-200/80 to-amber-400/50 px-2 py-0.5 text-[9px] font-medium text-amber-950">
                  会员专席
                </span>
              )}
            </motion.h2>
            <p className="mt-0.5 text-[11px] text-momo-sub">{matchmaker.title}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-momo-sub">
              <MapPin className="h-3 w-3 shrink-0" />
              {matchmaker.city}
              <span className="text-momo-sub/40">·</span>
              <Star className="h-3 w-3 shrink-0 text-amber-500" />
              满意度 {matchmaker.rate}
            </p>
          </div>
        </div>

        <motion.p
          className="matchmaker-droplet-intro mt-3 text-[13px] leading-relaxed text-momo-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {matchmaker.intro}
        </motion.p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {matchmaker.tags.map((t) => (
            <span key={t} className="matchmaker-droplet-tag text-[10px] text-momo-sub">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-[10px] text-rose-900/65">成功案例 {matchmaker.cases ?? '—'}</span>
          <div className="flex flex-wrap justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onMessage?.(matchmaker)}
              className={`matchmaker-sakura-cta flex items-center justify-center gap-1 rounded-full px-3 py-2 text-[11px] font-medium ${
                locked ? 'matchmaker-sakura-cta-muted' : 'matchmaker-sakura-cta-ghost'
              }`}
            >
              {locked && <Lock className="h-3 w-3" />}
              <MessageCircle className="h-3.5 w-3.5" />
              私信
            </button>
            <button
              type="button"
              onClick={() => onVoice?.(matchmaker)}
              disabled={locked}
              className="matchmaker-sakura-cta matchmaker-sakura-cta-ghost flex items-center justify-center gap-1 rounded-full px-3 py-2 text-[11px] font-medium disabled:opacity-45"
            >
              <Phone className="h-3.5 w-3.5" />
              语音
            </button>
            <button
              type="button"
              onClick={() => onVideo?.(matchmaker)}
              disabled={locked}
              className={`matchmaker-sakura-cta flex items-center justify-center gap-1 rounded-full px-3 py-2 text-[11px] font-medium text-white disabled:opacity-45 ${
                locked ? 'matchmaker-sakura-cta-muted' : ''
              }`}
              style={
                locked
                  ? undefined
                  : {
                      background: `linear-gradient(135deg, ${a}, ${b})`,
                      boxShadow: `0 8px 22px ${a}44`,
                    }
              }
            >
              <Video className="h-3.5 w-3.5" />
              视频
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}