import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  HeartHandshake,
  MessageCircle,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MomoAvatar } from '../MomoAvatar'
import {
  HOME_FEED_BOARDS,
  HOME_FEED_PAGE_SIZE,
  addHomeFeedPost,
  createUserFeedPost,
  loadHomeFeed,
} from '../../data/homeFeed'
import { useApp } from '../../context/AppContext'
import { isIdentityVerified } from '../../utils/identity'
import { formatRelative } from '../../utils/formatTime'
import { FeedPostBody } from './FeedPostBody'
import { FEED_PUBLISH_TYPES, FeedPublishSheet } from './FeedPublishSheet'

const BOARD_VISUAL = {
  featured: { icon: Sparkles, tone: '精选' },
  topic: { icon: Flame, tone: '热议' },
  group: { icon: Users, tone: '圈子' },
  match: { icon: HeartHandshake, tone: '牵线' },
}

function FeedPlazaBoundary({ board }) {
  const Icon = BOARD_VISUAL[board.id]?.icon ?? Sparkles
  const [a, b] = board.frame ?? ['#3EB575', '#5B8FB9']
  return (
    <div
      className={`feed-plaza-boundary feed-plaza-boundary--${board.id}`}
      role="separator"
      aria-label={board.label}
      style={{ '--feed-board-a': a, '--feed-board-b': b }}
    >
      <span className="feed-plaza-boundary-beam" aria-hidden />
      <motion.div
        className="feed-plaza-boundary-core"
        initial={{ scale: 0.82, opacity: 0.6 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      >
        <span className="feed-plaza-boundary-ring feed-plaza-boundary-ring-a" aria-hidden />
        <span className="feed-plaza-boundary-ring feed-plaza-boundary-ring-b" aria-hidden />
        <span className="feed-plaza-boundary-icon">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </motion.div>
      <span className="feed-plaza-boundary-beam" aria-hidden />
    </div>
  )
}

function slideBg(post, board) {
  const [a, b] = board?.frame ?? ['#3EB575', '#5B8FB9']
  const accent = post.accent ?? a
  return `linear-gradient(135deg, ${accent}55 0%, ${a}44 40%, ${b}38 100%)`
}

function FeedPlazaPost({ post, board, onToast, displayIndex }) {
  return (
    <button
      type="button"
      onClick={() => onToast?.('动态详情页预留，后续可接评论与私信')}
      className="feed-plaza-post relative block w-full overflow-hidden px-3 py-3 text-left"
      style={{ background: slideBg(post, board) }}
    >
      <span className="feed-plaza-post-index" aria-hidden>
        {String(displayIndex).padStart(2, '0')}
      </span>
      <div className="promo-slide-glass absolute inset-0" aria-hidden />
      <div className="relative z-[1] flex gap-3">
        <MomoAvatar
          nickname={post.author}
          accent={post.accent}
          size={42}
          imageUrl={post.avatarImage}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <p className="text-sm font-semibold text-white drop-shadow">{post.author}</p>
            {post.authorBadge && (
              <span className="text-[10px] font-medium text-white/90">· {post.authorBadge}</span>
            )}
            <span className="text-[10px] text-white/75">· {formatRelative(post.createdAt)}</span>
          </div>
          {post.topicTag && (
            <p className="mt-0.5 text-[10px] font-medium text-white/95">{post.topicTag}</p>
          )}
          <FeedPostBody post={post} expanded />
          <div className="mt-2 flex gap-4 text-[11px] text-white/90">
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
      </div>
    </button>
  )
}

function FeedPlazaPager({ page, totalPages, totalCount, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav
      className="feed-plaza-pager relative z-[2]"
      aria-label="翻页查看更多"
    >
      <button
        type="button"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
        className="feed-plaza-pager-btn"
        aria-label="上一页"
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </button>
      <div className="feed-plaza-pager-meta">
        <span className="feed-plaza-pager-page">
          第 {page + 1} / {totalPages} 页
        </span>
        <span className="text-momo-sub/80">共 {totalCount} 条</span>
      </div>
      <button
        type="button"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="feed-plaza-pager-btn"
        aria-label="下一页"
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

function FeedLiquidWindow({ board, allPosts, onToast, onCompose }) {
  const [a, b] = board.frame ?? ['#3EB575', '#5B8FB9']
  const visual = BOARD_VISUAL[board.id] ?? BOARD_VISUAL.featured
  const Icon = visual.icon
  const totalCount = allPosts.length
  const totalPages = Math.max(1, Math.ceil(totalCount / HOME_FEED_PAGE_SIZE))
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [board.id, totalCount])

  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1))
  }, [page, totalPages])

  const pageStart = page * HOME_FEED_PAGE_SIZE
  const posts = allPosts.slice(pageStart, pageStart + HOME_FEED_PAGE_SIZE)

  if (!totalCount) {
    return (
      <div
        className={`promo-liquid-shell feed-plaza-board feed-plaza-board--${board.id} px-3 py-8 text-center text-xs text-momo-sub`}
        style={{ '--feed-board-a': a, '--feed-board-b': b }}
      >
        暂无内容
      </div>
    )
  }

  return (
    <article
      className={`promo-liquid-shell feed-plaza-board feed-plaza-board--${board.id} relative overflow-hidden`}
      style={{ '--feed-board-a': a, '--feed-board-b': b }}
    >
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

      <header className="feed-plaza-board-hero relative z-[2]">
        <div className="feed-plaza-board-hero-bar" aria-hidden />
        <div className="relative flex items-start gap-3 px-3 py-3">
          <div className="feed-plaza-board-icon" aria-hidden>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`feed-plaza-board-eyebrow feed-plaza-board-eyebrow--${board.id}`}>
              {visual.tone}
            </p>
            <h3 className={`feed-plaza-board-title feed-plaza-board-title--${board.id}`}>
              {board.label}
            </h3>
            <p className="mt-0.5 text-[11px] text-white/85">{board.desc}</p>
          </div>
          <span className="feed-plaza-board-count shrink-0">
            {totalPages > 1 ? `第${page + 1}页 · ` : ''}
            {totalCount} 条
          </span>
        </div>
      </header>

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

      <div className="feed-plaza-list relative z-[2]">
        {posts.map((post, i) => (
          <FeedPlazaPost
            key={post.id}
            post={post}
            board={board}
            onToast={onToast}
            displayIndex={pageStart + i + 1}
          />
        ))}
      </div>

      <FeedPlazaPager
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
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
        className="feed-plaza-stack"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {HOME_FEED_BOARDS.map((board, sectionIndex) => {
          const allPosts = byBoard[board.id] ?? []
          return (
            <motion.div
              key={board.id}
              className="feed-plaza-section"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.32 } },
              }}
            >
              {sectionIndex > 0 && <FeedPlazaBoundary board={board} />}
              <FeedLiquidWindow
                board={board}
                allPosts={allPosts}
                onToast={onToast}
                onCompose={requestCompose}
              />
            </motion.div>
          )
        })}
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