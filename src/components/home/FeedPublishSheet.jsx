import { useEffect, useRef, useState } from 'react'
import { Image, Mic, Type, Video } from 'lucide-react'
import { resolveDemoScene } from '../../data/demoAvatars'
import { SheetModal } from '../me/SheetModal'

const TYPE_META = {
  text: { title: '发文字', icon: Type },
  image: { title: '发图片', icon: Image },
  video: { title: '发视频', icon: Video },
  voice: { title: '发语音', icon: Mic },
}

export function FeedPublishSheet({ open, boardLabel, mediaType, onClose, onSubmit }) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaPoster, setMediaPoster] = useState(null)
  const [recording, setRecording] = useState(false)
  const [voiceSec, setVoiceSec] = useState(0)
  const recordTimer = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!open) {
      setText('')
      setPreview(null)
      setMediaUrl(null)
      setMediaPoster(null)
      setRecording(false)
      setVoiceSec(0)
    }
  }, [open, mediaType])

  useEffect(() => () => clearInterval(recordTimer.current), [])

  if (!mediaType) return null
  const meta = TYPE_META[mediaType]

  const readImage = (file) => {
    if (!file) return
    if (file.size > 900_000) {
      window.alert?.('图片过大，演示版请选用 900KB 以内的图片')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result)
      setPreview(url)
      setMediaUrl(url)
    }
    reader.readAsDataURL(file)
  }

  const readVideo = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setMediaUrl(url)
    setMediaPoster(null)
    setPreview(url)
  }

  const startVoice = () => {
    if (recording) return
    setRecording(true)
    setVoiceSec(0)
    const started = Date.now()
    recordTimer.current = setInterval(() => {
      const s = Math.floor((Date.now() - started) / 1000)
      setVoiceSec(s)
      if (s >= 8) stopVoice()
    }, 200)
  }

  const stopVoice = () => {
    clearInterval(recordTimer.current)
    setRecording(false)
    if (voiceSec < 1) setVoiceSec(1)
  }

  const handleSubmit = () => {
    if (mediaType === 'text' && !text.trim()) return
    if (mediaType === 'image' && !mediaUrl) return
    if (mediaType === 'video' && !mediaUrl && !mediaPoster) return

    let payload = { mediaType, content: text.trim() }
    if (mediaType === 'image') payload = { ...payload, mediaUrl }
    if (mediaType === 'video') {
      payload = {
        ...payload,
        mediaUrl,
        mediaPoster: mediaPoster ?? resolveDemoScene('dating'),
      }
    }
    if (mediaType === 'voice') {
      if (recording) stopVoice()
      const sec = Math.max(1, Math.min(8, voiceSec || 3))
      payload = {
        ...payload,
        content: text.trim() || `语音动态 · ${sec} 秒`,
        voiceSec: sec,
      }
    }
    onSubmit?.(payload)
  }

  return (
    <SheetModal
      open={open}
      title={`${meta.title} · ${boardLabel ?? '板块'}`}
      onClose={onClose}
      tall
      pinToViewport
    >
      <div className="space-y-4 px-4 py-4">
        {(mediaType === 'text' ||
          mediaType === 'image' ||
          mediaType === 'video' ||
          mediaType === 'voice') && (
          <div>
            <p className="mb-1 text-[11px] text-momo-sub">配文（可选）</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mediaType === 'text' ? '分享这一刻的想法…' : '给这条动态加一句说明…'
              }
              rows={mediaType === 'text' ? 5 : 2}
              className="glass-input w-full resize-none px-3 py-2 text-sm text-momo-text outline-none"
            />
          </div>
        )}

        {mediaType === 'image' && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => readImage(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="glass-primary-btn w-full rounded-xl py-2.5 text-sm"
            >
              从相册选择图片
            </button>
            {preview && (
              <img src={preview} alt="" className="mt-3 max-h-48 w-full rounded-xl object-cover" />
            )}
          </div>
        )}

        {mediaType === 'video' && (
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => readVideo(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="glass-primary-btn w-full rounded-xl py-2.5 text-sm"
            >
              选择本地视频
            </button>
            <button
              type="button"
              onClick={() => {
                const poster = resolveDemoScene('cityNight')
                setMediaPoster(poster)
                setMediaUrl(null)
                setPreview(poster)
              }}
              className="w-full rounded-xl border border-white/55 bg-white/40 py-2.5 text-sm text-momo-text"
            >
              使用演示封面（无真实视频文件）
            </button>
            {preview && mediaUrl && (
              <video src={preview} className="max-h-40 w-full rounded-xl" controls playsInline />
            )}
            {preview && !mediaUrl && (
              <img src={preview} alt="" className="max-h-40 w-full rounded-xl object-cover" />
            )}
          </div>
        )}

        {mediaType === 'voice' && (
          <div className="rounded-xl border border-white/50 bg-white/35 px-4 py-6 text-center">
            <p className="text-sm text-momo-text">{recording ? '松开结束' : '按住录制模拟语音'}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-momo">{voiceSec}s</p>
            <button
              type="button"
              onMouseDown={startVoice}
              onMouseUp={stopVoice}
              onMouseLeave={() => recording && stopVoice()}
              onTouchStart={(e) => {
                e.preventDefault()
                startVoice()
              }}
              onTouchEnd={stopVoice}
              className={`mt-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${
                recording ? 'bg-rose-500 text-white' : 'glass-primary-btn'
              }`}
            >
              <Mic className="h-7 w-7" />
            </button>
            <p className="mt-3 text-[10px] text-momo-sub">演示声波，最长 8 秒，不发真实录音</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="glass-primary-btn w-full rounded-xl py-3 text-sm font-medium"
        >
          发布到{boardLabel}
        </button>
        <p className="text-center text-[10px] text-momo-sub">纯前端演示，内容保存在本机</p>
      </div>
    </SheetModal>
  )
}

export const FEED_PUBLISH_TYPES = [
  { id: 'text', label: '文字', icon: Type },
  { id: 'image', label: '图片', icon: Image },
  { id: 'video', label: '视频', icon: Video },
  { id: 'voice', label: '语音', icon: Mic },
]