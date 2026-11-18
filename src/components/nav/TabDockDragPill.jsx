import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MAIN_TAB_IDS, TAB_ACCENT, tabIndex } from './tabConfig'

const slideSpring = { type: 'spring', stiffness: 185, damping: 14, mass: 1.15 }
const landSpring = { type: 'spring', stiffness: 260, damping: 11, mass: 1.08 }
const BASE_WIDTH_RATIO = 0.76
const SIZE_SCALE = 1.5
const WIDTH_RATIO = Math.min(0.92, BASE_WIDTH_RATIO * SIZE_SCALE)
const HEIGHT_TO_WIDTH = Math.min(1.12, 0.95 * SIZE_SCALE)
const INSET_Y = 0

function pillMetricsForCell(cellW, cellH) {
  const width = Math.round(cellW * WIDTH_RATIO)
  const height = Math.min(cellH - INSET_Y * 2, Math.round(width * HEIGHT_TO_WIDTH))
  return { width, height }
}

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
  const { width, height } = pillMetricsForCell(cellW, cellH)
  const left = activeRect.left - rowRect.left + (cellW - width) / 2
  const top = activeRect.top - rowRect.top + (cellH - height) / 2

  const firstPill = pillMetricsForCell(firstRect.width, firstRect.height)
  const lastPill = pillMetricsForCell(lastRect.width, lastRect.height)
  const minLeft = firstRect.left - rowRect.left + (firstRect.width - firstPill.width) / 2
  const maxLeft = lastRect.left - rowRect.left + (lastRect.width - lastPill.width) / 2

  const hitPadX = Math.round(width * 0.22)
  const hitPadY = Math.round(height * 0.2)

  const centers = MAIN_TAB_IDS.map((_, i) => {
    const el = itemRefs.current[i]
    if (!el) return 0
    const r = el.getBoundingClientRect()
    return r.left - rowRect.left + r.width / 2
  })

  return {
    left,
    top,
    width,
    height,
    minLeft,
    maxLeft,
    centers,
    hitLeft: left - hitPadX,
    hitTop: top - hitPadY,
    hitWidth: width + hitPadX * 2,
    hitHeight: height + hitPadY * 2,
  }
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
  const dragLayerRef = useRef(null)
  const [layout, setLayout] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [landTick, setLandTick] = useState(0)
  const landMounted = useRef(false)
  const committedIndex = tabIndex(committedId)
  const accent = TAB_ACCENT[visualId] ?? TAB_ACCENT.home

  useEffect(() => {
    if (!landMounted.current) {
      landMounted.current = true
      return
    }
    setLandTick((n) => n + 1)
  }, [committedId])

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
    const padX = layout.hitLeft - layout.left
    return {
      left: layout.minLeft - layout.left - padX,
      right: layout.maxLeft - layout.left + padX,
    }
  }, [layout])

  const previewAtPointer = useCallback(() => {
    const row = rowRef.current
    const layer = dragLayerRef.current
    if (!row || !layer || !layout) return
    const idx = pickIndexFromCenter(row, layer, layout)
    if (idx == null) return
    const id = MAIN_TAB_IDS[idx]
    if (id) onDragPreview?.(id)
  }, [layout, onDragPreview, rowRef])

  const commitFromDrag = useCallback(() => {
    const row = rowRef.current
    const layer = dragLayerRef.current
    if (!row || !layer || !layout) return
    const idx = pickIndexFromCenter(row, layer, layout)
    onDragPreview?.(null)
    setDragging(false)
    if (idx == null) return
    const nextId = MAIN_TAB_IDS[idx]
    if (nextId && nextId !== committedId) onSelect(nextId)
  }, [committedId, layout, onDragPreview, onSelect, rowRef])

  if (!layout) return null

  return (
    <motion.div
      ref={dragLayerRef}
      className="tab-dock-pill-drag-layer tab-dock-pill-draggable pointer-events-auto absolute z-[4]"
      animate={{
        left: layout.hitLeft,
        top: layout.hitTop,
        width: layout.hitWidth,
        height: layout.hitHeight,
      }}
      transition={slideSpring}
      drag={reduceMotion ? false : 'x'}
      dragMomentum={false}
      dragElastic={0.82}
      dragTransition={{
        bounceStiffness: 125,
        bounceDamping: 9,
        power: 0.22,
        timeConstant: 420,
      }}
      dragConstraints={dragConstraints}
      onDragStart={() => setDragging(true)}
      onDrag={previewAtPointer}
      onDragEnd={commitFromDrag}
      whileDrag={{ cursor: 'grabbing' }}
      aria-label="拖动水滴切换页面"
      role="slider"
    >
      <motion.div
        key={`dock-land-${landTick}`}
        className="tab-dock-pill tab-dock-pill-droplet tab-dock-pill-visual pointer-events-none"
        style={{
          width: layout.width,
          height: layout.height,
          flexShrink: 0,
          boxShadow: dragging
            ? `0 14px 32px rgba(${accent.glow},0.28), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -10px 20px rgba(255,255,255,0.5)`
            : `0 12px 28px rgba(${accent.glow},0.22), inset 0 2px 0 rgba(255,255,255,0.92), inset 0 -8px 16px rgba(255,255,255,0.4)`,
        }}
        initial={reduceMotion ? false : { scaleX: 1.2, scaleY: 0.82, x: 0 }}
        animate={reduceMotion ? {} : { scaleX: 1, scaleY: 1, x: 0 }}
        whileDrag={{
          scaleX: 1.16,
          scaleY: 0.84,
        }}
        transition={landSpring}
        aria-hidden
      />
    </motion.div>
  )
}