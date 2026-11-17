import { motion } from 'framer-motion'
import { Radio, Wand2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function VoiceReplyPanel({ onSuccess }) {
  const [recording, setRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
    setProgress(100)
    onSuccess?.({ simulated: false })
  }, [onSuccess])

  const startRecord = async () => {
    setError(null)
    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRef.current = { recorder, stream }
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        finish()
      }
      recorder.start()
      setRecording(true)
      setProgress(0)
      let elapsed = 0
      timerRef.current = setInterval(() => {
        elapsed += 100
        setProgress(Math.min(100, (elapsed / 3000) * 100))
        if (elapsed >= 3000) {
          recorder.stop()
        }
      }, 100)
    } catch {
      setError('无法访问麦克风，可使用模拟声波回复')
    }
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
      mediaRef.current?.stream?.getTracks().forEach((t) => t.stop())
    },
    []
  )

  return (
    <motion.div
      className="glass-card mt-3 rounded-2xl p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs text-mist">听完语音后，录制 3 秒回信或生成模拟声波</p>
      <motion.div
        className="mt-3 h-2 overflow-hidden rounded-full bg-obsidian"
        initial={false}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-mint to-neon"
          style={{ width: `${progress}%` }}
        />
      </motion.div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={startRecord}
          disabled={recording}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-mint/40 bg-mint/15 py-2.5 text-sm text-mint disabled:opacity-50"
        >
          <Radio className={`h-4 w-4 ${recording ? 'animate-pulse' : ''}`} />
          {recording ? '录制中…' : '录制声音回复'}
        </button>
        <button
          type="button"
          onClick={() => onSuccess?.({ simulated: true })}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neon/40 bg-neon/15 py-2.5 text-sm text-neon"
        >
          <Wand2 className="h-4 w-4" />
          模拟声波
        </button>
      </div>
      {error && <p className="mt-2 text-[11px] text-amber-300">{error}</p>}
    </motion.div>
  )
}