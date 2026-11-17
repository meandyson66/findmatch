import { motion } from 'framer-motion'
import { Waves } from 'lucide-react'

export function BottleCard({ bottle, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`glass-card relative w-full overflow-hidden rounded-2xl p-4 text-left transition ${
        active ? 'border-mint/50 shadow-mint' : ''
      }`}
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: bottle.delay,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-2xl"
        style={{ background: bottle.accent }}
      />
      <div className="flex items-center gap-2">
        <Waves className="h-4 w-4" style={{ color: bottle.accent }} />
        <span className="text-sm font-medium text-parchment">{bottle.nickname}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mist">{bottle.mood}</p>
    </motion.button>
  )
}