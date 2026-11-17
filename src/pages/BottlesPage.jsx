import { useState } from 'react'
import { chatIdForBottle } from '../data/storage'
import { BottleCard } from '../components/bottles/BottleCard'
import { VoiceReplyPanel } from '../components/bottles/VoiceReplyPanel'
import { VoiceWavePlayer } from '../components/bottles/VoiceWavePlayer'
import { useApp } from '../context/AppContext'

export function BottlesPage({ onOpenChat }) {
  const { bottles, isBottleUnlocked, unlockBottleChat } = useApp()
  const [activeId, setActiveId] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [heard, setHeard] = useState({})

  const active = bottles.find((b) => b.id === activeId)
  const unlocked = activeId ? isBottleUnlocked(activeId) : false
  const canReply = activeId && heard[activeId] && !unlocked

  const selectBottle = (id) => {
    setActiveId(id)
    setPlaying(true)
  }

  const onHeard = () => {
    setPlaying(false)
    if (activeId) setHeard((h) => ({ ...h, [activeId]: true }))
  }

  const onReplySuccess = ({ simulated }) => {
    if (!activeId) return
    const chatId = unlockBottleChat(activeId, simulated)
    setTimeout(() => onOpenChat?.(chatId), 300)
  }

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 pt-3">
      <p className="text-xs text-mist">声音漂流瓶广场</p>
      <p className="text-sm text-parchment">捡起一段心事，用声波回信才能私聊</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {bottles.map((b) => (
          <BottleCard
            key={b.id}
            bottle={b}
            active={activeId === b.id}
            onClick={() => selectBottle(b.id)}
          />
        ))}
      </div>
      {active && (
        <div className="mt-6">
          <VoiceWavePlayer playing={playing} onEnded={onHeard} />
          {unlocked ? (
            <button
              type="button"
              onClick={() => onOpenChat?.(chatIdForBottle(active.id))}
              className="mt-4 w-full rounded-xl bg-neon/90 py-2.5 text-sm font-medium text-obsidian"
            >
              打开私信对话
            </button>
          ) : (
            canReply && <VoiceReplyPanel onSuccess={onReplySuccess} />
          )}
        </div>
      )}
    </div>
  )
}