import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { generateIcebreakers } from '../../utils/icebreakers'

export function LabChat({ partner }) {
  const { state, sendMessage } = useApp()
  const [draft, setDraft] = useState('')
  const [iceOpen, setIceOpen] = useState(false)
  const lines = generateIcebreakers(partner, state.lab)
  const replyIdx = useRefIndex(state.messages.filter((m) => m.from === 'them').length)

  const send = (text) => {
    if (!text.trim()) return
    sendMessage(text.trim(), 'me')
    setDraft('')
    const replies = partner.chatReplies
    const reply = replies[replyIdx % replies.length]
    setTimeout(() => sendMessage(reply, 'them'), 1500)
  }

  return (
    <section className="mt-3 rounded-xl border border-border-warm bg-charcoal/60">
      <header className="flex items-center justify-between border-b border-border-warm px-3 py-2">
        <span className="text-xs text-parchment">暗房聊天</span>
        <button
          type="button"
          onClick={() => setIceOpen((o) => !o)}
          className="flex items-center gap-1 rounded-full border border-ice-blue/40 px-2 py-0.5 text-[10px] text-ice-blue"
        >
          <Sparkles className="h-3 w-3" />
          AI 破冰急救包
        </button>
      </header>
      {iceOpen && (
        <div className="space-y-1 border-b border-border-warm bg-walnut/40 p-2">
          {lines.map((line) => (
            <button
              key={line}
              type="button"
              onClick={() => send(line)}
              className="w-full rounded-lg border border-border-warm/80 px-2 py-1.5 text-left text-[11px] text-parchment hover:border-amber/50"
            >
              {line}
            </button>
          ))}
        </div>
      )}
      <div className="max-h-32 space-y-2 overflow-y-auto p-3">
        {state.messages.length === 0 && (
          <p className="text-center text-[11px] text-warm-gray">完成互动后，试试破冰急救包</p>
        )}
        {state.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <span
              className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-xs ${
                m.from === 'me' ? 'bg-amber/90 text-charcoal' : 'bg-walnut text-parchment'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-border-warm p-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="输入消息…"
          className="flex-1 rounded-lg border border-border-warm bg-walnut px-2 py-1.5 text-xs text-parchment placeholder:text-warm-gray/60 outline-none focus:border-amber/50"
        />
        <button type="submit" className="rounded-lg bg-amber px-3 text-xs font-medium text-charcoal">
          发送
        </button>
      </form>
    </section>
  )
}

function useRefIndex(n) {
  return n
}