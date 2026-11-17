import { motion } from 'framer-motion'
import { Award, Radar } from 'lucide-react'
import { useState } from 'react'
import { BADGE_DEFS } from '../data/mockData'
import { AvatarGlow } from '../components/AvatarGlow'
import { useApp } from '../context/AppContext'

const TAG_POOL = [
  '赛博浪漫',
  '深夜微醺',
  '同频优先',
  '猫奴',
  'Livehouse',
  '夜跑',
  '慢热',
  '话痨模式',
]

export function DarkroomPage({ onOpenChat }) {
  const { state, updateUser } = useApp()
  const [draftTags, setDraftTags] = useState(state.user.soulTags)
  const [draftName, setDraftName] = useState(state.user.nickname)
  const chats = Object.entries(state.chats)

  const toggleTag = (tag) => {
    setDraftTags((tags) => {
      if (tags.includes(tag)) return tags.filter((t) => t !== tag)
      if (tags.length >= 3) return tags
      return [...tags, tag]
    })
  }

  const save = () => {
    updateUser({
      nickname: draftName.trim() || state.user.nickname,
      soulTags: draftTags.length ? draftTags : state.user.soulTags,
    })
  }

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 pt-3">
      <p className="text-xs text-mist">我的暗房</p>
      <p className="text-sm text-parchment">拍立得档案 · 霓虹徽章 · 雷达设置</p>

      <motion.div
        className="glass-card mt-4 rounded-2xl p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-3">
          <AvatarGlow nickname={state.user.nickname} accent="#A855F7" size={72} />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-neon">POLAROID</p>
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="mt-1 w-full border-b border-glass-border bg-transparent text-lg font-semibold text-parchment outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {state.user.soulTags.map((t) => (
                <span key={t} className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] text-mint">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <section className="mt-5">
        <h3 className="mb-2 flex items-center gap-1 text-xs font-medium text-parchment">
          <Award className="h-4 w-4 text-neon" />
          已点亮徽章
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BADGE_DEFS.map((b) => {
            const on = state.badgesEarned.includes(b.id)
            return (
              <motion.div
                key={b.id}
                className={`rounded-xl border px-3 py-2 ${
                  on
                    ? 'border-neon/50 bg-neon/10 shadow-[0_0_16px_rgba(168,85,247,0.25)]'
                    : 'border-glass-border bg-obsidian/50 opacity-45'
                }`}
                whileHover={on ? { scale: 1.02 } : {}}
              >
                <p className="text-xs font-medium text-parchment">{b.name}</p>
                <p className="text-[10px] text-mist">{b.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="mt-5">
        <h3 className="mb-2 flex items-center gap-1 text-xs font-medium text-parchment">
          <Radar className="h-4 w-4 text-mint" />
          灵魂标签与雷达
        </h3>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-[11px] text-mist">选择最多 3 个灵魂标签</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TAG_POOL.map((tag) => {
              const picked = draftTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                    picked
                      ? 'bg-neon text-obsidian'
                      : 'border border-glass-border text-mist hover:text-parchment'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
          <label className="mt-4 flex items-center justify-between text-sm text-parchment">
            <span>雷达对外可见</span>
            <button
              type="button"
              onClick={() => updateUser({ radarOn: !state.user.radarOn })}
              className={`h-7 w-12 rounded-full p-0.5 transition ${
                state.user.radarOn ? 'bg-mint' : 'bg-mist/30'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-parchment shadow transition ${
                  state.user.radarOn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
          <button
            type="button"
            onClick={save}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-neon to-purple-600 py-2.5 text-sm font-medium text-parchment"
          >
            保存档案
          </button>
        </div>
      </section>

      {chats.length > 0 && (
        <section className="mt-5 mb-2">
          <h3 className="mb-2 text-xs font-medium text-parchment">近期对话</h3>
          <ul className="space-y-2">
            {chats.map(([id, c]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onOpenChat?.(id)}
                  className="glass-card w-full rounded-xl px-3 py-2 text-left text-sm text-parchment hover:border-neon/40"
                >
                  {c.title}
                  <span className="ml-2 text-[10px] text-mist">
                    {c.source === 'radar' ? '雷达' : '漂流瓶'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}