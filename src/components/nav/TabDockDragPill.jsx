import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
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
const DRAG_THRESHOLD_PX = 4

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
    minHitLeft,
    maxHitLeft,
    centers,
    hitLeft,
    hitTop,
    hitWidth,
    hitHeight,
    minDragX: minHitLeft - hitLeft,
    maxDragX: maxHitLeft - hitLeft,
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
  const layoutRef = useRef(null)
  const dragGesture = useRef({ pointerX: 0, baseX: 0, active: false })
  const pendingDrag = useRef(null)
  const [layout, setLayout] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [landTick, setLandTick] = useState(0)
  const landMounted = useRef(false)
  const offsetX = useMotionValue(0)
  const committedIndex = tabIndex(committedId)
  const accent = TAB_ACCENT[visualId] ?? TAB_ACCENT.home

  useEffect(() => {
    if (!landMounted.current) {
      landMounted.current = true
      return
    }
    setLandTick((n) => n + 1)
    offsetX.set(0)
  }, [committedId, offsetX])

  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const next = readDockLayout(row, itemRefs, committedIndex)
    if (next) {
      layoutRef.current = next
      setLayout(next)
    }
  }, [committedIndex, itemRefs, rowRef])

  useLayoutEffect(() => {
    measure()
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [measure, rowRef])

  const previewAtPointer = useCallback(() => {
    const row = rowRef.current
    const layer = dragLayerRef.current
    const L = layoutRef.current
    if (!row || !layer || !L) return
    const idx = pickIndexFromCenter(row, layer, L)
    if (idx == null) return
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
    if (nextId && nextId !== committedId) onSelect(nextId)
    animate(offsetX, 0, settleSpring)
  }, [committedId, offsetX, onDragPreview, onSelect, rowRef])

  useEffect(() => {
    const row = rowRef.current
    if (!row || reduceMotion) return undefined

    const clampDrag = (dx) => {
      const L = layoutRef.current
      if (!L) return dx
      return Math.max(L.minDragX, Math.min(L.maxDragX, dx))
    }

    const isPointInActiveTab = (clientX, clientY) => {
      const li = itemRefs.current[committedIndex]
      if (!li) return false
      const r = li.getBoundingClientRect()
      return (
        clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom
      )
    }

    const isOnDroplet = (target) => {
      const layer = dragLayerRef.current
      if (!layer || !target) return false
      return layer === target || layer.contains(target)
    }

    const beginPending = (pointerId, clientX, clientY) => {
      pendingDrag.current = {
        pointerId,
        pointerX: clientX,
        pointerY: clientY,
        baseX: offsetX.get(),
        touch: pointerId > 100000,
      }
    }

    const shouldStartDrag = (dx, dy) =>
      Math.abs(dx) >= DRAG_THRESHOLD_PX && Math.abs(dx) >= Math.abs(dy) * 0.85

    const applyMove = (clientX, clientY, e) => {
      const pending = pendingDrag.current
      if (!pending) return

      const dx = clientX - pending.pointerX
      const dy = clientY - pending.pointerY

      if (!dragGesture.current.active) {
        if (!shouldStartDrag(dx, dy)) return
        dragGesture.current = {
          active: true,
          pointerX: pending.pointerX,
          baseX: pending.baseX,
        }
        setDragging(true)
      }

      const totalX = clientX - dragGesture.current.pointerX + dragGesture.current.baseX
      offsetX.set(clampDrag(totalX))
      e.preventDefault()
      previewAtPointer()
    }

    const finish = (pointerId, e) => {
      const pending = pendingDrag.current
      if (!pending || pending.pointerId !== pointerId) return
      if (dragGesture.current.active) {
        e.preventDefault()
        e.stopPropagation()
        dragGesture.current.active = false
        setDragging(false)
        commitFromDrag()
      }
      pendingDrag.current = null
    }

    const onDownCapture = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (pendingDrag.current?.touch && e.pointerType === 'touch') return
      const ok =
        isPointInActiveTab(e.clientX, e.clientY) || isOnDroplet(e.target)
      if (!ok) return
      beginPending(e.pointerId, e.clientX, e.clientY)
    }

    const onMoveCapture = (e) => {
      const pending = pendingDrag.current
      if (!pending || pending.pointerId !== e.pointerId) return
      applyMove(e.clientX, e.clientY, e)
    }

    const onUpCapture = (e) => {
      finish(e.pointerId, e)
    }

    const onTouchStart = (e) => {
      const t = e.changedTouches[0]
      if (!t) return
      const ok =
        isPointInActiveTab(t.clientX, t.clientY) || isOnDroplet(e.target)
      if (!ok) return
      beginPending(t.identifier + 100000, t.clientX, t.clientY)
    }

    const onTouchMove = (e) => {
      const pending = pendingDrag.current
      if (!pending?.touch) return
      const touchId = pending.pointerId - 100000
      const t = [...e.touches].find((touch) => touch.identifier === touchId)
      if (!t) return
      applyMove(t.clientX, t.clientY, e)
    }

    const onTouchEnd = (e) => {
      const pending = pendingDrag.current
      if (!pending?.touch) return
      const t = [...e.changedTouches].find((touch) => touch.identifier + 100000 === pending.pointerId)
      if (!t) return
      finish(pending.pointerId, e)
    }

    const opts = { capture: true, passive: false }
    row.addEventListener('pointerdown', onDownCapture, opts)
    row.addEventListener('pointermove', onMoveCapture, opts)
    row.addEventListener('pointerup', onUpCapture, opts)
    row.addEventListener('pointercancel', onUpCapture, opts)
    row.addEventListener('touchstart', onTouchStart, opts)
    row.addEventListener('touchmove', onTouchMove, opts)
    row.addEventListener('touchend', onTouchEnd, opts)
    row.addEventListener('touchcancel', onTouchEnd, opts)

    return () => {
      row.removeEventListener('pointerdown', onDownCapture, opts)
      row.removeEventListener('pointermove', onMoveCapture, opts)
      row.removeEventListener('pointerup', onUpCapture, opts)
      row.removeEventListener('pointercancel', onUpCapture, opts)
      row.removeEventListener('touchstart', onTouchStart, opts)
      row.removeEventListener('touchmove', onTouchMove, opts)
      row.removeEventListener('touchend', onTouchEnd, opts)
      row.removeEventListener('touchcancel', onTouchEnd, opts)
    }
  }, [
    committedIndex,
    commitFromDrag,
    itemRefs,
    offsetX,
    previewAtPointer,
    reduceMotion,
    rowRef,
  ])

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
      }}
      animate={{
        left: layout.hitLeft,
        top: layout.hitTop,
        width: layout.hitWidth,
        height: layout.hitHeight,
      }}
      transition={slideSpring}
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
        initial={reduceMotion ? false : { scaleX: 1.28, scaleY: 0.74 }}
        animate={
          reduceMotion
            ? {}
            : {
                scaleX: dragging ? 1.2 : 1,
                scaleY: dragging ? 0.8 : 1,
              }
        }
        transition={landSpring}
        aria-hidden
      />
    </motion.div>
  )
}