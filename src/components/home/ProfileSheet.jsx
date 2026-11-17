import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, UserPlus, X } from 'lucide-react'
import { ProfileInfoGrid } from '../ProfileInfoGrid'
import { MomoAvatar } from '../MomoAvatar'

export function ProfileSheet({ user, open, onClose, onGreet, isFollowing, onToggleFollow, greeted }) {
  return (
    <AnimatePresence>
      {open && user && (
    <motion.div
      className="glass-scrim absolute inset-0 z-50 flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-sheet w-full max-h-[78%] p-4 pb-8"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <MomoAvatar nickname={user.nickname} accent={user.accent} size={72} online={user.online} />
            <div>
              <h2 className="text-lg font-semibold text-momo-text">
                {user.nickname} · {user.age}
              </h2>
              <p className="text-sm text-momo-sub">{user.gender}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-momo-sub">
                <MapPin className="h-3.5 w-3.5" />
                {user.distanceKm} km {user.online ? '· 在线' : '· 离线'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-momo-sub">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-momo-text">{user.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(user.soulTags ?? []).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/50 bg-white/40 px-2.5 py-0.5 text-xs text-momo-text backdrop-blur-md"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 max-h-40 overflow-y-auto">
          <ProfileInfoGrid user={user} />
        </div>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onToggleFollow}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/50 bg-white/40 py-2.5 text-sm text-momo-text backdrop-blur-md"
          >
            <UserPlus className="h-4 w-4" />
            {isFollowing ? '已关注' : '关注'}
          </button>
          <button
            type="button"
            onClick={onGreet}
            className="glass-primary-btn flex-1 rounded-xl py-2.5 text-sm font-medium"
          >
            {greeted ? '发消息' : '打招呼'}
          </button>
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  )
}