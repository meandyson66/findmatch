import { motion } from 'framer-motion'
import { Crown, HeartHandshake, Home, MessageCircle, Sparkles, UserRound } from 'lucide-react'

function iconPaint(active, accent, glow) {
  return {
    color: active ? accent.a : '#8E8E93',
    filter: active
      ? `drop-shadow(0 2px 4px rgba(15,23,42,0.12)) drop-shadow(0 0 8px rgba(${glow},0.55))`
      : 'drop-shadow(0 1px 1px rgba(255,255,255,0.6))',
  }
}

const pop = { duration: 0.62, ease: [0.34, 1.48, 0.64, 1] }
const popShort = { duration: 0.48, ease: [0.33, 1.35, 0.64, 1] }

/** 首页：房子弹起 + 屋檐闪光 */
function HomeTabIconReal({ active, play, accent, glow, stroke, playKey }) {
  return (
    <motion.div
      className="relative flex h-5 w-5 items-center justify-center"
      key={play ? `home-${playKey}` : 'home'}
      initial={play ? { scale: 0.35, y: 12, rotate: -18 } : false}
      animate={
        active
          ? play
            ? { scale: [0.35, 1.38, 1.14], y: [12, -7, -2], rotate: [-18, 10, 0] }
            : { scale: 1.14, y: -2, rotate: 0 }
          : { scale: 1, y: 0, rotate: 0 }
      }
      transition={pop}
    >
      <Home className="h-5 w-5" strokeWidth={stroke} style={iconPaint(active, accent, glow)} />
      {play && (
        <motion.span
          className="pointer-events-none absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          style={{ background: accent.b, boxShadow: `0 0 8px rgba(${glow},0.8)` }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: [0, 1.8, 0], y: [-2, -10], opacity: [0.9, 0] }}
          transition={{ duration: 0.55, delay: 0.12 }}
          aria-hidden
        />
      )}
    </motion.div>
  )
}

/** 会员：皇冠落下 + 双星闪烁 */
function VipTabIcon({ active, play, accent, glow, stroke, playKey }) {
  return (
    <motion.div
      className="relative flex h-5 w-5 items-center justify-center"
      key={play ? `vip-${playKey}` : 'vip'}
      initial={play ? { scale: 0.4, y: -14, rotate: -32 } : false}
      animate={
        active
          ? play
            ? { scale: [0.4, 1.32, 1.12], y: [-14, 2, -2], rotate: [-32, 16, -6, 0] }
            : { scale: 1.12, y: -2, rotate: 0 }
          : { scale: 1, y: 0, rotate: 0 }
      }
      transition={pop}
    >
      <Crown className="h-5 w-5" strokeWidth={stroke} style={iconPaint(active, accent, glow)} />
      {play && (
        <>
          <motion.span
            className="pointer-events-none absolute -left-0.5 top-0"
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], rotate: [0, 45], opacity: [0, 1, 0] }}
            transition={{ ...popShort, delay: 0.18 }}
            aria-hidden
          >
            <Sparkles className="h-2.5 w-2.5" style={{ color: accent.b }} strokeWidth={2.5} />
          </motion.span>
          <motion.span
            className="pointer-events-none absolute -right-0.5 top-0.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
            transition={{ ...popShort, delay: 0.28 }}
            aria-hidden
          >
            <Sparkles className="h-2 w-2" style={{ color: accent.a }} strokeWidth={2.5} />
          </motion.span>
        </>
      )}
    </motion.div>
  )
}

