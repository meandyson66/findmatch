import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MAIN_TAB_IDS, TAB_ACCENT, tabIndex } from './tabConfig'

const dropletSpring = { type: 'spring', stiffness: 210, damping: 24, mass: 1.08 }
const INSET_X = 3
const WIDTH_RATIO = 0.76
const INSET_Y = 1

function readDockLayout(rowEl, itemRefs, activeIndex) {
  const activeLi = itemRefs.current[activeIndex]
  const firstLi = itemRefs.current[0]
  const lastLi = itemRefs.current[MAIN_TAB_IDS.length - 1]
  if (!rowEl || !activeLi || !firstLi || !lastLi) return null

  const rowRect = rowEl.getBoundingClientRect()
  const activeRect = activeLi.getBoundingClientRect()
  const firstRect = firstLi.getBoundingClientRect()
  const lastRect = lastLi.getBoundingClientRect()

  const cellW = activeRect.width
  const cellH = activeRect.height
  const width = Math.round(cellW * WIDTH_RATIO)
  const left = activeRect.left - rowRect.left + (cellW - width) / 2
  const height = Math.min(cellH - INSET_Y * 2, Math.round(width * 0.95))
  const top = activeRect.top - rowRect.top + (cellH - height) / 2

  const firstCellW = firstRect.width
  const lastCellW = lastRect.width
  const firstPillW = Math.round(firstCellW * WIDTH_RATIO)
  const lastPillW = Math.round(lastCellW * WIDTH_RATIO)
  const minLeft = firstRect.left - rowRect.left + (firstCellW - firstPillW) / 2
  const maxLeft = lastRect.left - rowRect.left + (lastCellW - lastPillW) / 2

  const centers = MAIN_TAB_IDS.map((_, i) => {
    const el = itemRefs.current[i]
    if (!el) return 0
    const r = el.getBoundingClientRect()
    return r.left - rowRect.left + r.width / 2
  })

  return { left, width, top, height, minLeft, maxLeft, centers }
}

function pickIndexFromCenter(rowEl, pillEl, layout) {
  if (!rowEl || !pillEl || !layout) return null
  const rowRect = rowEl.getBoundingClientRect()
  const pillRect = pillEl.getBoundingClientRect()
  const cx = pillRect.left - rowRect.left + pillRect.width / 2

  let best = 0
  let bestDist = Infinity
  layout.centers.forEach((center, i) => {
    const d = Math.abs(cx - center)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  })
  return best
}

export function TabDockDragPill({
  rowRef,
  itemRefs,
  visualId,
  committedId,
  onSelect,
  onDragPreview,
}) {
  const reduceMotion = useReducedMotion()
  const pillRef = useRef(null)
  const [layout, setLayout] = useState(null)
  const [dragging, setDragging] = useState(false)
  const committedIndex = tabIndex(committedId)
  const accent = TAB_ACCENT[visualId] ?? TAB_ACCENT.home

  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const next = readDockLayout(row, itemRefs, committedIndex)
    if (next) setLayout(next)
  }, [committedIndex, itemRefs, rowRef])

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

  const previewAtPointer = useCallback(() => {
    const row = rowRef.current
    const pill = pillRef.current
    if (!row || !pill || !layout) return
    const idx = pickIndexFromCenter(row, pill, layout)
    if (idx == null) return
    const id = MAIN_TAB_IDS[idx]
    if (id) onDragPreview?.(id)
  }, [layout, onDragPreview, rowRef])

  const commitFromDrag = useCallback(() => {
    const row = rowRef.current
    const pill = pillRef.current
    if (!row || !pill || !layout) return
    const idx = pickIndexFromCenter(row, pill, layout)
    onDragPreview?.(null)
    setDragging(false)
    if (idx == null) return
    const nextId = MAIN_TAB_IDS[idx]
    if (nextId && nextId !== committedId) onSelect(nextId)
  }, [committedId, layout, onDragPreview, onSelect, rowRef])

  if (!layout) return null

  return (
    <motion.div
      ref={pillRef}
      className="tab-dock-pill tab-dock-pill-droplet tab-dock-pill-draggable pointer-events-auto absolute z-[1]"
      animate={{
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        scaleX: dragging ? undefined : 1,
        scaleY: dragging ? undefined : 1,
      }}
      style={{
        boxShadow: dragging
          ? `0 14px 32px rgba(${accent.glow},0.28), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -10px 20px rgba(255,255,255,0.5)`
          : `0 12px 28px rgba(${accent.glow},0.22), inset 0 2px 0 rgba(255,255,255,0.92), inset 0 -8px 16px rgba(255,255,255,0.4)`,
      }}
      transition={dropletSpring}
      drag={reduceMotion ? false : 'x'}
      dragMomentum={false}
      dragElastic={0.62}
      dragTransition={{
        bounceStiffness: 165,
        bounceDamping: 16,
        power: 0.12,
        timeConstant: 360,
      }}
      dragConstraints={dragConstraints}
      onDragStart={() => setDragging(true)}
      onDrag={previewAtPointer}
      onDragEnd={commitFromDrag}
      whileDrag={{
        scaleX: 1.1,
        scaleY: 0.9,
      }}
      aria-hidden
    />
  )
}