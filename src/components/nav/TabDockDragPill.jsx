import { animate, motion, useMotionValue } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MAIN_TAB_IDS, TAB_ACCENT, tabIndex } from './tabConfig'

const slideSpring = { type: 'spring', stiffness: 175, damping: 12, mass: 1.18 }
const landSpring = { type: 'spring', stiffness: 290, damping: 9, mass: 1.05 }
const settleSpring = { type: 'spring', stiffness: 240, damping: 11, mass: 1.02 }
const BASE_WIDTH_RATIO = 0.76
const SIZE_SCALE = 1.5
const WIDTH_RATIO = Math.min(0.92, BASE_WIDTH_RATIO * SIZE_SCALE)
const HEIGHT_TO_WIDTH = Math.min(1.12, 0.95 * SIZE_SCALE)
const INSET_Y = 0
const DRAG_THRESHOLD_PX = 5

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

  const hitPadX = Math.round(width * 0.3)
  const hitPadY = Math.round(height * 0.2)
  const hitLeft = left - hitPadX
  const hitTop = top - hitPadY
  const hitWidth = width + hitPadX * 2
  const hitHeight = height + hitPadY * 2
  const minHitLeft = minLeft - hitPadX
  const maxHitLeft = maxLeft - hitPadX

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
    hitLeft,
    hitTop,
    hitWidth,
    hitHeight,
    minDragX: minHitLeft - hitLeft,
    maxDragX: maxHitLeft - hitLeft,
    centers,
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

export function useTabDockDrag({
  rowRef,
  itemRefs,
  committedId,
  onSelect,
  onDragPreview,
  suppressClickRef,
}) {
  const dragLayerRef = useRef(null)
  const layoutRef = useRef(null)
  const sessionRef = useRef(null)
  const committedIdRef = useRef(committedId)
  const [layout, setLayout] = useState(null)
  const [dragging, setDragging] = useState(false)
  const offsetX = useMotionValue(0)

  committedIdRef.current = committedId
  const committedIndex = tabIndex(committedId)

  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const next = readDockLayout(row, itemRefs, tabIndex(committedIdRef.current))
    if (next) {
      layoutRef.current = next
      setLayout(next)
    }
  }, [itemRefs, rowRef])

  useLayoutEffect(() => {
    measure()
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [measure, rowRef, committedIndex])

  useEffect(() => {
    offsetX.set(0)
    measure()
  }, [committedId, measure, offsetX])

  const previewAtPointer = useCallback(() => {
    const row = rowRef.current
    const layer = dragLayerRef.current
    const L = layoutRef.current
    if (!row || !layer || !L) return
    const idx = pickIndexFromCenter(row, layer, L)
    const id = MAIN_TAB_IDS[idx]
    if (id) onDragPreview?.(id)
  }, [onDragPreview, rowRef])

  const commitFromDrag = useCallback(() => {
    const row = rowRef.current
    const layer = dragLayerRef.current
    const L = layoutRef.current
    if (!row || !layer || !L) return
    const idx = pickIndexFromCenter(row, layer, L)
    onDragPreview?.(null)
    const nextId = MAIN_TAB_IDS[idx]
    const committed = committedIdRef.current
    if (nextId && nextId !== committed) onSelect(nextId)
    animate(offsetX, 0, settleSpring)
  }, [offsetX, onDragPreview, onSelect, rowRef])

  const armSession = useCallback(
    (clientX, clientY) => {
      if (sessionRef.current) return
      sessionRef.current = {
        startX: clientX,
        startY: clientY,
        baseX: offsetX.get(),
        dragging: false,
      }

      const clampDrag = (dx) => {
        const L = layoutRef.current
        if (!L) return dx
        return Math.max(L.minDragX, Math.min(L.maxDragX, dx))
      }

      const onMove = (clientX, clientY, e) => {
        const session = sessionRef.current
        if (!session) return

        const dx = clientX - session.startX

        if (!session.dragging) {
          if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
          session.dragging = true
          setDragging(true)
        }

        const totalX = clientX - session.startX + session.baseX
        offsetX.set(clampDrag(totalX))
        e?.preventDefault?.()
        previewAtPointer()
      }

      const onPointerMove = (e) => onMove(e.clientX, e.clientY, e)

      const onTouchMove = (e) => {
        const t = e.touches[0]
        if (t) onMove(t.clientX, t.clientY, e)
      }

      const end = (e) => {
        const session = sessionRef.current
        if (!session) return
        const wasDrag = session.dragging
        sessionRef.current = null
        setDragging(false)
        if (wasDrag) {
          e?.preventDefault?.()
          suppressClickRef.current = true
          commitFromDrag()
        }
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', endPointer)
        window.removeEventListener('pointercancel', endPointer)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', endTouch)
        window.removeEventListener('touchcancel', endTouch)
      }

      const endPointer = (e) => end(e)
      const endTouch = (e) => end(e)

      window.addEventListener('pointermove', onPointerMove, { passive: false })
      window.addEventListener('pointerup', endPointer)
      window.addEventListener('pointercancel', endPointer)
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', endTouch)
      window.addEventListener('touchcancel', endTouch)
    },
    [commitFromDrag, offsetX, previewAtPointer, suppressClickRef]
  )

  const bindActiveDrag = useCallback(() => {
    return {
      onPointerDown: (e) => {
        if (e.button !== 0) return
        armSession(e.clientX, e.clientY)
      },
      onTouchStart: (e) => {
        const t = e.changedTouches[0]
        if (t) armSession(t.clientX, t.clientY)
      },
      style: { touchAction: 'pan-y' },
    }
  }, [armSession])

  const onDropletPointerDown = useCallback(
    (e) => {
      e.stopPropagation()
      if (e.button !== 0) return
      armSession(e.clientX, e.clientY)
    },
    [armSession]
  )

  return {
    dragLayerRef,
    layout,
    dragging,
    offsetX,
    bindActiveDrag,
    onDropletPointerDown,
  }
}

