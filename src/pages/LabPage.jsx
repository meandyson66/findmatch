import { FlaskConical } from 'lucide-react'
import { AvatarPortrait } from '../components/AvatarPortrait'
import { EmotionBar } from '../components/lab/EmotionBar'
import { LabChat } from '../components/lab/LabChat'
import { LevelCrisis } from '../components/lab/LevelCrisis'
import { LevelSoul } from '../components/lab/LevelSoul'
import { LevelVinyl } from '../components/lab/LevelVinyl'
import { useApp } from '../context/AppContext'
import { blurForProgress, photoUnlockPercent } from '../data/storage'
import { useCountdown } from '../hooks/useCountdown'

export function LabPage() {
  const { state, partner, completeLevel1, completeLevel2, completeLevel3 } = useApp()
  const { label } = useCountdown(state.matchStartedAt)

  if (!partner || !state.matchedId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <FlaskConical className="h-10 w-10 text-ice-blue/60" />
        <p className="text-sm text-parchment">尚未开始 48h 实验</p>
        <p className="text-xs text-warm-gray">在「黑胶发现」长按冲印拍立得，匹配后即可进入</p>
      </div>
    )
  }

  const blur = blurForProgress(state.lab)
  const percent = photoUnlockPercent(state.lab)

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 space-y-2 border-b border-border-warm bg-walnut/90 px-3 py-3">
        <EmotionBar lab={state.lab} />
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border-warm">
            <AvatarPortrait
              src={partner.avatarUrl}
              gradient={partner.avatarGradient}
              blurPx={blur}
              alt={partner.nickname}
              transitionDuration={1.65}
              className="h-full w-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-warm-gray">与 {partner.nickname} 的同频计时</p>
            <p className="font-mono text-lg tracking-wider text-parchment">{label}</p>
            <p className="text-[10px] text-amber">显影进度 {percent}%</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <LevelSoul
          partner={partner}
          done={state.lab.level1.done}
          choice={state.lab.level1.choice}
          onComplete={completeLevel1}
        />
        <LevelVinyl
          partner={partner}
          done={state.lab.level2.done}
          picks={state.lab.level2.picks}
          locked={!state.lab.level1.done}
          onComplete={completeLevel2}
        />
        <LevelCrisis
          partner={partner}
          done={state.lab.level3.done}
          choice={state.lab.level3.choice}
          locked={!state.lab.level2.done}
          onComplete={completeLevel3}
        />
        <LabChat partner={partner} />
      </div>
    </div>
  )
}