import { AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { chatIdForRadar } from '../data/storage'
import { ProfileSheet } from '../components/radar/ProfileSheet'
import { RadarCanvas } from '../components/radar/RadarCanvas'
import { SoulQuizModal } from '../components/radar/SoulQuizModal'
import { useApp } from '../context/AppContext'

export function RadarPage({ onOpenChat }) {
  const { state, radarProfiles, isRadarUnlocked, completeSoulQuiz } = useApp()
  const visible = useMemo(
    () => (state.user.radarOn ? radarProfiles : []),
    [state.user.radarOn, radarProfiles]
  )
  const [selectedId, setSelectedId] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const [pendingChat, setPendingChat] = useState(null)

  const profile = visible.find((p) => p.id === selectedId)

  const handleQuizComplete = (answers, matched) => {
    if (!selectedId) return
    setQuizOpen(false)
    if (matched) {
      const chatId = completeSoulQuiz(selectedId, answers, matched)
      if (chatId) {
        setPendingChat(chatId)
        setTimeout(() => {
          onOpenChat?.(chatId)
          setPendingChat(null)
        }, 400)
      }
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-3">
        <p className="text-xs text-mist">LBS 磁场雷达 · 模拟附近 5 人</p>
        <p className="text-sm text-parchment">
          {state.user.radarOn ? '你的信号正在夜空中闪烁' : '雷达已隐身，他人在地图上不可见'}
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <RadarCanvas
          profiles={visible}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((cur) => (cur === id ? cur : id))}
        />
      </div>
      <AnimatePresence>
        {profile && (
          <ProfileSheet
            key={profile.id}
            profile={profile}
            unlocked={isRadarUnlocked(profile.id)}
            onConnect={() => setQuizOpen(true)}
            onOpenChat={() => onOpenChat?.(chatIdForRadar(profile.id))}
          />
        )}
      </AnimatePresence>
      <SoulQuizModal
        open={quizOpen}
        profile={profile}
        onClose={() => setQuizOpen(false)}
        onComplete={handleQuizComplete}
      />
      {pendingChat && null}
    </div>
  )
}