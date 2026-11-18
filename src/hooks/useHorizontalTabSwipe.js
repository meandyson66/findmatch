import { useEffect, useRef } from 'react'

/**
 * 水平滑动：左滑下一项、右滑上一项（用于底栏 / 主内容区切换 Tab）
 */
export function useHorizontalTabSwipe(enabled, onSwipeLeft, onSwipeRight, options = {}) {
  const ref = useRef(null)
  const start = useRef(null)
  const threshold = options.threshold ?? 48
  const ratio = options.ratio ?? 1.15

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return undefined

    const onStart = (x, y) => {
      start.current = { x, y, t: Date.now(), horizontal: false }
    }

    const onMove = (x, y) => {
      if (!start.current) return
      const dx = x - start.current.x
      const dy = y - start.current.y
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * ratio) {
        start.current.horizontal = true
      }
    }

    const onEnd = (x, y) => {
      if (!start.current) return
      const dx = x - start.current.x
      const dy = y - start.current.y
      const horizontal =
        start.current.horizontal ||
        (Math.abs(dx) > Math.abs(dy) * ratio && Math.abs(dx) > threshold)
      if (horizontal) {
        if (dx < 0) onSwipeLeft()
        else if (dx > 0) onSwipeRight()
      }
      start.current = null
    }

    const onTouchStart = (e) => {
      const t = e.touches[0]
      if (t) onStart(t.clientX, t.clientY)
    }
    const onTouchMove = (e) => {
      const t = e.touches[0]
      if (t) onMove(t.clientX, t.clientY)
    }
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0]
      if (t) onEnd(t.clientX, t.clientY)
    }

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') return
      onStart(e.clientX, e.clientY)
    }
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch' || !start.current) return
      onMove(e.clientX, e.clientY)
    }
    const onPointerUp = (e) => {
      if (e.pointerType === 'touch' || !start.current) return
      onEnd(e.clientX, e.clientY)
    }

    const capture = { passive: true, capture: true }
    el.addEventListener('touchstart', onTouchStart, capture)
    el.addEventListener('touchmove', onTouchMove, capture)
    el.addEventListener('touchend', onTouchEnd, capture)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('touchstart', onTouchStart, capture)
      el.removeEventListener('touchmove', onTouchMove, capture)
      el.removeEventListener('touchend', onTouchEnd, capture)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
    }
  }, [enabled, onSwipeLeft, onSwipeRight, ratio, threshold])

  return ref
}