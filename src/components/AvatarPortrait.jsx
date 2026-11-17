import { motion, useReducedMotion } from 'framer-motion'

const BLUR_EASE = [0.22, 1, 0.36, 1]

export function AvatarPortrait({
  src,
  gradient,
  blurPx = 22,
  className = '',
  alt = '',
  transitionDuration = 1.4,
}) {
  const reduced = useReducedMotion()
  const g = gradient?.length ? gradient : ['#2e2a26', '#5a4a3a', '#9c958b']
  const targetBlur = reduced ? 0 : blurPx

  return (
    <div className={`relative overflow-hidden bg-border-warm ${className}`}>
      {!src && (
        <div
          className="absolute inset-0 scale-110"
          style={{
            background: `linear-gradient(135deg, ${g[0]} 0%, ${g[1]} 45%, ${g[2]} 100%)`,
          }}
        />
      )}
      {src && (
        <motion.img
          src={src}
          alt={alt}
          decoding="async"
          draggable={false}
          className="avatar-portrait-img pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover"
          initial={false}
          animate={{
            filter: `blur(${targetBlur}px)`,
            scale: 1.1 + targetBlur * 0.004,
          }}
          transition={{
            filter: { duration: transitionDuration, ease: BLUR_EASE },
            scale: { duration: transitionDuration, ease: BLUR_EASE },
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <motion.div
        className="film-grain pointer-events-none absolute inset-0"
        animate={{ opacity: 0.08 + (targetBlur / 22) * 0.1 }}
        transition={{ duration: transitionDuration, ease: BLUR_EASE }}
      />
    </div>
  )
}

export function AvatarReveal({ src, gradient, alt = '' }) {
  const g = gradient?.length ? gradient : ['#2e2a26', '#5a4a3a', '#9c958b']
  return (
    <div className="relative h-36 overflow-hidden bg-border-warm">
      {!src && (
        <div
          className="h-full w-full"
          style={{ background: `linear-gradient(135deg, ${g.join(', ')})` }}
        />
      )}
      {src && (
        <motion.img
          src={src}
          alt={alt}
          className="avatar-portrait-img h-full w-full object-cover"
          initial={{ filter: 'blur(18px)', scale: 1.08, opacity: 0.85 }}
          animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
          transition={{
            filter: { duration: 1.6, ease: BLUR_EASE },
            scale: { duration: 1.6, ease: BLUR_EASE },
            opacity: { duration: 1.2, ease: 'easeOut' },
          }}
        />
      )}
      <div className="film-grain pointer-events-none absolute inset-0 opacity-[0.06]" />
    </div>
  )
}