import { motion } from 'framer-motion'
import { Check, Disc3 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LevelVinyl({ partner, done, picks, onComplete, locked }) {
  const [selected, setSelected] = useState(picks ?? [])
  const [merged, setMerged] = useState(done)

  const toggle = (id) => {
    if (done || locked) return
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const synthesize = () => {
    if (selected.length !== 3 || done) return
    setMerged(true)
    onComplete(selected)
  }

  useEffect(() => {
    if (done) setMerged(true)
  }, [done])

  return (
    <section
      className={`rounded-xl border bg-walnut/80 overflow-hidden ${
        locked
          ? 'opacity-50 pointer-events-none border-border-warm'
          : done
            ? 'border-border-warm'
            : 'border-amber/40 shadow-[0_0_20px_rgba(224,122,56,0.12)]'
      }`}
    >
      <header className="flex items-center justify-between border-b border-border-warm/80 px-3 py-2">
        <span className="text-xs text-amber">第二关 · 共创黑胶歌单</span>
        {done && <Check className="h-4 w-4 text-ice-blue" />}
      </header>
      {!done ? (
        <div className="space-y-2 p-3">
          <p className="text-[11px] text-warm-gray">勾选 3 首，合成双人唱片封面</p>
          <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {partner.level2.songs.map((song) => {
              const on = selected.includes(song.id)
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => toggle(song.id)}
                  className={`flex w-full items-start gap-2 rounded-lg border px-2 py-2 text-left text-xs ${
                    on ? 'border-amber bg-amber/10' : 'border-border-warm'
                  }`}
                >
                  <span className={`mt-0.5 h-3 w-3 rounded-sm border ${on ? 'bg-amber border-amber' : 'border-warm-gray'}`} />
                  <span>
                    <span className="text-parchment">{song.title}</span>
                    <span className="text-warm-gray"> · {song.artist}</span>
                    <br />
                    <span className="text-[10px] text-warm-gray">{song.note}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            disabled={selected.length !== 3}
            onClick={synthesize}
            className="w-full rounded-lg bg-amber py-2 text-sm font-medium text-charcoal disabled:opacity-40"
          >
            合成黑胶 ({selected.length}/3)
          </button>
        </div>
      ) : (
        <motion.div className="flex gap-3 p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="relative h-20 w-20 shrink-0 rounded-full border-2 border-parchment/20 bg-gradient-to-br from-charcoal to-walnut flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            <Disc3 className="h-10 w-10 text-amber/80" />
            <div className="absolute inset-2 rounded-full border border-amber/30" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-ice-blue">纪念票根 · 双人封面</p>
            <p className="mt-1 text-xs leading-relaxed text-parchment">{partner.level2.review}</p>
            <p className="mt-1 text-[10px] text-amber">照片 75%</p>
          </div>
        </motion.div>
      )}
    </section>
  )
}