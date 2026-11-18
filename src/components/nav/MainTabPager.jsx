import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MAIN_TAB_IDS, TAB_ACCENT, tabIndex } from './tabConfig'

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.92 }

export function MainTabPager({ tab, onTabChange, enabled, children }) {
  const reduceMotion = useReducedMotion()
  const [direction, setDirection] = useState(0)
  const [fusion, setFusion] = useState(null)
  const prevTab = useRef(tab)
  const mounted = useRef(false)

  const goTab = useCallback(
    (next, dir) => {
      if (!MAIN_TAB_IDS.includes(next) || next === tab) return
      setDirection(dir ?? (tabIndex(next) > tabIndex(tab) ? 1 : -1))
      onTabChange(next)
    },
    [onTabChange, tab]
  )

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      prevTab.current = tab
      return
    }
    if (prevTab.current !== tab) {
      const d = tabIndex(tab) > tabIndex(prevTab.current) ? 1 : -1
      setDirection(d)
      if (!reduceMotion) {
        const from = TAB_ACCENT[prevTab.current] ?? TAB_ACCENT.home
        const to = TAB_ACCENT[tab] ?? TAB_ACCENT.home
        setFusion({ from, to, key: Date.now() })
        window.setTimeout(() => setFusion(null), 520)
      }
      prevTab.current = tab
    }
  }, [reduceMotion, tab])

  const swipeRef = useTabSwipe(
    enabled,
    () => {
      const i = tabIndex(tab)
      if (i < MAIN_TAB_IDS.length - 1) goTab(MAIN_TAB_IDS[i + 1], 1)
    },
    () => {
      const i = tabIndex(tab)
      if (i > 0) goTab(MAIN_TAB_IDS[i - 1], -1)
    }
  )

  const variants = {
    enter: (d) => ({
      x: d > 0 ? '42%' : '-42%',
      opacity: 0,
      scale: 0.94,
      filter: reduceMotion ? 'none' : 'blur(10px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (d) => ({
      x: d > 0 ? '-38%' : '38%',
      opacity: 0,
      scale: 0.96,
      filter: reduceMotion ? 'none' : 'blur(8px)',
    }),
  }

  return (
    <div ref={swipeRef} className="tab-pager-root relative min-h-0 flex-1 overflow-hidden">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={tab}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={spring}
          className="absolute inset-0 flex h-full min-h-0 flex-col overflow-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {fusion && !reduceMotion && (
          <motion.div
            key={fusion.key}
            className="tab-fusion-scrim pointer-events-none absolute inset-0 z-[25]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            <motion.span
              className="tab-fusion-droplet tab-fusion-droplet-a"
              style={{ background: `radial-gradient(circle, ${fusion.from.a}ee, ${fusion.from.b}88)` }}
              initial={{ x: direction > 0 ? '-28%' : '28%', scale: 0.35, opacity: 0.9 }}
              animate={{ x: 0, scale: 1.15, opacity: 0.75 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="tab-fusion-droplet tab-fusion-droplet-b"
              style={{ background: `radial-gradient(circle, ${fusion.to.a}ee, ${fusion.to.b}88)` }}
              initial={{ x: direction > 0 ? '28%' : '-28%', scale: 0.35, opacity: 0.9 }}
              animate={{ x: 0, scale: 1.15, opacity: 0.75 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="tab-fusion-merge-core"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.35, 0.6], opacity: [0, 0.55, 0] }}
              transition={{ duration: 0.48, ease: 'easeOut', times: [0, 0.45, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function useTabSwipe(enabled, onSwipeLeft, onSwipeRight) {
  const ref = useRef(null)
  const start = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return undefined

    const onStart = (x, y) => {
      start.current = { x, y, t: Date.now() }
    }

    const onTouchStart = (e) => {
      const t = e.touches[0]
      if (!t) return
      onStart(t.clientX, t.clientY)
    }

    const onTouchEnd = (e) => {
      if (!start.current) return
      const t = e.changedTouches[0]
      if (!t) return
      const dx = t.clientX - start.current.x
      const dy = t.clientY - start.current.y
      if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 52) {
        if (dx < 0) onSwipeLeft()
        else onSwipeRight()
      }
      start.current = null
    }

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') return
      onStart(e.clientX, e.clientY)
    }

    const onPointerUp = (e) => {
      if (e.pointerType === 'touch' || !start.current) return
      const dx = e.clientX - start.current.x
      const dy = e.clientY - start.current.y
      if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 72) {
        if (dx < 0) onSwipeLeft()
        else onSwipeRight()
      }
      start.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
    }
  }, [enabled, onSwipeLeft, onSwipeRight])

  return ref
}