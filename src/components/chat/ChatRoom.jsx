import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Phone, ShieldAlert, Sparkles, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EMOJI_PICKS } from '../../data/mockData'
import { MATCHMAKER_SIM_REPLIES } from '../../data/matchmakerChat'
import { MATCHMAKERS } from '../../data/matchmakers'
import { buildIcebreakers, SIM_REPLIES } from '../../utils/icebreakers'
import { resolveChatPartner } from '../../utils/chatPartner'
import { useApp } from '../../context/AppContext'
import { isIdentityVerified } from '../../utils/identity'
import { MatchmakerVideoCall } from '../matchmaker/MatchmakerVideoCall'

export function ChatRoom({ chatId, onClose, boot, onBootConsumed }) {
  const {
    state,
    sendMessage,
    appendSimReply,
    markIcebreakerUsed,
    markChatRead,
    openRealNameVerify,
  } = useApp()
  const canChat = isIdentityVerified(state.user)
  const [sendHint, setSendHint] = useState('')
  const chat = state.chats[chatId]
  const partner = resolveChatPartner(chat)
  const isMatchmaker = chat?.source === 'matchmaker'
  const matchmaker = isMatchmaker
    ? MATCHMAKERS.find((m) => m.id === chat.partnerId)
    : null
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [callMode, setCallMode] = useState(null)
  const bottomRef = useRef(null)

  const theirTags = partner?.soulTags ?? ['交友', '聊天']

  useEffect(() => {
    markChatRead(chatId)
  }, [chatId, markChatRead])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages?.length])

  useEffect(() => {
    if (!boot?.openVideo || !isMatchmaker) return
    setCallMode(boot.videoMode ?? 'video')
    onBootConsumed?.()
  }, [boot, isMatchmaker, onBootConsumed])

  if (!chat) return null

  const send = (text) => {
    const t = text.trim()
    if (!t) return
    if (!canChat) {
      setSendHint('实名认证通过后即可发言')
      openRealNameVerify()
      return
    }
    const ok = sendMessage(chatId, t, 'me')
    if (!ok) {
      setSendHint('发送失败，请确认已完成实名认证')
      return
    }
    setSendHint('')
    setInput('')
    const pool = isMatchmaker ? MATCHMAKER_SIM_REPLIES : SIM_REPLIES
    appendSimReply(chatId, pool[Math.floor(Math.random() * pool.length)])
  }

  const runIcebreaker = () => {
    if (isMatchmaker) {
      setSuggestions([
        '红娘你好，我想找同城、性格慢热的对象🌸',
        '想先聊聊我比较看重的条件，再约视频沟通可以吗？',
      ])
    } else {
      setSuggestions(buildIcebreakers(state.user.soulTags, theirTags))
    }
    markIcebreakerUsed()
  }

  const roomClass = isMatchmaker
    ? 'chat-sakura-room absolute inset-0 z-40 flex flex-col'
    : 'absolute inset-0 z-40 flex flex-col bg-slate-950/55 backdrop-blur-md'

  return (
    <motion.div
      className={roomClass}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      <header
        className={
          isMatchmaker
            ? 'chat-sakura-header flex shrink-0 items-center gap-2 border-b px-3 py-3'
            : 'glass-bar flex shrink-0 items-center gap-2 border-b px-3 py-3'
        }
      >
        <button
          type="button"
          onClick={onClose}
          className={`rounded-full p-1 active:bg-white/40 ${
            isMatchmaker ? 'text-rose-950' : 'text-momo-text'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h2
            className={`truncate text-[17px] font-semibold tracking-tight ${
              isMatchmaker ? 'text-rose-950' : 'text-momo-text'
            }`}
          >
            {chat.title}
          </h2>
          <p className={`text-[10px] ${isMatchmaker ? 'text-rose-800/70' : 'text-momo-sub'}`}>
            {isMatchmaker ? '樱花红娘 · 在线' : partner?.online ? '在线' : '离线'}
          </p>
        </div>
        {isMatchmaker ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setCallMode('voice')}
              className="chat-sakura-tool-btn"
              title="樱花语音"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCallMode('video')}
              className="chat-sakura-tool-btn chat-sakura-tool-btn-primary"
              title="视频"
            >
              <Video className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={runIcebreaker}
            disabled={!canChat}
            className="flex items-center gap-1 rounded-full border border-white/55 bg-white/45 px-2.5 py-1 text-[10px] text-momo-dark backdrop-blur-md disabled:opacity-40"
          >
            <Sparkles className="h-3.5 w-3.5" />
            开场助手
          </button>
        )}
      </header>
      {isMatchmaker && (
        <button
          type="button"
          onClick={runIcebreaker}
          disabled={!canChat}
          className="chat-sakura-hint flex shrink-0 items-center gap-2 px-3 py-2 text-left disabled:opacity-45"
        >
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="flex-1 text-[11px] text-rose-950/85">
            点「开场助手」快速填充樱花问候，或右上角进入演示视频房
          </span>
          <span className="shrink-0 text-[10px] font-medium text-rose-700">开场助手</span>
        </button>
      )}
      {!canChat && (
        <button
          type="button"
          onClick={openRealNameVerify}
          className="glass-bar flex shrink-0 items-center gap-2 border-b border-amber-500/30 bg-amber-500/15 px-3 py-2 text-left"
        >
          <ShieldAlert className="h-4 w-4 text-amber-700" />
          <span className="flex-1 text-xs text-momo-text">
            未实名认证，暂不可发言。点此完成认证后与别人聊天
          </span>
        </button>
      )}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {chat.messages.map((m) => {
          const mine = m.from === 'me'
          const system = m.from === 'system'
          if (system) {
            return (
              <p
                key={m.id}
                className={`text-center text-[11px] ${
                  isMatchmaker ? 'text-rose-800/65' : 'text-momo-sub'
                }`}
              >
                {m.text}
              </p>
            )
          }
          const bubbleMine = isMatchmaker ? 'chat-sakura-bubble-me' : 'glass-primary-btn'
          const bubbleThem = isMatchmaker ? 'chat-sakura-bubble-them' : 'glass-bubble-them'
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-[15px] ${
                  mine ? bubbleMine : bubbleThem
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <AnimatePresence>
        {suggestions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={
              isMatchmaker
                ? 'chat-sakura-suggestions shrink-0 border-t px-3 py-2'
                : 'glass-bar shrink-0 border-t px-3 py-2'
            }
          >
            <p className={`mb-2 text-[10px] ${isMatchmaker ? 'text-rose-900/70' : 'text-momo-sub'}`}>
              点选发送
            </p>
            {suggestions.map((line) => (
              <button
                key={line}
                type="button"
                onClick={() => {
                  send(line)
                  setSuggestions(null)
                }}
                className={
                  isMatchmaker
                    ? 'chat-sakura-suggestion-item mb-1.5 w-full px-3 py-2 text-left text-xs'
                    : 'glass-input mb-1.5 w-full px-3 py-2 text-left text-xs text-momo-text'
                }
              >
                {line}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={
          isMatchmaker
            ? 'chat-sakura-input-bar shrink-0 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]'
            : 'glass-nav shrink-0 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]'
        }
      >
        {sendHint && <p className="mb-1 text-center text-[10px] text-amber-700">{sendHint}</p>}
        {canChat ? (
          <>
            <div className="mb-2 flex gap-1 overflow-x-auto">
              {EMOJI_PICKS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => send(e)}
                  className="shrink-0 rounded-lg bg-white/35 px-1.5 py-1 text-lg backdrop-blur-sm"
                >
                  {e}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isMatchmaker ? '对红娘说点什么…' : '输入消息…'}
                className={
                  isMatchmaker
                    ? 'chat-sakura-input min-w-0 flex-1 px-3 py-2 text-sm outline-none'
                    : 'glass-input min-w-0 flex-1 px-3 py-2 text-sm text-momo-text outline-none focus:ring-2 focus:ring-momo/30'
                }
              />
              <button
                type="submit"
                className={
                  isMatchmaker
                    ? 'chat-sakura-send rounded-xl px-4 py-2 text-sm font-medium'
                    : 'glass-primary-btn rounded-xl px-4 py-2 text-sm font-medium'
                }
              >
                发送
              </button>
            </form>
          </>
        ) : (
          <button
            type="button"
            onClick={openRealNameVerify}
            className={
              isMatchmaker
                ? 'chat-sakura-send w-full rounded-xl py-3 text-sm font-medium'
                : 'glass-primary-btn w-full rounded-xl py-3 text-sm font-medium'
            }
          >
            去实名认证 · 解锁聊天
          </button>
        )}
      </div>

      <AnimatePresence>
        {callMode && matchmaker && (
          <MatchmakerVideoCall
            matchmaker={matchmaker}
            mode={callMode}
            onClose={() => setCallMode(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}