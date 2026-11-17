import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function SheetModal({ open, title, onClose, children, tall }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="glass-scrim absolute inset-0 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`glass-sheet flex w-full flex-col ${
              tall ? 'max-h-[88%]' : 'max-h-[70%]'
            }`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/45 px-4 py-3">
              <h2 className="text-[17px] font-semibold tracking-tight text-momo-text">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-momo-sub active:bg-white/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}