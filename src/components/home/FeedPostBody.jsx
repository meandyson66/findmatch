import { useEffect, useState } from 'react'
import { Mic, Pause, Play } from 'lucide-react'

function FeedVoiceChip({ durationSec = 3, accent = '#3EB575' }) {
  const [playing, setPlaying] = useState(false)
  const [bars, setBars] = useState(() => Array(12).fill(0.35))

  useEffect(() => {
    if (!playing) {
      setBars(Array(12).fill(0.25))
      return undefined
    }
    const tick = setInterval(() => {
      setBars(Array.from({ length: 12 }, () => 0.15 + Math.random() * 0.85))
    }, 110)
    const stop = setTimeout(() => setPlaying(false), (durationSec ?? 3) * 1000)
    return () => {
      clearInterval(tick)
      clearTimeout(stop)
    }
  }, [playing, durationSec])

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setPlaying((p) => !p)
      }}
      className="mt-2 flex w-full items-center gap-2 rounded-xl border border-white/45 bg-black/20 px-2.5 py-2 text-left backdrop-blur-sm"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
      </span>
      <div className="flex min-w-0 flex-1 items-end gap-0.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-white/85"
            style={{ height: `${6 + h * 18}px` }}
          />
        ))}
      </div>
      <span className="shrink-0 text-[10px] text-white/90">{durationSec ?? 3}s</span>
      <Mic className="h-3 w-3 shrink-0 text-white/80" />
    </button>
  )
}

export function FeedPostBody({ post, compact }) {
  const type = post.mediaType ?? 'text'
  const lineClamp = compact ? 'line-clamp-2' : 'line-clamp-3'

  return (
    <>
      {type === 'image' && post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt=""
          className="mt-2 max-h-28 w-full rounded-lg border border-white/35 object-cover"
        />
      )}
      {type === 'video' && (
        <div className="relative mt-2 overflow-hidden rounded-lg border border-white/35">
          {post.mediaUrl ? (
            <video
              src={post.mediaUrl}
              poster={post.mediaPoster ?? undefined}
              className="max-h-28 w-full object-cover"
              controls
              playsInline
              preload="metadata"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <motionlessVideoPoster post={post} />
          )}
        </div>
      )}
      {type === 'voice' && (
        <FeedVoiceChip durationSec={post.voiceSec ?? 3} accent={post.accent} />
      )}
      {(type === 'text' || post.content) && (
        <p className={`mt-1 ${lineClamp} text-[13px] leading-snug text-white/95`}>{post.content}</p>
      )}
    </>
  )
}

function motionlessVideoPoster({ post }) {
  const poster = post.mediaPoster ?? post.mediaUrl
  return (
    <div className="relative max-h-28 w-full bg-black/25">
      {poster ? (
        <img src={poster} alt="" className="max-h-28 w-full object-cover opacity-90" />
      ) : (
        <div className="flex h-24 items-center justify-center text-xs text-white/80">演示视频</div>
      )}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-black/45 px-3 py-1 text-[10px] text-white">演示视频位</span>
      </span>
    </div>
  )
}