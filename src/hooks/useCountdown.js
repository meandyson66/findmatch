import { useEffect, useState } from 'react'

const TOTAL_MS = 48 * 60 * 60 * 1000

export function useCountdown(startedAt) {
  const [left, setLeft] = useState(TOTAL_MS)

  useEffect(() => {
    if (!startedAt) {
      setLeft(TOTAL_MS)
      return
    }
    const tick = () => {
      const elapsed = Date.now() - startedAt
      setLeft(Math.max(0, TOTAL_MS - elapsed))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  const h = Math.floor(left / 3600000)
  const m = Math.floor((left % 3600000) / 60000)
  const s = Math.floor((left % 60000) / 1000)
  const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return { left, label }
}