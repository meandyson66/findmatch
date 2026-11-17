import { motion } from 'framer-motion'
import { emotionColor } from '../../data/storage'

export function EmotionBar({ lab }) {
  const color = emotionColor(lab)
  return (
    <motion.div
      className="h-1 w-full rounded-full"
      animate={{
        background: `linear-gradient(90deg, #5B8FB9 0%, ${color} 55%, #E07A38 100%)`,
        boxShadow: [`0 0 8px ${color}33`, `0 0 22px ${color}66`, `0 0 8px ${color}33`],
        opacity: [0.75, 1, 0.75],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}