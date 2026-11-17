import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AvatarReveal } from '../AvatarPortrait'
import { CoffeeVoucher } from './CoffeeVoucher'

export function LevelCrisis({ partner, done, choice, onComplete, locked }) {
  const [pending, setPending] = useState(false)
  const [showVoucher, setShowVoucher] = useState(done)

  useEffect(() => {
    if (done) setShowVoucher(true)
  }, [done])

  const pick = (id) => {
    if (done || locked || pending) return
    setPending(true)
    setTimeout(() => {
      onComplete(id)
      setShowVoucher(true)
      setPending(false)
    }, 1200)
  }

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
        <span className="text-xs text-amber">第三关 · AI 危机模拟局</span>
        {done && <Check className="h-4 w-4 text-ice-blue" />}
      </header>
      {!done ? (
        <div className="space-y-3 p-3">
          <p className="text-sm text-parchment">{partner.level3.question}</p>
          {partner.level3.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={pending}
              onClick={() => pick(opt.id)}
              className="w-full rounded-lg border border-border-warm px-3 py-2.5 text-left text-sm text-warm-gray hover:border-amber/50"
            >
              {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <motion.div className="space-y-2 p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="overflow-hidden rounded-lg border border-border-warm"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <AvatarReveal
              src={partner.avatarUrl}
              gradient={partner.avatarGradient}
              alt={partner.nickname}
            />
          </motion.div>
          <p className="text-xs text-parchment">{partner.level3.insight}</p>
          <p className="text-[10px] text-amber">照片 100% 高清显影</p>
        </motion.div>
      )}
      {showVoucher && (
        <div className="border-t border-border-warm p-3">
          <CoffeeVoucher />
        </div>
      )}
    </section>
  )
}