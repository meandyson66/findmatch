import { motion } from 'framer-motion'
import { MapPin, Zap } from 'lucide-react'
import { AvatarGlow } from '../AvatarGlow'

export function ProfileSheet({ profile, unlocked, onConnect, onOpenChat }) {
  if (!profile) return null

  return (
    <motion.div
      className="glass-card mx-4 mb-2 rounded-2xl p-4 shadow-neon"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="flex gap-3">
        <AvatarGlow nickname={profile.nickname} accent={profile.accent} size={64} blur={profile.blur} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-parchment">{profile.nickname}</h2>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-mist">
            <MapPin className="h-3.5 w-3.5 text-mint" />
            约 {profile.distanceKm} km
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.soulTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-glass-border bg-neon/10 px-2 py-0.5 text-[10px] text-parchment"
                >
                  {tag}
                </span>
              ))}
            </div>
        </div>
      </div>
      {unlocked ? (
        <button
          type="button"
          onClick={onOpenChat}
          className="mt-4 w-full rounded-xl bg-mint/90 py-2.5 text-sm font-semibold text-obsidian shadow-mint"
        >
          进入霓虹私聊
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-purple-600 py-2.5 text-sm font-semibold text-parchment shadow-neon"
        >
          <Zap className="h-4 w-4" />
          发起同频连线
        </button>
      )}
    </motion.div>
  )
}