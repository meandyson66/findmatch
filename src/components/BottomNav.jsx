import { motion, useReducedMotion } from 'framer-motion'
import { Home, MessageCircle, UserRound } from 'lucide-react'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

const TABS = [
  { id: 'home', label: '首页', Icon: Home },
  { id: 'messages', label: '消息', Icon: MessageCircle },
  { id: 'me', label: '我的', Icon: UserRound },
]

const TAB_ACCENT = {
  home: { a: '#3EB575', b: '#22D3EE', glow: '62,181,117' },
  messages: { a: '#C084FC', b: '#F472B6', glow: '168,85,247' },
  me: { a: '#FBBF24', b: '#FB923C', glow: '251,191,36' },
}

const spring = { type: 'spring', stiffness: 520, damping: 34, mass: 0.85 }

export function BottomNav() {
  const { state, patch } = useApp()
  const reduceMotion = useReducedMotion()

  const unread = useMemo(() => {
    return Object.values(state.chats).filter((c) => (c.unread ?? 0) > 0).length
  }, [state.chats])

  const activeAccent = TAB_ACCENT[state.tab] ?? TAB_ACCENT.home

  return (
    <nav className="glass-nav tab-nav-aurora relative z-30 shrink-0 overflow-hidden pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5">
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-80"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse 70% 100% at 50% 100%, rgba(${activeAccent.glow},0.28), transparent 70%)`,
          }}
          animate={{
            opacity: [0.45, 0.85, 0.45],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <ul className="relative flex items-stretch justify-around px-1">
        {TABS.map(({ id, label, Icon }) => {
          const active = state.tab === id
          const accent = TAB_ACCENT[id]

          return (
            <li key={id} className="flex-1">
              <motion.button
                type="button"
                onClick={() => patch({ tab: id })}
                className="relative flex w-full flex-col items-center gap-0.5 py-1.5"
                whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                whileHover={reduceMotion ? undefined : { y: -1 }}
              >
                {active && !reduceMotion && (
                  <motion.span
                    layoutId="tab-active-pill"
                    className="absolute inset-x-2 bottom-0 top-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(${accent.glow},0.22), rgba(255,255,255,0.35))`,
                      boxShadow: `0 8px 28px rgba(${accent.glow},0.35), inset 0 1px 0 rgba(255,255,255,0.65)`,
                    }}
                    transition={spring}
                  />
                )}

                <span className="relative flex h-9 w-9 items-center justify-center">
                  {active && !reduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        background: `linear-gradient(135deg, ${accent.a}, ${accent.b})`,
                      }}
                      animate={{
                        scale: [0.85, 1.15, 0.85],
                        opacity: [0.35, 0.75, 0.35],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <motion.span
                    className="relative z-10"
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            scale: active ? 1.14 : 1,
                            y: active ? -2 : 0,
                            rotate: active && id === 'home' ? [0, -6, 6, 0] : 0,
                          }
                    }
                    transition={
                      active
                        ? id === 'home'
                          ? { rotate: { duration: 0.5 }, scale: spring, y: spring }
                          : spring
                        : spring
                    }
                  >
                    <Icon
                      className="h-[22px] w-[22px] drop-shadow-sm"
                      strokeWidth={active ? 2.35 : 1.75}
                      style={{
                        color: active ? accent.a : '#8E8E93',
                        filter: active
                          ? `drop-shadow(0 0 6px rgba(${accent.glow},0.65))`
                          : 'none',
                      }}
                    />
                  </motion.span>
                  {id === 'messages' && unread > 0 && (
                    <motion.span
                      className="absolute -right-1 -top-0.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 px-1 text-[9px] font-bold text-white shadow-md"
                      initial={{ scale: 0 }}
                      animate={
                        reduceMotion
                          ? { scale: 1 }
                          : { scale: [1, 1.15, 1], boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 12px rgba(244,63,94,0.6)', '0 0 0 rgba(0,0,0,0)'] }
                      }
                      transition={{
                        scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                        boxShadow: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                      }}
                    >
                      {unread > 9 ? '9+' : unread}
                    </motion.span>
                  )}
                </span>

                <motion.span
                  className="relative z-10 text-[11px]"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          scale: active ? 1.05 : 1,
                          opacity: active ? 1 : 0.82,
                        }
                  }
                  transition={spring}
                  style={{
                    fontWeight: active ? 600 : 400,
                    background: active
                      ? `linear-gradient(90deg, ${accent.a}, ${accent.b})`
                      : undefined,
                    WebkitBackgroundClip: active ? 'text' : undefined,
                    WebkitTextFillColor: active ? 'transparent' : undefined,
                    color: active ? undefined : '#8E8E93',
                  }}
                >
                  {label}
                </motion.span>

                {active && !reduceMotion && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute bottom-0.5 h-0.5 w-5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${accent.a}, ${accent.b})`,
                      boxShadow: `0 0 10px rgba(${accent.glow},0.9)`,
                    }}
                    transition={spring}
                  />
                )}
              </motion.button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}