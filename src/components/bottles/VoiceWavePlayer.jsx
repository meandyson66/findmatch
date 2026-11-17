import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Mic } from 'lucide-react'

const BAR_COUNT = 24

export function VoiceWavePlayer({ playing, durationMs = 10000, onEnded }) {
  const [bars, setBars] = useState(() => Array(BAR_COUNT).fill(0.3))

  useEffect(() => {
    if (!playing) {
      setBars(Array(BAR_COUNT).fill(0.25))
      return undefined
    }
    const tick = setInterval(() => {
      setBars(
        Array.from({ length: BAR_COUNT }, () => 0.2 + Math.random() * 0.8)
      )
    }, 120)
    const stop = setTimeout(() => {
      clearInterval(tick)
      onEnded?.()
    }, durationMs)
    return () => {
      clearInterval(tick)
      clearTimeout(stop)
    }
  }, [playing, durationMs, onEnded])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-16 items-end justify-center gap-1">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-neon to-mint"
            animate={{ height: 8 + h * 48 }}
            transition={{ duration: 0.12 }}
          />
        ))}
      </div>
      <p className="flex items-center gap-1 text-xs text-mist">
        <Mic className="h-3.5 w-3.5 text-neon" />
        {playing ? '播放声波名片…' : '点击瓶子收听 10 秒模拟语音'}
      </p>
    </div>
  )
}