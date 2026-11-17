import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { SOUL_QUESTIONS } from '../../data/mockData'

export function SoulQuizModal({ open, profile, onClose, onComplete, minMatch = 2 }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [reveal, setReveal] = useState(false)

  const q = SOUL_QUESTIONS[step]

  const handlePick = (optionId) => {
    const next = { ...answers, [q.id]: optionId }
    setAnswers(next)
    setReveal(true)
    setTimeout(() => {
      setReveal(false)
      if (step < SOUL_QUESTIONS.length - 1) setStep((s) => s + 1)
      else {
        const need = Math.max(0, minMatch)
        const matched =
          need === 0 ||
          SOUL_QUESTIONS.filter((item) => next[item.id] === item.partnerPick).length >= need
        onComplete(next, matched)
        setStep(0)
        setAnswers({})
      }
    }, 500)
  }

  const resetAndClose = () => {
    setStep(0)
    setAnswers({})
    setReveal(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && profile && q && (
        <motion.div
          className="glass-scrim absolute inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
        >
          <motion.div
            className="glass-sheet w-full max-w-sm p-4 pb-8"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-xs text-momo-sub">
                  打招呼前 · 默契小测
                  {minMatch === 1 && ' · 黄金特权：答对 1 题即可'}
                </p>
                <h3 className="text-base font-semibold text-momo-text">你和 {profile.nickname} 合不合？</h3>
              </div>
              <button type="button" onClick={resetAndClose} className="text-momo-sub">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-3 text-xs text-momo-sub">第 {step + 1}/3 题</p>
            <p className="mb-4 text-sm text-momo-text">{q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={reveal}
                  onClick={() => handlePick(opt.id)}
                  className="glass-input w-full px-3 py-3 text-left text-sm text-momo-text active:bg-white/55 disabled:opacity-60"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {reveal && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-xs text-momo"
              >
                {answers[q.id] === q.partnerPick ? '默契 +1' : '继续下一题~'}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}