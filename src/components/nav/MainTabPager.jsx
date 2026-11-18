import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { tabIndex } from './tabConfig'

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.92 }

export function MainTabPager({ tab, children }) {
  const reduceMotion = useReducedMotion()
  const [direction, setDirection] = useState(0)
  const prevTab = useRef(tab)
  const mounted = useRef(false)

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
    <div className="tab-pager-root relative min-h-0 flex-1 overflow-hidden">
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