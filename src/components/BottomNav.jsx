import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { TabDockIcon } from './nav/TabDockIcon'

const TABS = [
  { id: 'home', label: '首页' },
  { id: 'vip', label: '会员' },
  { id: 'matchmaker', label: '红娘' },
  { id: 'messages', label: '消息' },
  { id: 'me', label: '我的' },
]

const TAB_ACCENT = {
  home: { a: '#3EB575', b: '#22D3EE', glow: '62,181,117' },
  vip: { a: '#E8B84A', b: '#F59E0B', glow: '232,184,74' },
  matchmaker: { a: '#F472B6', b: '#FB7185', glow: '244,114,182' },
  messages: { a: '#C084FC', b: '#F472B6', glow: '168,85,247' },
  me: { a: '#FBBF24', b: '#FB923C', glow: '251,191,36' },
}

const spring = { type: 'spring', stiffness: 520, damping: 34, mass: 0.85 }

export function BottomNav() {
  const { state, patch } = useApp()
  const reduceMotion = useReducedMotion()
  const [tabSwitchSeq, setTabSwitchSeq] = useState(0)

  useEffect(() => {
    setTabSwitchSeq((n) => n + 1)
  }, [state.tab])

  const unread = useMemo(() => {
    return Object.values(state.chats).filter((c) => (c.unread ?? 0) > 0).length
  }, [state.chats])

  const activeAccent = TAB_ACCENT[state.tab] ?? TAB_ACCENT.home

  return (
    <div className="tab-liquid-dock-wrap">
      <nav
        className="tab-liquid-dock tab-nav-aurora"
        aria-label="主导航"
        style={{ perspective: reduceMotion ? undefined : 900 }}
      >
        {!reduceMotion && (
          <>
            <span
              className="tab-dock-orb tab-dock-orb-a"
              aria-hidden
              style={{
                background: `radial-gradient(circle, rgba(${activeAccent.glow},0.38), transparent 70%)`,
              }}
            />
            <span
              className="tab-dock-orb tab-dock-orb-b"
              aria-hidden
              style={{
                background: 'radial-gradient(circle, rgba(192,132,252,0.28), transparent 70%)',
              }}
            />
            <span className="tab-dock-shine" aria-hidden />
          </>
        )}

        <ul className="relative z-[3] flex items-stretch justify-between px-1 py-1.5">
          {TABS.map(({ id, label }) => {
            const active = state.tab === id
            const accent = TAB_ACCENT[id]

            return (
              <li key={id} className="min-w-0 flex-1">
                <motion.button
                  type="button"
                  onClick={() => patch({ tab: id })}
                  className="relative flex w-full flex-col items-center gap-0.5 py-1"
                  whileTap={reduceMotion ? undefined : { scale: 0.9, y: 1 }}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-active-pill"
                      className="tab-dock-pill absolute inset-x-0.5 bottom-0 top-0"
                      style={{
                        boxShadow: `0 12px 28px rgba(${accent.glow},0.22), inset 0 2px 0 rgba(255,255,255,0.92), inset 0 -8px 16px rgba(255,255,255,0.4)`,
                      }}
                      transition={spring}
                    />
                  )}

                  <span className="tab-dock-icon-stage relative flex h-9 w-9 items-center justify-center">
                    {active && !reduceMotion && (
                      <>
                        <motion.span
                          key={`burst-${id}-${tabSwitchSeq}`}
                          className="absolute inset-0 rounded-full border border-white/60"
                          style={{
                            background: `radial-gradient(circle, rgba(${accent.glow},0.35), transparent 72%)`,
                          }}
                          initial={{ scale: 0.4, opacity: 0.9 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          aria-hidden
                        />
                        <motion.span
                          className="absolute inset-0 rounded-full blur-md"
                          style={{
                            background: `linear-gradient(135deg, ${accent.a}, ${accent.b})`,
                          }}
                          animate={{
                            scale: [0.88, 1.18, 0.88],
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}
                    <span className="relative z-10">
                      <TabDockIcon
                        tabId={id}
                        active={active}
                        playKey={tabSwitchSeq}
                        accent={accent}
                        glow={accent.glow}
                        reduceMotion={reduceMotion}
                      />
                    </span>
                    {id === 'messages' && unread > 0 && (
                      <motion.span
                        className="absolute -right-0.5 -top-0.5 z-20 flex h-3.5 min-w-3.5 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-rose-500 to-orange-400 px-0.5 text-[8px] font-bold text-white shadow-lg"
                        initial={{ scale: 0 }}
                        animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.12, 1] }}
                        transition={{
                          scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                        }}
                      >
                        {unread > 9 ? '9+' : unread}
                      </motion.span>
                    )}
                  </span>

                  <motion.span
                    key={active ? `${id}-label-${tabSwitchSeq}` : `${id}-label`}
                    className="relative z-10 max-w-full truncate px-0.5 text-[10px]"
                    initial={active && !reduceMotion ? { opacity: 0.45, y: 5, scale: 0.92 } : false}
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            scale: active ? 1.05 : 1,
                            opacity: active ? 1 : 0.78,
                            y: active ? -1 : 0,
                          }
                    }
                    transition={active && !reduceMotion ? { duration: 0.35, ease: 'easeOut' } : spring}
                    style={{
                      fontWeight: active ? 600 : 400,
                      background: active
                        ? `linear-gradient(90deg, ${accent.a}, ${accent.b})`
                        : undefined,
                      WebkitBackgroundClip: active ? 'text' : undefined,
                      WebkitTextFillColor: active ? 'transparent' : undefined,
                      color: active ? undefined : '#8E8E93',
                      textShadow: active ? undefined : '0 1px 0 rgba(255,255,255,0.65)',
                    }}
                  >
                    {label}
                  </motion.span>
                </motion.button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}