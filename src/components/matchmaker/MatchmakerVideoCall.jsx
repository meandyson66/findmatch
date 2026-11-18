import { motion } from 'framer-motion'
import { Mic, MicOff, PhoneOff, Sparkles, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MomoAvatar } from '../MomoAvatar'

function SakuraPetals() {
  return (
    <div className="sakura-petals-layer pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="sakura-petal" style={{ '--i': i }} />
      ))}
    </div>
  )
}

function formatDuration(totalSec) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function MatchmakerVideoCall({ matchmaker, mode = 'video', onClose }) {
  const [secs, setSecs] = useState(0)
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(mode === 'video')
  const accent = matchmaker?.accent?.[0] ?? '#F9A8D4'
  const accentB = matchmaker?.accent?.[1] ?? '#FDA4AF'

  useEffect(() => {
    const t = setInterval(() => setSecs((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const isVideo = mode === 'video' && cameraOn

  return (
    <motion.div
      className="sakura-call-screen absolute inset-0 z-[80] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SakuraPetals />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(165deg, #fff5f7 0%, #ffe4ec 35%, ${accent}22 70%, #fdf2f8 100%)`,
        }}
        aria-hidden
      />

      <header className="relative z-[2] flex shrink-0 items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-medium text-rose-800/80">
            <Sparkles className="h-3 w-3" />
            樱花专线 · 演示连线
          </p>
          <p className="truncate text-[15px] font-semibold text-rose-950">{matchmaker?.name}</p>
        </div>
        <span className="rounded-full border border-white/70 bg-white/55 px-2.5 py-1 text-[11px] font-medium tabular-nums text-rose-900 backdrop-blur-md">
          {formatDuration(secs)}
        </span>
      </header>

      <div className="relative z-[2] min-h-0 flex-1 px-4 pb-2">
        <div className="sakura-call-main relative h-full overflow-hidden rounded-[1.35rem] border border-white/75 shadow-[0_20px_50px_rgba(251,113,133,0.25)]">
          {isVideo ? (
            <>
              <img
                src={matchmaker?.avatarImage}
                alt=""
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/55 via-transparent to-rose-100/20" />
              <p className="absolute bottom-14 left-3 right-3 text-center text-[11px] text-white/90">
                演示画面 · 红娘出镜预览（未连接真实音视频）
              </p>
            </>
          ) : (
            <div
              className="flex h-full flex-col items-center justify-center gap-3 px-6"
              style={{ background: `linear-gradient(145deg, ${accent}33, ${accentB}44)` }}
            >
              <MomoAvatar
                nickname={matchmaker?.name}
                accent={accent}
                size={96}
                emoji={matchmaker?.emoji}
                imageUrl={matchmaker?.avatarImage}
              />
              <p className="text-center text-sm font-medium text-rose-950">语音樱花房</p>
              <p className="text-center text-[11px] text-rose-900/75">声波模拟中… 请佩戴耳机体验氛围</p>
            </div>
          )}

          <div className="sakura-call-pip absolute bottom-3 right-3 h-[88px] w-[68px] overflow-hidden rounded-xl border-2 border-white/85 shadow-lg">
            {cameraOn ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200 text-[10px] text-rose-800">
                我
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-rose-950/40 text-[10px] text-white">
                摄像头关
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-[2] shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="sakura-call-btn"
            aria-label={muted ? '取消静音' : '静音'}
          >
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          {mode === 'video' && (
            <button
              type="button"
              onClick={() => setCameraOn((v) => !v)}
              className="sakura-call-btn"
              aria-label={cameraOn ? '关闭摄像头' : '打开摄像头'}
            >
              <Video className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="sakura-call-btn sakura-call-btn-hangup"
            aria-label="挂断"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-rose-900/65">
          挂断后返回私信，可继续文字沟通
        </p>
      </div>
    </motion.div>
  )
}