import { motion } from 'framer-motion'
import { Droplets, Lock, MapPin, Star } from 'lucide-react'
import { MomoAvatar } from '../MomoAvatar'

export function MatchmakerDropletCard({ matchmaker, locked, index, onBook }) {
  const [a, b] = matchmaker.accent ?? ['#F472B6', '#FB7185']
  const delay = index * 0.08

  return (
    <motion.article
      className="matchmaker-droplet-card relative mb-4 overflow-hidden"
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
            <Droplets
              className="matchmaker-droplet-icon absolute -bottom-1 -right-1 z-[3] text-sky-400"
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

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[10px] text-momo-sub">成功案例 {matchmaker.cases ?? '—'}</span>
          <button
            type="button"
            onClick={() => onBook?.(matchmaker)}
            className={`matchmaker-droplet-cta flex items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-medium ${
              locked
                ? 'border border-white/55 bg-white/25 text-momo-sub'
                : 'text-white shadow-lg'
            }`}
            style={
              locked
                ? undefined
                : {
                    background: `linear-gradient(135deg, ${a}, ${b})`,
                    boxShadow: `0 8px 24px ${a}55`,
                  }
            }
          >
            {locked && <Lock className="h-3.5 w-3.5" />}
            {locked ? '升级后预约' : '请她牵线'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}