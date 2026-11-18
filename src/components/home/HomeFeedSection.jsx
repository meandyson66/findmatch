import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Pause, Play, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MomoAvatar } from '../MomoAvatar'
import { HOME_FEED_BOARDS, loadHomeFeed } from '../../data/homeFeed'
import { formatRelative } from '../../utils/formatTime'

function slideBg(post, board) {
  const [a, b] = board?.frame ?? ['#3EB575', '#5B8FB9']
  const accent = post.accent ?? a
  return `linear-gradient(135deg, ${accent}55 0%, ${a}44 40%, ${b}38 100%)`
}

function FeedLiquidWindow({ board, posts, onToast, rollMs }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const post = posts[index] ?? posts[0]
  const [a, b] = board.frame ?? ['#3EB575', '#5B8FB9']
  const captionTrack = useMemo(() => [...posts, ...posts], [posts])

  const go = useCallback(
    (delta) => {
      if (posts.length < 2) return
      setIndex((i) => (i + delta + posts.length) % posts.length)
    },
    [posts.length]
  )

  useEffect(() => {
    if (paused || posts.length < 2) return undefined
    const t = setInterval(() => go(1), rollMs)
    return () => clearInterval(t)
  }, [paused, posts.length, go, rollMs])

  if (!post) {
    return (
      <div className="promo-liquid-shell px-3 py-8 text-center text-xs text-momo-sub">暂无内容</div>
    )
  }

  return (
    <article className="promo-liquid-shell relative overflow-hidden">
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

      <div className="relative z-[2] flex items-center justify-between border-b border-white/35 px-3 py-2">
        <div>
          <p className="text-[13px] font-semibold text-momo-text">{board.label}</p>
          <p className="text-[10px] text-momo-sub">{board.desc}</p>
        </div>
        {posts.length > 1 && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex items-center gap-0.5 rounded-full border border-white/50 bg-white/35 px-2 py-1 text-[10px] text-momo-sub"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {paused ? '继续' : '暂停'}
          </button>
        )}
      </div>

      <div className="promo-liquid-stage relative z-[2] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={post.id}
            type="button"
            onClick={() => onToast?.('动态详情页预留，后续可接评论与私信')}
            className="relative block min-h-[132px] w-full overflow-hidden px-3 py-2.5 text-left"
            style={{ background: slideBg(post, board) }}
            initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -24, filter: 'blur(4px)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="promo-slide-glass absolute inset-0" aria-hidden />
            <div className="relative z-[1] flex min-h-[108px] flex-col">
              <div className="flex gap-2.5">
                <MomoAvatar
                    nickname={post.author}
                    accent={post.accent}
                    size={36}
                    imageUrl={post.avatarImage}
                  />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white drop-shadow">
                    {post.author}
                    {post.authorBadge && (
                      <span className="ml-1 text-[10px] font-medium text-white/90">
                        · {post.authorBadge}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-white/85">{formatRelative(post.createdAt)}</p>
                  {post.topicTag && (
                    <p className="mt-0.5 text-[10px] font-medium text-white/95">{post.topicTag}</p>
                  )}
                  <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-white/95">
                    {post.content}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex gap-4 pt-1.5 text-[11px] text-white/90">
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {post.stats?.like ?? 0}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {post.stats?.comment ?? 0}
                </span>
              </div>
            </div>
          </motion.button>
        </AnimatePresence>

        {posts.length > 1 && (
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

      {posts.length > 1 && (
        <div className="promo-caption-marquee-mask relative z-[2] border-t border-white/30 py-1.5">
          <div className={`promo-marquee-track ${paused ? 'promo-marquee-paused' : ''}`}>
            {captionTrack.map((p, i) => (
              <button
                key={`${p.id}-cap-${i}`}
                type="button"
                onClick={() => setIndex(i % posts.length)}
                className={`promo-caption-chip ${i % posts.length === index ? 'promo-caption-chip-active' : ''}`}
              >
                {p.author}：{p.content.length > 16 ? `${p.content.slice(0, 16)}…` : p.content}
              </button>
            ))}
          </div>
        </div>
      )}

      {posts.length > 1 && (
        <div className="relative z-[2] flex justify-center gap-1 pb-2 pt-0.5">
          {posts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`promo-dot ${i === index ? 'promo-dot-active' : ''}`}
              aria-label={`${board.label} 第 ${i + 1} 条`}
            />
          ))}
        </div>
      )}
    </article>
  )
}

export function HomeFeedSection({ onToast }) {
  const all = loadHomeFeed()

  const byBoard = useMemo(() => {
    const map = Object.fromEntries(HOME_FEED_BOARDS.map((b) => [b.id, []]))
    all.forEach((p) => {
      if (map[p.board]) map[p.board].push(p)
    })
    return map
  }, [all])

  const rollIntervals = [4800, 5200, 5600, 5000]

  return (
    <section className="px-3 pb-6 pt-1">
      <motion.div
        className="mb-3 flex items-center gap-1"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
      >
        <Sparkles className="h-3.5 w-3.5 text-momo" />
        <p className="text-[13px] font-medium text-momo-text">交流广场</p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {HOME_FEED_BOARDS.map((board, i) => (
          <motion.div
            key={board.id}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.32 } },
            }}
          >
            <FeedLiquidWindow
              board={board}
              posts={byBoard[board.id] ?? []}
              onToast={onToast}
              rollMs={rollIntervals[i] ?? 5000}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}