export function TabDockDragPill({ visualId, committedId, drag }) {
  const [landTick, setLandTick] = useState(0)
  const landMounted = useRef(false)
  const { dragLayerRef, layout, dragging, offsetX, onDropletPointerDown } = drag
  const accent = TAB_ACCENT[visualId] ?? TAB_ACCENT.home

  useEffect(() => {
    if (!landMounted.current) {
      landMounted.current = true
      return
    }
    setLandTick((n) => n + 1)
  }, [committedId])

  if (!layout) return null

  return (
    <motion.div
      ref={dragLayerRef}
      className="tab-dock-pill-drag-layer tab-dock-pill-draggable pointer-events-auto absolute z-[4]"
      style={{
        left: layout.hitLeft,
        top: layout.hitTop,
        width: layout.hitWidth,
        height: layout.hitHeight,
        x: offsetX,
        touchAction: 'none',
      }}
      animate={{
        left: layout.hitLeft,
        top: layout.hitTop,
        width: layout.hitWidth,
        height: layout.hitHeight,
      }}
      transition={slideSpring}
      onPointerDown={onDropletPointerDown}
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
            ? `0 18px 40px rgba(${accent.glow},0.22), inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -12px 24px rgba(255,255,255,0.45)`
            : `0 14px 36px rgba(${accent.glow},0.18), inset 0 2px 0 rgba(255,255,255,0.88), inset 0 -10px 20px rgba(255,255,255,0.38)`,
        }}
        initial={{ scaleX: 1.28, scaleY: 0.74 }}
        animate={{
          scaleX: dragging ? 1.2 : 1,
          scaleY: dragging ? 0.8 : 1,
        }}
        transition={landSpring}
        aria-hidden
      />
    </motion.div>
  )
}