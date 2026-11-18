import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { TAB_ACCENT, TABS } from './nav/tabConfig'
import { TabDockDragPill, useTabDockDrag } from './nav/TabDockDragPill'
import { TabDockIcon } from './nav/TabDockIcon'

const spring = { type: 'spring', stiffness: 520, damping: 34, mass: 0.85 }

export function BottomNav() {
  const { state, patch } = useApp()
  const reduceMotion = useReducedMotion()
  const [tabSwitchSeq, setTabSwitchSeq] = useState(0)
  const [dragPreviewId, setDragPreviewId] = useState(null)
  const suppressClickRef = useRef(false)
  const dockRowRef = useRef(null)
  const dockItemRefs = useRef([])

  const drag = useTabDockDrag({
    rowRef: dockRowRef,
    itemRefs: dockItemRefs,
    committedId: state.tab,
    onSelect: (id) => patch({ tab: id }),
    onDragPreview: setDragPreviewId,
    suppressClickRef,
  })

  useEffect(() => {
    setTabSwitchSeq((n) => n + 1)
  }, [state.tab])

  useEffect(() => {
    setDragPreviewId(null)
  }, [state.tab])

  const unread = useMemo(() => {
    return Object.values(state.chats).filter((c) => (c.unread ?? 0) > 0).length
  }, [state.chats])

  const visualTab = dragPreviewId ?? state.tab
  const activeAccent = TAB_ACCENT[visualTab] ?? TAB_ACCENT.home
  const activeDrag = drag.bindActiveDrag()

  const handleTabClick = (id) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    patch({ tab: id })
  }

  return (
    <div className="tab-liquid-dock-wrap">
      <nav
        className="tab-liquid-dock tab-nav-aurora"
        aria-label="主导航：点击图标切换，或按住左右拖动切换"
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

        <ul
          ref={dockRowRef}
          className="relative flex items-stretch justify-between px-1 py-1"
        >
          {TABS.map(({ id, label }, index) => {
            const active = visualTab === id
            const accent = TAB_ACCENT[id]
            const isCommitted = state.tab === id
            const dragProps = isCommitted ? activeDrag : {}

            return (
              <li
                key={id}
                ref={(el) => {
                  dockItemRefs.current[index] = el
                }}
                className={`tab-dock-cell relative z-[20] min-w-0 flex-1 ${
                  isCommitted ? 'tab-dock-cell--active-dock' : ''
                }`}
              >
                <motion.button
                  type="button"
                  onClick={() => handleTabClick(id)}
                  className="relative flex w-full flex-col items-center gap-0 py-0.5 leading-none"
                  whileTap={reduceMotion ? undefined : { scale: 0.9, y: 1 }}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  style={{ transformStyle: 'preserve-3d', ...dragProps.style }}
                  onPointerDown={dragProps.onPointerDown}
                  onTouchStart={dragProps.onTouchStart}
                >
                  <motion.span
                    className="tab-dock-icon-stage relative z-[30] flex h-8 w-8 items-center justify-center"
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                  >
                    {active && !reduceMotion && (
                      <>
                        <motion.span
                          key={`burst-${id}-${tabSwitchSeq}`}
                          className="absolute inset-0 z-0 rounded-full border border-white/60"
                          style={{
                            background: `radial-gradient(circle, rgba(${accent.glow},0.35), transparent 72%)`,
                          }}
                          initial={{ scale: 0.4, opacity: 0.9 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          aria-hidden
                        />
                        <motion.span
                          className="absolute inset-0 z-0 rounded-full blur-md"
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
                        className="absolute -right-0.5 -top-0.5 z-30 flex h-3.5 min-w-3.5 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-rose-500 to-orange-400 px-0.5 text-[8px] font-bold text-white shadow-lg"
                        initial={{ scale: 0 }}
                        animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.12, 1] }}
                        transition={{
                          scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                        }}
                      >
                        {unread > 9 ? '9+' : unread}
                      </motion.span>
                    )}
                  </motion.span>

                  <motion.span
                    key={active ? `${id}-label-${tabSwitchSeq}` : `${id}-label`}
                    className="pointer-events-none relative z-[30] -mt-px max-w-full truncate px-0.5 text-[10px] leading-tight"
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
                      color: active ? undefined : '#94A3B8',
                      textShadow: active ? undefined : '0 1px 0 rgba(255, 255, 255, 0.65)',
                    }}
                  >
                    {label}
                  </motion.span>
                </motion.button>
              </li>
            )
          })}
          <TabDockDragPill visualId={visualTab} committedId={state.tab} drag={drag} />
        </ul>
      </nav>
    </div>
  )
}