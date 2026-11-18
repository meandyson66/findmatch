import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHorizontalTabSwipe } from '../../hooks/useHorizontalTabSwipe'
import { MAIN_TAB_IDS, shiftTabId, tabIndex } from './tabConfig'

const slideSpring = { type: 'spring', stiffness: 300, damping: 22, mass: 0.85 }
const settleSpring = { type: 'spring', stiffness: 420, damping: 16, mass: 0.75 }

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
      x: d > 0 ? '78%' : '-78%',
      scaleX: reduceMotion ? 1 : 0.86,
      scaleY: reduceMotion ? 1 : 0.93,
      opacity: 0.88,
    }),
    center: {
      x: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
    },
    exit: (d) => ({
      x: d > 0 ? '-62%' : '62%',
      scaleX: reduceMotion ? 1 : 0.9,
      scaleY: reduceMotion ? 1 : 0.95,
      opacity: 0.75,
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
          transition={{
            x: slideSpring,
            scaleX: settleSpring,
            scaleY: settleSpring,
            opacity: { duration: 0.22 },
          }}
          className="tab-pager-oval-shell absolute inset-x-2 top-0 bottom-0 flex min-h-0 flex-col overflow-hidden"
          style={{ transformOrigin: '50% 50%' }}
        >
          <div className="tab-pager-oval-inner flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}