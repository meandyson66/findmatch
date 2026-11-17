import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

const HOLD_MS = 1200

export function LongPressPolaroid({ onComplete, disabled }) {
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const startRef = useRef(0)
  const rafRef = useRef(null)

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    timerRef.current = null
    setProgress(0)
  }, [])

  const tick = useCallback(() => {
    const p = Math.min(1, (Date.now() - startRef.current) / HOLD_MS)
    setProgress(p)
    if (p < 1) rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(() => {
    if (disabled) return
    startRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([12, 40, 12])
      onComplete()
      clear()
    }, HOLD_MS)
  }, [clear, disabled, onComplete, tick])

  const circumference = 2 * Math.PI * 38

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] text-warm-gray">长按冲印拍立得</p>
      <button
        type="button"
        disabled={disabled}
        onPointerDown={start}
        onPointerUp={clear}
        onPointerLeave={clear}
        onPointerCancel={clear}
        className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border-warm bg-walnut shadow-inner disabled:opacity-40"
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="38" fill="none" stroke="#2E2A26" strokeWidth="4" />
          <circle
            cx="44"
            cy="44"
            r="38"
            fill="none"
            stroke="#E07A38"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <motion.div
          className="relative z-10 h-14 w-14 rounded-lg border border-amber/40 bg-gradient-to-br from-[#f4efe6] to-[#d4c4b0]"
          animate={progress > 0 ? { scale: [1, 1.03, 1] } : {}}
          transition={{ repeat: progress > 0 ? Infinity : 0, duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-1 rounded-md border border-white/40 bg-[#1E1C1A]/10"
            style={{ boxShadow: 'inset 0 0 12px rgba(224,122,56,0.35)' }}
          />
        </motion.div>
      </button>
    </div>
  )
}