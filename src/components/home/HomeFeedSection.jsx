import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MomoAvatar } from '../MomoAvatar'
import {
  HOME_FEED_BOARDS,
  addHomeFeedPost,
  createUserFeedPost,
  loadHomeFeed,
} from '../../data/homeFeed'
import { useApp } from '../../context/AppContext'
import { isIdentityVerified } from '../../utils/identity'
import { formatRelative } from '../../utils/formatTime'
import { FeedPostBody } from './FeedPostBody'
import { FEED_PUBLISH_TYPES, FeedPublishSheet } from './FeedPublishSheet'

function slideBg(post, board) {
  const [a, b] = board?.frame ?? ['#3EB575', '#5B8FB9']
  const accent = post.accent ?? a
  return `linear-gradient(135deg, ${accent}55 0%, ${a}44 40%, ${b}38 100%)`
}

function FeedLiquidWindow({ board, posts, onToast, rollMs, onCompose }) {
  const [index, setIndex] = useState(0)
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
    if (posts.length < 2) return undefined
    const t = setInterval(() => go(1), rollMs)
    return () => clearInterval(t)
  }, [posts.length, go, rollMs])

  useEffect(() => {
    setIndex(0)
  }, [posts[0]?.id])

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

      <div className="relative z-[2] border-b border-white/35 px-3 py-2">
        <p className="text-[13px] font-semibold text-momo-text">{board.label}</p>
        <p className="text-[10px] text-momo-sub">{board.desc}</p>
      </div>

      <div className="relative z-[2] flex flex-wrap items-center gap-1 border-b border-white/30 px-2 py-2">
        {FEED_PUBLISH_TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onCompose?.(board, id)}
            className="feed-compose-chip inline-flex items-center gap-0.5"
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="promo-liquid-stage relative z-[2] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={post.id}
            type="button"
            onClick={() => onToast?.('动态详情页预留，后续可接评论与私信')}
            className="relative block min-h-[148px] w-full overflow-hidden px-3 py-2.5 text-left"
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
                  <FeedPostBody post={post} compact />
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
          <div className="promo-marquee-track">
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
  const { state, openRealNameVerify } = useApp()
  const [feedPosts, setFeedPosts] = useState(() => loadHomeFeed())
  const [publish, setPublish] = useState(null)

  const byBoard = useMemo(() => {
    const map = Object.fromEntries(HOME_FEED_BOARDS.map((b) => [b.id, []]))
    feedPosts.forEach((p) => {
      if (map[p.board]) map[p.board].push(p)
    })
    return map
  }, [feedPosts])

  const requestCompose = (board, mediaType) => {
    if (!isIdentityVerified(state.user)) {
      onToast?.('实名后可发布到交流广场')
      openRealNameVerify()
      return
    }
    setPublish({ boardId: board.id, boardLabel: board.label, mediaType })
  }

  const submitPublish = (payload) => {
    const entry = createUserFeedPost({
      board: publish.boardId,
      user: state.user,
      ...payload,
    })
    const saved = addHomeFeedPost(entry)
    if (!saved) {
      onToast?.('保存失败，图片可能过大')
      return
    }
    setFeedPosts(loadHomeFeed())
    setPublish(null)
    onToast?.(`已发布到${publish.boardLabel}`)
  }

  const rollIntervals = [4800, 5200, 5600, 5000]

  return (
    <section className="px-3 pb-6 pt-1">
      <motion.div
        className="mb-3 flex items-center gap-1"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
      >
        <Sparkles className="home-plaza-title-icon h-3.5 w-3.5 text-violet-500" aria-hidden />
        <p className="home-plaza-glow-title" aria-label="交流广场">
          {'交流广场'.split('').map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className="home-plaza-glow-char"
              style={{ animationDelay: `${i * 0.14}s` }}
            >
              {ch}
            </span>
          ))}
        </p>
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
              onCompose={requestCompose}
            />
          </motion.div>
        ))}
      </motion.div>

      <FeedPublishSheet
        open={Boolean(publish)}
        boardLabel={publish?.boardLabel}
        mediaType={publish?.mediaType}
        onClose={() => setPublish(null)}
        onSubmit={submitPublish}
      />
    </section>
  )
}