/** 红娘：爱心握手挤压 + 心形脉动 */
function MatchmakerTabIcon({ active, play, accent, glow, stroke, playKey }) {
  return (
    <motion.div
      className="relative flex h-5 w-5 items-center justify-center"
      key={play ? `mm-${playKey}` : 'mm'}
      initial={play ? { scale: 0.7, rotate: -16, x: -6 } : false}
      animate={
        active
          ? play
            ? {
                scale: [0.7, 1.25, 0.95, 1.12],
                rotate: [-16, 12, -8, 0],
                x: [-6, 4, -2, 0],
              }
            : { scale: 1.12, rotate: 0, x: 0 }
          : { scale: 1, rotate: 0, x: 0 }
      }
      transition={{ duration: 0.68, ease: [0.36, 1.42, 0.64, 1] }}
    >
      <HeartHandshake className="h-5 w-5" strokeWidth={stroke} style={iconPaint(active, accent, glow)} />
      {play && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ border: `1px solid rgba(${glow},0.45)` }}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: [0.6, 1.65], opacity: [0.8, 0] }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          aria-hidden
        />
      )}
    </motion.div>
  )
}

/** 消息：气泡弹入 + 三点依次跳起 */
function MessagesTabIcon({ active, play, accent, glow, stroke, playKey }) {
  return (
    <motion.div
      className="relative flex h-5 w-5 items-center justify-center"
      key={play ? `msg-${playKey}` : 'msg'}
      initial={play ? { scale: 0.5, x: -12, rotate: -8 } : false}
      animate={
        active
          ? play
            ? { scale: [0.5, 1.28, 1.1], x: [-12, 5, 0], rotate: [-8, 6, 0] }
            : { scale: 1.1, x: 0, rotate: 0 }
          : { scale: 1, x: 0, rotate: 0 }
      }
      transition={popShort}
    >
      <MessageCircle className="h-5 w-5" strokeWidth={stroke} style={iconPaint(active, accent, glow)} />
      {play && active && (
        <span className="pointer-events-none absolute inset-0" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute bottom-[4px] h-[3px] w-[3px] rounded-full"
              style={{
                left: `${6 + i * 4.5}px`,
                background: accent.a,
                boxShadow: `0 0 4px rgba(${glow},0.7)`,
              }}
              initial={{ scale: 0, y: 6, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], y: [6, -3, 0], opacity: [0, 1, 1] }}
              transition={{ duration: 0.38, delay: 0.12 + i * 0.09 }}
            />
          ))}
        </span>
      )}
    </motion.div>
  )
}

/** 我的：头像 3D 翻面 + 点头 */
function MeTabIcon({ active, play, accent, glow, stroke, playKey }) {
  return (
    <motion.div
      className="relative flex h-5 w-5 items-center justify-center"
      key={play ? `me-${playKey}` : 'me'}
      style={{ transformStyle: 'preserve-3d', perspective: 400 }}
      initial={play ? { scale: 0.55, rotateY: -70, y: 6 } : false}
      animate={
        active
          ? play
            ? {
                scale: [0.55, 1.26, 1.1],
                rotateY: [-70, 35, 0],
                y: [6, -5, -2],
              }
            : { scale: 1.1, rotateY: 0, y: -2 }
          : { scale: 1, rotateY: 0, y: 0 }
      }
      transition={pop}
    >
      <UserRound className="h-5 w-5" strokeWidth={stroke} style={iconPaint(active, accent, glow)} />
      {play && (
        <motion.span
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-3 -translate-x-1/2 rounded-full bg-current opacity-40"
          style={{ color: accent.a }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1.2, 1], opacity: [0, 0.5, 0.35] }}
          transition={{ duration: 0.45, delay: 0.2 }}
          aria-hidden
        />
      )}
    </motion.div>
  )
}

export function TabDockIcon({ tabId, active, playKey, accent, glow, reduceMotion }) {
  const stroke = active ? 2.35 : 1.75
  const play = active && playKey > 0 && !reduceMotion
  const props = { active, play, accent, glow, stroke, playKey }

  switch (tabId) {
    case 'home':
      return <HomeTabIconReal {...props} />
    case 'vip':
      return <VipTabIcon {...props} />
    case 'matchmaker':
      return <MatchmakerTabIcon {...props} />
    case 'messages':
      return <MessagesTabIcon {...props} />
    case 'me':
      return <MeTabIcon {...props} />
    default:
      return null
  }
}