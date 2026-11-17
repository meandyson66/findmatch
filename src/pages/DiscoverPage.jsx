import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AvatarPortrait } from '../components/AvatarPortrait'
import { LongPressPolaroid } from '../components/LongPressPolaroid'
import { VinylWave } from '../components/VinylWave'
import { useApp } from '../context/AppContext'
import { useAmbientAudio } from '../hooks/useAmbientAudio'

export function DiscoverPage() {
  const { state, patch, matchProfile, profiles } = useApp()
  const index = state.discoverIndex % profiles.length
  const profile = profiles[index]
  const [dragDir, setDragDir] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 160], [-8, 8])
  const audio = useAmbientAudio(profile.ambientType)

  useEffect(() => () => audio.stop(), [profile.id, audio.stop])

  const nextCard = (dir) => {
    setDragDir(dir)
    setTimeout(() => {
      patch({ discoverIndex: (index + 1) % profiles.length })
      setDragDir(0)
      x.set(0)
      audio.stop?.()
    }, 180)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 pb-4 pt-2">
      <p className="mb-3 text-center text-[11px] text-warm-gray">左右滑动换片 · 长按冲印开启 48h 同频</p>

      <div className="relative mx-auto w-full max-w-[340px] flex-1">
        <AnimatePresence mode="wait">
          <motion.article
            key={profile.id}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, info) => {
              if (info.offset.x > 90) nextCard(1)
              else if (info.offset.x < -90) nextCard(-1)
            }}
            initial={{ opacity: 0, x: dragDir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-2xl border border-border-warm bg-walnut shadow-lg"
          >
            <div className="relative h-52">
              <AvatarPortrait
                src={profile.avatarUrl}
                gradient={profile.avatarGradient}
                blurPx={22}
                alt={profile.nickname}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-walnut via-walnut/30 to-transparent" />
              <div className="film-grain absolute inset-0" />
              <motion.div
                className="absolute inset-0 border border-white/5"
                style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.45)' }}
              />
              <p className="absolute bottom-3 left-3 right-3 text-[11px] leading-snug text-parchment/90">
                初始模糊度 100% · 完成实验逐步显影
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl text-parchment">{profile.nickname}</h2>
                  <span className="text-sm text-warm-gray">{profile.age} 岁</span>
                </div>
                <p className="text-sm text-warm-gray">
                  {profile.job} ·{' '}
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin className="inline h-3 w-3" />
                    {profile.city}
                  </span>
                </p>
              </div>
              <p className="text-sm leading-relaxed text-parchment/90">「{profile.slice}」</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-warm px-2 py-0.5 text-[10px] text-warm-gray"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <VinylWave
                label={profile.ambient}
                playing={audio.playing}
                onToggle={audio.toggle}
                level={audio.level}
              />
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <LongPressPolaroid
          disabled={!!state.matchedId}
          onComplete={() => matchProfile(profile.id)}
        />
        {state.matchedId && (
          <p className="mt-2 text-center text-[10px] text-ice-blue">
            已有进行中的实验 · 可重置演示后重新冲印
          </p>
        )}
      </div>

      <div className="pointer-events-none mt-2 flex items-center justify-center gap-1 text-[10px] text-warm-gray/60">
        <Sparkles className="h-3 w-3" />
        演示数据 · 纯本地
      </div>
    </div>
  )
}