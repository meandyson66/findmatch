import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Megaphone, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadHomePromos } from '../../data/homePromos'

function slideBg(item) {
  const [a, b] = item.accent ?? ['#5B8FB9', '#3EB575']
  return `linear-gradient(135deg, ${a}ee 0%, ${b}cc 55%, ${a}99 100%)`
}

export function HomePromoShowcase({ onNavigate, onToast }) {
  const items = loadHomePromos()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef(null)
  const item = items[index] ?? items[0]
  const [a, b] = item?.accent ?? ['#5B8FB9', '#3EB575']

  const captionTrack = useMemo(() => [...items, ...items], [items])

  const go = useCallback(
    (delta) => {
      setVideoPlaying(false)
      setIndex((i) => (i + delta + items.length) % items.length)
    },
    [items.length]
  )

  useEffect(() => {
    if (paused || items.length < 2 || item?.type === 'video') return undefined
    const t = setInterval(() => go(1), 5000)
    return () => clearInterval(t)
  }, [paused, items.length, item?.type, go])

  useEffect(() => {
    setVideoPlaying(false)
  }, [index])

  if (!item) return null

  const handleAction = () => {
    if (item.type === 'video') {
      if (item.videoSrc && videoRef.current) {
        if (videoPlaying) {
          videoRef.current.pause()
          setVideoPlaying(false)
        } else {
          videoRef.current.play().catch(() => onToast?.('演示环境暂无视频文件，可配置 videoSrc'))
          setVideoPlaying(true)
        }
        return
      }
      onToast?.('视频位已预留：在 homePromos 配置 videoSrc 即可播放')
      setVideoPlaying((v) => !v)
      return
    }
    if (item.action?.tab) onNavigate?.(item.action.tab)
    else if (item.link) window.open(item.link, '_blank', 'noopener,noreferrer')
    else onToast?.(item.title)
  }

  return (
    <div className="mt-2 px-3">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="flex items-center gap-1 text-[10px] font-medium text-momo-sub">
          <Megaphone className="h-3 w-3" />
          焦点展示
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="flex items-center gap-0.5 text-[10px] text-momo-sub"
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? '继续轮播' : '暂停'}
        </button>
      </div>

      <div className="promo-liquid-shell relative overflow-hidden">
        <span
          className="promo-liquid-orb promo-liquid-orb-a pointer-events-none"
          style={{ background: `radial-gradient(circle, ${a}66, transparent 70%)` }}
          aria-hidden
        />
        <span
          className="promo-liquid-orb promo-liquid-orb-b pointer-events-none"
          style={{ background: `radial-gradient(circle, ${b}55, transparent 68%)` }}
          aria-hidden
        />
        <span className="promo-liquid-shine pointer-events-none" aria-hidden />
        <span
          className="promo-liquid-blob pointer-events-none"
          style={{ background: `linear-gradient(145deg, ${a}33, ${b}22)` }}
          aria-hidden
        />

        <div className="promo-liquid-stage relative z-[2] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={item.id}
              type="button"
              onClick={handleAction}
              className="relative block h-[140px] w-full overflow-hidden text-left"
              initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -24, filter: 'blur(4px)' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: item.imageUrl ? undefined : slideBg(item) }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {item.type === 'video' && item.videoSrc && (
                <video
                  ref={videoRef}
                  src={item.videoSrc}
                  poster={item.videoPoster}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  muted
                  loop
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <VideoOverlay
                type={item.type}
                videoPlaying={videoPlaying}
                hasVideoSrc={Boolean(item.videoSrc)}
              />
              <div className="promo-slide-glass absolute inset-0" aria-hidden />
              <div className="absolute bottom-0 left-0 right-0 z-[1] p-3 pt-8">
                <p className="text-[16px] font-semibold leading-tight text-white drop-shadow-md">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-white/92">{item.subtitle}</p>
                )}
              </div>
            </motion.button>
          </AnimatePresence>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                className="promo-nav-btn absolute left-1.5 top-1/2 z-10 -translate-y-1/2"
                aria-label="上一条"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                className="promo-nav-btn absolute right-1.5 top-1/2 z-10 -translate-y-1/2"
                aria-label="下一条"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="promo-caption-marquee-mask relative z-[2] border-t border-white/30 py-1.5">
          <div className={`promo-marquee-track ${paused ? 'promo-marquee-paused' : ''}`}>
            {captionTrack.map((p, i) => (
              <button
                key={`${p.id}-cap-${i}`}
                type="button"
                onClick={() => setIndex(i % items.length)}
                className={`promo-caption-chip ${i % items.length === index ? 'promo-caption-chip-active' : ''}`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {items.length > 1 && (
          <div className="relative z-[2] flex justify-center gap-1 pb-2 pt-0.5">
            {items.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`promo-dot ${i === index ? 'promo-dot-active' : ''}`}
                aria-label={`第 ${i + 1} 条`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function VideoOverlay({ type, videoPlaying, hasVideoSrc }) {
  if (type !== 'video') return null
  return (
    <div className="absolute inset-0 z-[1] flex items-center justify-center">
      <span
        className={`promo-play-orb flex h-12 w-12 items-center justify-center ${
          videoPlaying && hasVideoSrc ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Play className="h-6 w-6 fill-white text-white" />
      </span>
    </div>
  )
}