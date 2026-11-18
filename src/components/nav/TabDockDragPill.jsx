import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MAIN_TAB_IDS, TAB_ACCENT, tabIndex } from './tabConfig'

const spring = { type: 'spring', stiffness: 520, damping: 34, mass: 0.85 }
const INSET = 2

function readDockLayout(rowEl, itemRefs, activeIndex) {
  const activeLi = itemRefs.current[activeIndex]
  const firstLi = itemRefs.current[0]
  const lastLi = itemRefs.current[MAIN_TAB_IDS.length - 1]
  if (!rowEl || !activeLi || !firstLi || !lastLi) return null

  const rowRect = rowEl.getBoundingClientRect()
  const activeRect = activeLi.getBoundingClientRect()
  const firstRect = firstLi.getBoundingClientRect()
  const lastRect = lastLi.getBoundingClientRect()

  const left = activeRect.left - rowRect.left + INSET
  const width = activeRect.width - INSET * 2
  const top = activeRect.top - rowRect.top + INSET
  const height = activeRect.height - INSET * 2

  const minLeft = firstRect.left - rowRect.left + INSET
  const maxLeft = lastRect.left - rowRect.left + lastRect.width - width - INSET

  const centers = MAIN_TAB_IDS.map((_, i) => {
    const el = itemRefs.current[i]
    if (!el) return 0
    const r = el.getBoundingClientRect()
    return r.left - rowRect.left + r.width / 2
  })

  return { left, width, top, height, minLeft, maxLeft, centers }
}

export function TabDockDragPill({ rowRef, itemRefs, activeId, onSelect }) {
  const reduceMotion = useReducedMotion()
  const pillRef = useRef(null)
  const [layout, setLayout] = useState(null)
  const activeIndex = tabIndex(activeId)
  const accent = TAB_ACCENT[activeId] ?? TAB_ACCENT.home

  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const next = readDockLayout(row, itemRefs, activeIndex)
    if (next) setLayout(next)
  }, [activeIndex, itemRefs, rowRef])

  useLayoutEffect(() => {
    measure()
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [measure, rowRef])

  const dragConstraints = useMemo(() => {
    if (!layout) return { left: 0, right: 0 }
    return {
      left: layout.minLeft - layout.left,
      right: layout.maxLeft - layout.left,
    }
  }, [layout])

  const commitFromDrag = useCallback(() => {
    const row = rowRef.current
    const pill = pillRef.current
    if (!row || !pill || !layout) return
    const rowRect = row.getBoundingClientRect()
    const pillRect = pill.getBoundingClientRect()
    const cx = pillRect.left - rowRect.left + pillRect.width / 2

    let best = activeIndex
    let bestDist = Infinity
    layout.centers.forEach((center, i) => {
      const d = Math.abs(cx - center)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })

    const nextId = MAIN_TAB_IDS[best]
    if (nextId && nextId !== activeId) onSelect(nextId)
  }, [activeId, activeIndex, itemRefs, layout, onSelect, rowRef])

  if (!layout) return null

  return (
    <motion.div
      key={activeId}
      ref={pillRef}
      layout={!reduceMotion}
      className="tab-dock-pill tab-dock-pill-draggable pointer-events-auto absolute z-[4]"
      style={{
        left: layout.left,
        width: layout.width,
        top: layout.top,
        height: layout.height,
        boxShadow: `0 12px 28px rgba(${accent.glow},0.22), inset 0 2px 0 rgba(255,255,255,0.92), inset 0 -8px 16px rgba(255,255,255,0.4)`,
      }}
      transition={spring}
      drag={reduceMotion ? false : 'x'}
      dragMomentum={false}
      dragElastic={0.14}
      dragConstraints={dragConstraints}
      onDragEnd={() => commitFromDrag()}
      aria-hidden
    />
  )
}