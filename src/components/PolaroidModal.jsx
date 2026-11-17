import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function PolaroidModal({ open, name, onClose, polaroidAnim }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {polaroidAnim && (
            <motion.div
              className="pointer-events-none absolute bottom-28 z-50 h-28 w-24 rounded-md border border-parchment/30 bg-gradient-to-b from-[#f4efe6] to-[#ddd2c4] shadow-xl"
              initial={{ y: 80, opacity: 0, rotate: -6 }}
              animate={{ y: -120, opacity: 1, rotate: 2 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          )}
          <motion.div
            className="relative w-full max-w-[280px] rounded-2xl border border-border-warm bg-walnut p-5"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 text-warm-gray"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs text-amber">冲印成功</p>
            <h2 className="mt-1 text-lg text-parchment">与 {name} 同频匹配</h2>
            <p className="mt-2 text-sm leading-relaxed text-warm-gray">
              拍立得已吐出，对方已进入 48h 实验室。去完成三关微剧本，让头像逐步显影吧。
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-amber py-2.5 text-sm font-medium text-charcoal"
            >
              进入实验室
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}