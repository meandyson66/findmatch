import { motion } from 'framer-motion'
import { AvatarGlow } from '../AvatarGlow'

export function RadarCanvas({ profiles, onSelect, selectedId }) {
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const rMax = size * 0.42

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-neon/25"
          style={{ width: rMax * 2 * (i / 3), height: rMax * 2 * (i / 3) }}
          initial={{ opacity: 0.15, scale: 0.92 }}
          animate={{ opacity: [0.12, 0.35, 0.12], scale: [0.95, 1.02, 0.95] }}
          transition={{ duration: 3.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-neon/30 to-mint/20"
        style={{ width: 56, height: 56, boxShadow: '0 0 32px rgba(168,85,247,0.5)' }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-parchment">
          你
        </div>
      </motion.div>
      <svg className="pointer-events-none absolute inset-0" width={size} height={size}>
        <motion.line
          x1={cx}
          y1={cy}
          x2={cx + rMax}
          y2={cy}
          stroke="rgba(52,211,153,0.35)"
          strokeWidth={1}
          initial={{ rotate: 0, originX: cx, originY: cy }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      {profiles.map((p) => {
        const rad = (p.angle * Math.PI) / 180
        const dist = p.radius * rMax
        const x = cx + Math.cos(rad) * dist - 22
        const y = cy + Math.sin(rad) * dist - 22
        const active = selectedId === p.id
        return (
          <motion.button
            key={p.id}
            type="button"
            className="absolute z-10"
            style={{ left: x, top: y }}
            onClick={() => onSelect(p.id)}
            whileTap={{ scale: 0.92 }}
            animate={active ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.8, repeat: active ? Infinity : 0 }}
          >
            <AvatarGlow nickname={p.nickname} accent={p.accent} size={44} blur={p.blur} />
          </motion.button>
        )
      })}
    </div>
  )
}