import { motion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'

export function VinylWave({ label, playing, onToggle, level }) {
  const bars = Array.from({ length: 24 }, (_, i) => i)

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-xl border border-border-warm bg-charcoal/80 px-3 py-2 text-left"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-warm bg-walnut">
        {playing ? <Pause className="h-4 w-4 text-amber" /> : <Play className="h-4 w-4 text-amber" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-warm-gray">声音名片 · {label}</p>
        <div className="mt-1 flex h-6 items-end gap-[2px]">
          {bars.map((i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-amber/80"
              animate={{
                height: playing ? 4 + level * (8 + (i % 5) * 3) * (0.6 + (i % 7) / 10) : 4,
              }}
              transition={{ duration: 0.12 }}
            />
          ))}
        </div>
      </div>
    </button>
  )
}