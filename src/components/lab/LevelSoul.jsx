import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

export function LevelSoul({ partner, done, choice, onComplete }) {
  const [pending, setPending] = useState(null)
  const [reveal, setReveal] = useState(done)

  const pick = (id) => {
    if (done || pending) return
    setPending(id)
    setTimeout(() => {
      onComplete(id)
      setReveal(true)
      setPending(null)
    }, 1500)
  }

  useEffect(() => {
    if (done) setReveal(true)
  }, [done])

  const collapsed = done

  return (
    <section
      className={`rounded-xl border bg-walnut/80 overflow-hidden ${
        collapsed ? 'border-border-warm' : 'border-amber/40 shadow-[0_0_20px_rgba(224,122,56,0.12)]'
      }`}
    >
      <header className="flex items-center justify-between border-b border-border-warm/80 px-3 py-2">
        <span className="text-xs text-amber">第一关 · 灵魂二选一</span>
        {collapsed && <Check className="h-4 w-4 text-ice-blue" />}
      </header>
      {!collapsed ? (
        <div className="space-y-3 p-3">
          <p className="text-sm text-parchment">{partner.level1.question}</p>
          {partner.level1.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={!!pending}
              onClick={() => pick(opt.id)}
              className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                pending === opt.id
                  ? 'border-amber bg-amber/10 text-parchment'
                  : 'border-border-warm text-warm-gray hover:border-amber/50'
              }`}
            >
              {opt.text}
            </button>
          ))}
          {pending && (
            <p className="animate-pulse text-center text-[11px] text-warm-gray">显影中…</p>
          )}
        </div>
      ) : (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-3 py-2">
          <div className="rounded-lg border border-dashed border-ice-blue/40 bg-charcoal/50 px-3 py-2">
            <p className="text-[10px] text-ice-blue">纪念票根</p>
            <p className="mt-1 text-xs text-parchment">{partner.level1.insight}</p>
            <p className="mt-1 text-[10px] text-warm-gray">
              你的选择：{partner.level1.options.find((o) => o.id === choice)?.text}
            </p>
          </div>
        </motion.div>
      )}
      {reveal && !collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-border-warm bg-charcoal/40 px-3 py-2 text-xs text-parchment"
        >
          {partner.level1.insight}
          <span className="ml-2 text-amber">照片 40%</span>
        </motion.div>
      )}
    </section>
  )
}