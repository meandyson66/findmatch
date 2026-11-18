import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHorizontalTabSwipe } from '../../hooks/useHorizontalTabSwipe'
import { MAIN_TAB_IDS, shiftTabId, tabIndex } from './tabConfig'

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.92 }

export function MainTabPager({ tab, onTabChange, enabled, children }) {
  const reduceMotion = useReducedMotion()
  const [direction, setDirection] = useState(0)
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
      prevTab.current = tab
    }
  }, [tab])

  const swipeRef = useHorizontalTabSwipe(
    enabled,
    () => {
      const next = shiftTabId(tab, 1)
      if (next) goTab(next, 1)
    },
    () => {
      const prev = shiftTabId(tab, -1)
      if (prev) goTab(prev, -1)
    },
    { threshold: 52 }
  )

  const variants = {
    enter: (d) => ({
      x: d > 0 ? '38%' : '-38%',
      opacity: 0,
      filter: reduceMotion ? 'none' : 'blur(6px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (d) => ({
      x: d > 0 ? '-32%' : '32%',
      opacity: 0,
      filter: reduceMotion ? 'none' : 'blur(4px)',
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
    </div>
  )
}