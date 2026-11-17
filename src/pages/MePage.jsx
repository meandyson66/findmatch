import {
  Camera,
  ChevronRight,
  Crown,
  Eye,
  HelpCircle,
  Pencil,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MomoAvatar } from '../components/MomoAvatar'
import { ResetButton } from '../components/ResetButton'
import { AvatarSetupSheet } from '../components/me/AvatarSetupSheet'
import { SheetModal } from '../components/me/SheetModal'
import { CityPickerSheet } from '../components/home/CityPickerSheet'
import { ProfileExtraFields, ProfileInfoGrid } from '../components/ProfileInfoGrid'
import { formatUserLocationDetail } from '../data/chinaRegions'
import { chatIdForRadar } from '../data/storage'
import { useApp } from '../context/AppContext'
import { VipBadge } from '../components/VipBadge'
import { VipCenterSheet } from '../components/me/VipCenterSheet'
import { getVipPerks, getNextTier, vipProgress } from '../data/vip'
import { isIdentityVerified } from '../utils/identity'
import { formatFans, formatRelative } from '../utils/formatTime'

const MENU = [
  { key: 'identity', icon: ShieldCheck, label: '实名认证' },
  { key: 'vip', icon: Crown, label: '会员中心' },
  { key: 'edit', icon: User, label: '编辑资料' },
  { key: 'viewers', icon: Eye, label: '谁看过我' },
  { key: 'settings', icon: Settings, label: '设置' },
  { key: 'help', icon: HelpCircle, label: '帮助与反馈' },
]

const TAG_POOL = ['探店', '电影', '美食', '健身', '旅行', '摄影', '音乐', '游戏']

