import { useCallback, useEffect, useRef, useState } from 'react'

function makeNoiseBuffer(ctx, type) {
  const len = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) {
    let v = Math.random() * 2 - 1
    if (type === 'waves') v *= Math.sin(i / 800) * 0.6 + 0.4
    if (type === 'rain') v *= 0.35
    if (type === 'cafe') v *= 0.2
    data[i] = v
  }
  return buffer
}

export function useAmbientAudio(ambientType) {
  const ctxRef = useRef(null)
  const nodesRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [level, setLevel] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      if (playing) {
        setLevel(0.35 + Math.random() * 0.65)
      } else {
        setLevel((l) => l * 0.85)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const stop = useCallback(() => {
    if (nodesRef.current) {
      try {
        nodesRef.current.source.stop()
      } catch {
        /* */
      }
      nodesRef.current = null
    }
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      stop()
      return
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!ctxRef.current) ctxRef.current = new Ctx()
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const source = ctx.createBufferSource()
    source.buffer = makeNoiseBuffer(ctx, ambientType)
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = ambientType === 'waves' ? 'lowpass' : 'bandpass'
    filter.frequency.value = ambientType === 'city' ? 900 : ambientType === 'rain' ? 1200 : 600
    const gain = ctx.createGain()
    gain.gain.value = ambientType === 'cafe' ? 0.08 : 0.12
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    nodesRef.current = { source, gain }
    setPlaying(true)
  }, [ambientType, playing, stop])

  useEffect(() => {
    stop()
  }, [ambientType, stop])

  useEffect(() => () => stop(), [stop])

  return { playing, toggle, stop, level }
}