function ToggleRow({ label, desc, on, onToggle }) {
  return (
    <div className="flex items-center justify-between border-b border-white/45 px-4 py-3 last:border-0">
      <div>
        <p className="text-sm text-momo-text">{label}</p>
        {desc && <p className="text-[11px] text-momo-sub">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`h-7 w-12 shrink-0 rounded-full p-0.5 transition ${on ? 'bg-momo' : 'bg-momo-line'}`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white shadow transition ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="mb-3 block px-4">
      <span className="text-xs text-momo-sub">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function profileToForm(u) {
  return {
    nickname: u.nickname,
    bio: u.bio,
    age: String(u.age ?? ''),
    gender: u.gender,
    province: u.province,
    city: u.city,
    education: u.education ?? '',
    job: u.job ?? '',
    jobTitle: u.jobTitle ?? '',
    income: u.income ?? '',
    heightCm: u.heightCm != null && u.heightCm !== '' ? String(u.heightCm) : '',
    marital: u.marital ?? '',
    hometown: u.hometown ?? '',
    company: u.company ?? '',
  }
}

export function MePage({ onOpenChat }) {
  const {
    state,
    updateUser,
    updateSettings,
    clearProfileViewsUnread,
    submitFeedback,
    toggleFollow,
    addMoment,
    deleteMoment,
    nearbyUsers,
    patch,
    isRadarUnlocked,
    purchaseRecharge,
    openRealNameVerify,
  } = useApp()
  const u = state.user
  const settings = u.settings ?? {}
  const vipPerks = getVipPerks(u.vipTotalRecharge ?? 0)
  const vipNext = getNextTier(vipPerks.level)

  const [panel, setPanel] = useState(null)
  const [toast, setToast] = useState('')
  const [editingTags, setEditingTags] = useState(false)
  const [draftTags, setDraftTags] = useState(u.soulTags ?? [])

  const [editForm, setEditForm] = useState(() => profileToForm(u))
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [momentText, setMomentText] = useState('')

  useEffect(() => {
    setDraftTags(u.soulTags ?? [])
  }, [u.soulTags])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(''), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg) => setToast(msg)

  const identityOk = isIdentityVerified(u)

  const openPanel = (key) => {
    if (key === 'identity') {
      openRealNameVerify()
      return
    }
    if (key === 'edit') setEditForm(profileToForm(u))
    if (key === 'viewers') clearProfileViewsUnread()
    setPanel(key)
  }

  const saveProfile = () => {
    const age = Number.parseInt(editForm.age, 10)
    if (!editForm.nickname.trim()) {
      showToast('昵称不能为空')
      return
    }
    if (!Number.isFinite(age) || age < 18 || age > 80) {
      showToast('请输入 18–80 岁的年龄')
      return
    }
    const heightRaw = editForm.heightCm?.trim() ?? ''
    const heightCm =
      heightRaw === '' ? null : Number.parseInt(heightRaw, 10)
    if (heightRaw !== '' && (!Number.isFinite(heightCm) || heightCm < 140 || heightCm > 220)) {
      showToast('身高请在 140–220 cm')
      return
    }
    updateUser({
      nickname: editForm.nickname.trim(),
      bio: editForm.bio.trim() || u.bio,
      age,
      gender: editForm.gender,
      province: editForm.province,
      city: editForm.city,
      education: editForm.education,
      job: editForm.job,
      jobTitle: editForm.jobTitle?.trim() ?? '',
      income: editForm.income,
      heightCm: heightRaw === '' ? u.heightCm : heightCm,
      marital: editForm.marital,
      hometown: editForm.hometown?.trim() ?? '',
      company: editForm.company?.trim() ?? '',
    })
    showToast('资料已保存')
    setPanel(null)
  }

  const saveTags = () => {
    if (draftTags.length === 0) {
      showToast('请至少选择 1 个标签')
      return
    }
    updateUser({ soulTags: draftTags })
    setEditingTags(false)
    showToast('标签已更新')
  }

  const toggleTag = (tag) => {
    setDraftTags((tags) => {
      if (tags.includes(tag)) return tags.filter((t) => t !== tag)
      if (tags.length >= 3) {
        showToast('最多选择 3 个标签')
        return tags
      }
      return [...tags, tag]
    })
  }

  const userById = (id) => nearbyUsers.find((x) => x.id === id)

  const followingCount = u.following?.length ?? 0
  const fansCount = u.fans?.length ?? 0
  const momentsCount = u.moments?.length ?? 0

  const greetFromViewer = (id) => {
    setPanel(null)
    if (!identityOk) {
      showToast('请先完成实名认证后再发起聊天')
      openRealNameVerify()
      return
    }
    patch({ tab: 'home' })
    if (isRadarUnlocked(id)) onOpenChat?.(chatIdForRadar(id))
    else showToast('请到首页点击「打招呼」完成默契测试')
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        <div className="glass-bar relative h-28 border-b bg-gradient-to-br from-momo/30 via-white/20 to-sky-300/35 pt-[max(0.75rem,env(safe-area-inset-top))]" />
        <div className="-mt-10 px-4">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => setAvatarOpen(true)}
              className="relative rounded-2xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-momo/40"
              aria-label="设置头像"
            >
              <MomoAvatar
                nickname={u.nickname}
                accent={u.avatarAccent}
                emoji={u.avatarEmoji}
                imageUrl={u.avatarImage}
                size={72}
              />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-momo text-white shadow-md">
                <Camera className="h-3.5 w-3.5" />
              </span>
            </button>
            <ResetButton className="mb-2 rounded bg-white/80 px-2 py-1" />
          </div>
        </div>

        {!identityOk && (
          <button
            type="button"
            onClick={openRealNameVerify}
            className="mx-4 mt-3 w-[calc(100%-2rem)] rounded-xl border border-amber-500/35 bg-amber-500/15 px-4 py-3 text-left active:opacity-90"
          >
            <p className="text-sm font-medium text-momo-text">完成实名认证，开始聊天</p>
            <p className="mt-1 text-[11px] text-momo-sub">未实名用户不可发言或发起新会话</p>
          </button>
        )}

        <header className="mt-2 px-4">
          <button
            type="button"
            onClick={() => openPanel('edit')}
            className="group flex items-center gap-1.5 text-left"
            aria-label="编辑昵称与资料"
          >
            <h1 className="text-xl font-semibold text-momo-text">{u.nickname}</h1>
            <VipBadge level={vipPerks.level} />
            <Pencil className="h-4 w-4 text-momo-sub" />
          </button>
          <p className="mt-1 text-xs text-momo-sub">
            ID: {u.idDisplay ?? '——'} · {u.age}岁 · {u.gender} ·{' '}
            {formatUserLocationDetail(u)}
          </p>
          <p className="mt-2 text-sm text-momo-text">{u.bio}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(u.soulTags ?? []).map((t) => (
              <span key={t} className="rounded bg-momo/10 px-2 py-0.5 text-[11px] text-momo-dark">
                {t}
              </span>
            ))}
          </div>
        </header>

        <div className="glass-panel mx-4 mt-3 p-3">
          <p className="mb-2 text-xs font-medium text-momo-sub">基本资料</p>
          <ProfileInfoGrid user={u} />
        </div>

        <button
          type="button"
          onClick={() => openPanel('vip')}
          className="mx-4 mt-3 w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/45 bg-gradient-to-r from-amber-500/25 via-white/35 to-violet-400/20 p-4 text-left shadow-glass-sm active:opacity-90"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="flex items-center gap-1 text-xs text-momo-sub">
                <Crown className="h-3.5 w-3.5" />
                会员与充值
              </p>
              <p className="mt-1 text-sm font-semibold text-momo-text">
                {vipPerks.tier.name}会员 · {u.coinBalance ?? 0} 寻伴币
              </p>
              {vipNext ? (
                <p className="mt-1 text-[10px] text-momo-sub">
                  再充 ¥{Math.max(0, vipNext.minRecharge - (u.vipTotalRecharge ?? 0))} 升
                  {vipNext.name}
                </p>
              ) : (
                <p className="mt-1 text-[10px] text-momo-sub">已满级特权</p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-momo-sub" />
          </div>
          {vipNext && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/40">
              <div
                className="h-full rounded-full bg-momo"
                style={{ width: `${Math.round(vipProgress(u.vipTotalRecharge ?? 0) * 100)}%` }}
              />
            </div>
          )}
        </button>

        <div className="glass-panel mx-4 mt-4 flex py-4">
          {[
            { key: 'following', n: followingCount, label: '关注' },
            { key: 'fans', n: formatFans(fansCount), label: '粉丝' },
            { key: 'moments', n: momentsCount, label: '动态' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => openPanel(item.key)}
              className="flex-1 text-center active:opacity-70"
            >
              <p className="text-lg font-semibold text-momo-text">{item.n}</p>
              <p className="text-xs text-momo-sub">{item.label}</p>
            </button>
          ))}
        </div>

        <div className="glass-panel mx-4 mt-3 overflow-hidden">
          <ToggleRow
            label="在附近展示我"
            desc="关闭后他人无法在首页看到你"
            on={u.radarOn}
            onToggle={() => updateUser({ radarOn: !u.radarOn })}
          />
          <button
            type="button"
            onClick={() => setEditingTags((v) => !v)}
            className="flex w-full items-center justify-between border-b border-white/45 px-4 py-3 text-left"
          >
            <span className="text-sm text-momo-text">兴趣标签</span>
            <ChevronRight
              className={`h-4 w-4 text-momo-sub transition ${editingTags ? 'rotate-90' : ''}`}
            />
          </button>
          {editingTags && (
            <div className="border-b border-white/45 px-4 pb-4">
              <div className="mt-3 flex flex-wrap gap-2">
                {TAG_POOL.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      draftTags.includes(tag)
                        ? 'glass-primary-btn'
                        : 'border border-white/50 bg-white/35 text-momo-sub backdrop-blur-md'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={saveTags}
                className="mt-3 w-full rounded-lg bg-momo py-2 text-sm font-medium text-white"
              >
                保存标签
              </button>
            </div>
          )}
        </div>

        <div className="glass-panel mx-4 mt-3 overflow-hidden">
          {MENU.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => openPanel(key)}
              className="glass-row-active flex w-full items-center gap-3 border-b border-white/45 px-4 py-3.5 text-left last:border-0"
            >
              <Icon className="h-5 w-5 text-momo-sub" strokeWidth={1.75} />
              <span className="flex-1 text-sm text-momo-text">{label}</span>
              {key === 'identity' && (
                <span
                  className={`mr-1 rounded-full px-2 py-0.5 text-[10px] ${
                    identityOk ? 'bg-momo/15 text-momo-dark' : 'bg-amber-500/25 text-amber-900'
                  }`}
                >
                  {identityOk ? '已认证' : '未认证'}
                </span>
              )}
              {key === 'viewers' && (u.profileViewsUnread ?? 0) > 0 && (
                <span className="mr-1 rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                  {u.profileViewsUnread}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-momo-sub" />
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}

      <SheetModal open={panel === 'edit'} title="编辑资料" onClose={() => setPanel(null)} tall>
        <div className="py-3">
          <Field label="昵称">
            <input
              value={editForm.nickname}
              onChange={(e) => setEditForm((f) => ({ ...f, nickname: e.target.value }))}
              className="w-full rounded-lg glass-input px-3 py-2 text-sm outline-none focus:border-momo"
              maxLength={20}
            />
          </Field>
          <Field label="个性签名">
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              maxLength={80}
              className="w-full resize-none rounded-lg glass-input px-3 py-2 text-sm outline-none focus:border-momo"
            />
          </Field>
          <Field label="年龄">
            <input
              type="number"
              value={editForm.age}
              onChange={(e) => setEditForm((f) => ({ ...f, age: e.target.value }))}
              className="w-full rounded-lg glass-input px-3 py-2 text-sm outline-none focus:border-momo"
            />
          </Field>
          <Field label="性别">
            <div className="flex gap-2">
              {['男', '女'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, gender: g }))}
                  className={`flex-1 rounded-lg py-2 text-sm ${
                    editForm.gender === g
                      ? 'glass-primary-btn'
                      : 'border border-white/50 bg-white/35 text-momo-text backdrop-blur-md'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>
          <Field label="所在城市">
            <button
              type="button"
              onClick={() => setCityPickerOpen(true)}
              className="glass-input flex w-full items-center justify-between px-3 py-2.5 text-sm text-momo-text"
            >
              {formatUserLocationDetail(editForm)}
              <ChevronRight className="h-4 w-4 text-momo-sub" />
            </button>
          </Field>
          <p className="mb-1 mt-2 px-4 text-xs font-medium text-momo-sub">更多资料</p>
          <ProfileExtraFields form={editForm} setForm={setEditForm} />
          <div className="px-4 pt-2">
            <button
              type="button"
              onClick={saveProfile}
              className="glass-primary-btn w-full rounded-lg py-2.5 text-sm font-medium"
            >
              保存
            </button>
          </div>
        </div>
      </SheetModal>

      <VipCenterSheet
        open={panel === 'vip'}
        onClose={() => setPanel(null)}
        totalRecharge={u.vipTotalRecharge ?? 0}
        coinBalance={u.coinBalance ?? 0}
        rechargeHistory={u.rechargeHistory}
        onPurchase={purchaseRecharge}
      />

      <SheetModal open={panel === 'viewers'} title="谁看过我" onClose={() => setPanel(null)} tall>
        <p className="border-b border-white/40 px-4 py-2 text-[11px] text-momo-sub">
          {vipPerks.viewerShow < 999
            ? `普通会员仅展示最近 ${vipPerks.viewerShow} 条，升级可看全部`
            : '已解锁全部访客记录'}
        </p>
        <div className="divide-y divide-white/40">
          {(u.profileViews ?? []).length === 0 ? (
            <p className="py-12 text-center text-sm text-momo-sub">暂无访客记录</p>
          ) : (
            [...(u.profileViews ?? [])]
              .sort((a, b) => b.at - a.at)
              .slice(0, vipPerks.viewerShow)
              .map((row) => {
                const person = userById(row.userId)
                if (!person) return null
                return (
                  <div key={`${row.userId}-${row.at}`} className="flex items-center gap-3 px-4 py-3">
                    <MomoAvatar
                      nickname={person.nickname}
                      accent={person.accent}
                      size={48}
                      online={person.online}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-momo-text">{person.nickname}</p>
                      <p className="text-xs text-momo-sub">{formatRelative(row.at)} 看过你</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => greetFromViewer(person.id)}
                      className="glass-primary-btn rounded-md px-3 py-1 text-xs"
                    >
                      打招呼
                    </button>
                  </div>
                )
              })
          )}
          {vipPerks.viewerShow < (u.profileViews ?? []).length && (
            <button
              type="button"
              onClick={() => openPanel('vip')}
              className="w-full py-3 text-center text-xs text-momo"
            >
              升级会员查看全部 {(u.profileViews ?? []).length} 条记录
            </button>
          )}
        </div>
      </SheetModal>

      <SheetModal open={panel === 'settings'} title="设置" onClose={() => setPanel(null)}>
        <div className="py-1">
          <ToggleRow
            label="新消息通知"
            on={settings.notifyMessage}
            onToggle={() => updateSettings({ notifyMessage: !settings.notifyMessage })}
          />
          <ToggleRow
            label="消息提示音"
            on={settings.notifySound}
            onToggle={() => updateSettings({ notifySound: !settings.notifySound })}
          />
          <ToggleRow
            label="接收陌生人消息"
            on={settings.acceptStrangerMsg}
            onToggle={() => updateSettings({ acceptStrangerMsg: !settings.acceptStrangerMsg })}
          />
          <ToggleRow
            label="对他人显示距离"
            on={settings.showDistance}
            onToggle={() => updateSettings({ showDistance: !settings.showDistance })}
          />
          {vipPerks.stealthBrowse ? (
            <ToggleRow
              label="隐身访问"
              desc="浏览他人资料不留访客记录（演示）"
              on={settings.stealthBrowse}
              onToggle={() => updateSettings({ stealthBrowse: !settings.stealthBrowse })}
            />
          ) : (
            <div className="border-b border-white/45 px-4 py-3">
              <p className="text-sm text-momo-text">隐身访问</p>
              <p className="text-[11px] text-momo-sub">
                至尊会员专属 ·{' '}
                <button type="button" onClick={() => openPanel('vip')} className="text-momo underline">
                  去升级
                </button>
              </p>
            </div>
          )}
        </div>
      </SheetModal>

      <SheetModal open={panel === 'help'} title="帮助与反馈" onClose={() => setPanel(null)} tall>
        <div className="px-4 py-3">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="描述你遇到的问题或建议…"
            rows={4}
            className="w-full resize-none rounded-lg glass-input px-3 py-2 text-sm outline-none focus:border-momo"
          />
          <button
            type="button"
            onClick={() => {
              if (submitFeedback(feedbackText)) {
                setFeedbackText('')
                showToast('反馈已提交，感谢你的建议')
              } else showToast('请先输入反馈内容')
            }}
            className="mt-3 w-full rounded-lg bg-momo py-2.5 text-sm font-medium text-white"
          >
            提交反馈
          </button>
          {(u.feedbackList ?? []).length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-momo-sub">历史反馈</p>
              <ul className="space-y-2">
                {u.feedbackList.map((f) => (
                  <li key={f.id} className="glass-panel-sm px-3 py-2 text-xs text-momo-text">
                    <p>{f.text}</p>
                    <p className="mt-1 text-momo-sub">{formatRelative(f.at)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SheetModal>

      <SheetModal open={panel === 'following'} title="我的关注" onClose={() => setPanel(null)} tall>
        <div className="divide-y divide-white/40 pb-3">
          {(u.following ?? []).length === 0 && (
            <p className="py-8 text-center text-sm text-momo-sub">还没有关注任何人</p>
          )}
          {(u.following ?? []).map((id) => {
            const person = userById(id)
            if (!person) return null
            return (
              <div key={id} className="flex items-center gap-3 px-4 py-3">
                <MomoAvatar nickname={person.nickname} accent={person.accent} size={44} />
                <span className="flex-1 text-sm text-momo-text">{person.nickname}</span>
                <button
                  type="button"
                  onClick={() => {
                    toggleFollow(id)
                    showToast('已取消关注')
                  }}
                  className="rounded-md border border-white/50 bg-white/35 px-3 py-1 text-xs text-momo-sub backdrop-blur-md"
                >
                  取消关注
                </button>
              </div>
            )
          })}
          <div className="px-4 pt-4">
            <p className="mb-2 text-xs text-momo-sub">推荐关注</p>
            {nearbyUsers
              .filter((p) => !(u.following ?? []).includes(p.id))
              .slice(0, 4)
              .map((person) => (
                <div
                  key={person.id}
                  className="glass-panel-sm mb-2 flex items-center gap-3 px-3 py-2"
                >
                  <MomoAvatar nickname={person.nickname} accent={person.accent} size={40} />
                  <span className="flex-1 text-sm">{person.nickname}</span>
                  <button
                    type="button"
                    onClick={() => {
                      toggleFollow(person.id)
                      showToast('关注成功')
                    }}
                    className="rounded-md bg-momo px-3 py-1 text-xs text-white"
                  >
                    关注
                  </button>
                </div>
              ))}
          </div>
        </div>
      </SheetModal>

      <SheetModal open={panel === 'fans'} title="我的粉丝" onClose={() => setPanel(null)} tall>
        <div className="divide-y divide-white/40">
          {(u.fans ?? []).map((id) => {
            const person = userById(id)
            if (!person) return null
            const followed = (u.following ?? []).includes(id)
            return (
              <div key={id} className="flex items-center gap-3 px-4 py-3">
                <MomoAvatar nickname={person.nickname} accent={person.accent} size={44} />
                <span className="flex-1 text-sm text-momo-text">{person.nickname}</span>
                <button
                  type="button"
                  onClick={() => {
                    toggleFollow(id)
                    showToast(followed ? '已取消关注' : '回关成功')
                  }}
                  className={`rounded-md px-3 py-1 text-xs ${
                    followed
                      ? 'border border-white/50 bg-white/35 text-momo-sub backdrop-blur-md'
                      : 'glass-primary-btn'
                  }`}
                >
                  {followed ? '已关注' : '回关'}
                </button>
              </div>
            )
          })}
        </div>
      </SheetModal>

      <SheetModal open={panel === 'moments'} title="我的动态" onClose={() => setPanel(null)} tall>
        <div className="px-4 py-3">
          <textarea
            value={momentText}
            onChange={(e) => setMomentText(e.target.value)}
            placeholder="分享此刻的想法…"
            rows={3}
            maxLength={120}
            className="w-full resize-none rounded-lg glass-input px-3 py-2 text-sm outline-none focus:border-momo"
          />
          <button
            type="button"
            onClick={() => {
              if (addMoment(momentText)) {
                setMomentText('')
                showToast('动态已发布')
              } else showToast('请输入动态内容')
            }}
            className="glass-primary-btn mt-2 w-full rounded-lg py-2 text-sm font-medium"
          >
            发布动态
          </button>
          <ul className="mt-4 space-y-3">
            {(u.moments ?? []).map((m) => (
              <li key={m.id} className="glass-panel-sm px-3 py-3">
                <p className="text-sm text-momo-text">{m.text}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-momo-sub">{formatRelative(m.at)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      deleteMoment(m.id)
                      showToast('已删除')
                    }}
                    className="text-[11px] text-red-500"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SheetModal>

      <CityPickerSheet
        open={cityPickerOpen}
        onClose={() => setCityPickerOpen(false)}
        value={{ province: editForm.province, city: editForm.city }}
        onSelect={({ province, city }) => {
          setEditForm((f) => ({ ...f, province, city }))
          setCityPickerOpen(false)
        }}
      />

      <AvatarSetupSheet
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        user={u}
        onApply={(partial) => updateUser(partial)}
        onToast={showToast}
      />
    </div>
  )
}