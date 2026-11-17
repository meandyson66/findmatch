import { ChevronDown, Filter, RefreshCw, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { chatIdForRadar } from '../data/storage'
import { CityPickerSheet } from '../components/home/CityPickerSheet'
import { formatUserLocation } from '../data/chinaRegions'
import { MomoAvatar } from '../components/MomoAvatar'
import { FilterSheet } from '../components/home/FilterSheet'
import { ProfileSheet } from '../components/home/ProfileSheet'
import { SoulQuizModal } from '../components/radar/SoulQuizModal'
import { ResetButton } from '../components/ResetButton'
import { useApp } from '../context/AppContext'
import { getVipPerks } from '../data/vip'
import { isIdentityVerified } from '../utils/identity'
import { formatRelative } from '../utils/formatTime'

function NearbyRow({ user, onGreet, onOpen, greeted }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(user.id)}
      className="glass-row glass-row-active flex w-full items-center gap-3 px-3 py-3 text-left"
    >
      <MomoAvatar nickname={user.nickname} accent={user.accent} size={56} online={user.online} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-medium text-momo-text">{user.nickname}</span>
          <span className="shrink-0 text-xs text-momo-sub">
            {user.age} · {user.gender}
          </span>
        </p>
        <p className="mt-0.5 truncate text-xs text-momo-sub">{user.bio}</p>
        <p className="mt-1 text-[10px] text-momo-sub">
          {[user.education, user.income].filter(Boolean).join(' · ')}
          {[user.education, user.income].some(Boolean) ? ' · ' : ''}
          {user.distanceKm}km · {user.soulTags.slice(0, 2).join(' · ')}
        </p>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onGreet(user.id)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation()
            onGreet(user.id)
          }
        }}
        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
          greeted ? 'bg-white/50 text-momo-text' : 'glass-primary-btn active:opacity-90'
        }`}
      >
        {greeted ? '发消息' : '打招呼'}
      </span>
    </button>
  )
}

function RecommendCard({ user, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(user.id)}
      className="glass-panel-sm overflow-hidden text-left"
    >
      <div
        className="flex h-36 items-end p-2"
        style={{ background: `linear-gradient(160deg, ${user.accent}55, ${user.accent})` }}
      >
        <span className="rounded bg-black/25 px-1.5 py-0.5 text-[10px] text-white">
          {user.distanceKm}km
        </span>
      </div>
      <div className="p-2">
        <p className="text-sm font-medium text-momo-text">
          {user.nickname} {user.age}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[11px] text-momo-sub">{user.bio}</p>
      </div>
    </button>
  )
}

function applyFilters(users, filters, query) {
  const q = query.trim().toLowerCase()
  return users.filter((u) => {
    if (filters.gender !== 'all' && u.gender !== filters.gender) return false
    if (filters.onlineOnly && !u.online) return false
    if (u.distanceKm > filters.maxKm) return false
    if (q) {
      const hay = `${u.nickname}${u.bio}${u.soulTags.join('')}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function HomePage({ onOpenChat }) {
  const {
    state,
    patch,
    nearbyUsers,
    isRadarUnlocked,
    completeSoulQuiz,
    setHomeFilters,
    refreshNearby,
    getMergedUser,
    toggleFollow,
    updateUser,
    openRealNameVerify,
  } = useApp()
  const sub = state.homeSubTab ?? 'nearby'
  const filters = state.homeFilters ?? { gender: 'all', onlineOnly: false, maxKm: 5 }
  const vipPerks = useMemo(
    () => getVipPerks(state.user.vipTotalRecharge ?? 0),
    [state.user.vipTotalRecharge]
  )

  const [quizOpen, setQuizOpen] = useState(false)
  const [targetId, setTargetId] = useState(null)
  const [profileId, setProfileId] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const merged = useMemo(
    () => nearbyUsers.map((u) => getMergedUser(u)),
    [nearbyUsers, getMergedUser]
  )

  const filtered = useMemo(() => {
    if (!state.user.radarOn) return []
    return applyFilters(merged, filters, search).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [merged, filters, search, state.user.radarOn])

  const recommend = useMemo(
    () => applyFilters(merged.filter((u) => u.recommend), filters, search),
    [merged, filters, search]
  )

  const target = merged.find((u) => u.id === targetId)
  const profileUser = merged.find((u) => u.id === profileId)
  const profileFollowing = profileId ? (state.user.following ?? []).includes(profileId) : false

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const applyHomeFilters = (partial) => {
    const next = { ...partial }
    if (next.maxKm != null && next.maxKm > vipPerks.maxFilterKm) {
      showToast(`当前会员最远 ${vipPerks.maxFilterKm} km，升级可解锁更远距离`)
      next.maxKm = vipPerks.maxFilterKm
    }
    setHomeFilters(next)
  }

  const greet = (id) => {
    setProfileId(null)
    if (isRadarUnlocked(id)) {
      onOpenChat?.(chatIdForRadar(id))
      return
    }
    if (!isIdentityVerified(state.user)) {
      showToast('请先完成实名认证后再发起聊天')
      openRealNameVerify()
      return
    }
    if (vipPerks.skipSoulQuiz) {
      const chatId = completeSoulQuiz(id, {}, true)
      if (chatId) {
        showToast('至尊特权：已跳过默契测试')
        patch({ tab: 'messages' })
        setTimeout(() => onOpenChat?.(chatId), 200)
      }
      return
    }
    setTargetId(id)
    setQuizOpen(true)
  }

  const handleQuizComplete = (answers, matched) => {
    setQuizOpen(false)
    if (!targetId) return
    if (!matched) {
      showToast('默契度不足，再试一次或换一位吧')
      return
    }
    const chatId = completeSoulQuiz(targetId, answers, matched)
    if (chatId === 'NEED_IDENTITY') {
      showToast('请先完成实名认证')
      openRealNameVerify()
      return
    }
    if (chatId) {
      patch({ tab: 'messages' })
      setTimeout(() => onOpenChat?.(chatId), 200)
    }
  }

  const doRefresh = () => {
    setRefreshing(true)
    refreshNearby()
    setTimeout(() => {
      setRefreshing(false)
      showToast('附近列表已更新')
    }, 600)
  }

  const filterActive =
    filters.gender !== 'all' || filters.onlineOnly || filters.maxKm !== 5

  return (
    <div className="relative flex h-full flex-col">
      <header className="glass-bar shrink-0 border-b px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCityOpen(true)}
            className="flex items-center gap-0.5 text-[17px] font-semibold text-momo-text"
          >
            {formatUserLocation(state.user)}
            <ChevronDown className="h-4 w-4 text-momo-sub" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={doRefresh}
              disabled={refreshing}
              className="rounded-full p-1.5 text-momo-text active:bg-white/40 disabled:opacity-50"
              title="刷新附近"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <ResetButton />
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className={`rounded-full p-1.5 ${filterActive ? 'text-momo' : 'text-momo-text'}`}
              title="筛选"
            >
              <Filter className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className="glass-input mt-2 flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-momo-sub" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索昵称 / 标签"
            className="w-full bg-transparent text-sm text-momo-text outline-none placeholder:text-momo-sub"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-momo-sub">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {state.homeRefreshAt && (
          <p className="mt-1 text-center text-[10px] text-momo-sub">
            上次刷新 {formatRelative(state.homeRefreshAt)}
          </p>
        )}
        <div className="mt-3 flex gap-6 border-b border-white/45">
          {[
            { id: 'nearby', label: '附近' },
            { id: 'recommend', label: '推荐' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => patch({ homeSubTab: t.id })}
              className={`relative pb-2 text-[15px] ${
                sub === t.id ? 'font-semibold text-momo-text' : 'text-momo-sub'
              }`}
            >
              {t.label}
              {sub === t.id && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-momo" />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {sub === 'nearby' && (
          <>
            {!state.user.radarOn && (
              <p className="glass-panel mx-3 mt-2 px-4 py-8 text-center text-sm text-momo-sub">
                你已在「我的」中关闭位置展示，附近列表已隐藏
                <br />
                <button
                  type="button"
                  onClick={() => patch({ tab: 'me' })}
                  className="mt-3 text-momo underline"
                >
                  去开启
                </button>
              </p>
            )}
            {state.user.radarOn && filtered.length === 0 && (
              <p className="glass-panel mx-3 mt-2 px-4 py-8 text-center text-sm text-momo-sub">
                没有符合筛选条件的人
                <button
                  type="button"
                  onClick={() => {
                    setHomeFilters({ gender: 'all', onlineOnly: false, maxKm: 5 })
                    setSearch('')
                  }}
                  className="mt-2 block w-full text-momo"
                >
                  清除筛选
                </button>
              </p>
            )}
            {state.user.radarOn &&
              filtered.map((u) => (
                <NearbyRow
                  key={u.id}
                  user={u}
                  greeted={isRadarUnlocked(u.id)}
                  onGreet={greet}
                  onOpen={setProfileId}
                />
              ))}
          </>
        )}
        {sub === 'recommend' && vipPerks.priorityExpose && (
          <p className="mx-3 mt-2 rounded-lg border border-momo/25 bg-momo/10 px-3 py-2 text-center text-[11px] text-momo-dark">
            钻石及以上：你的资料已在推荐位优先展示（演示）
          </p>
        )}
        {sub === 'recommend' && (
          <div className="grid grid-cols-2 gap-2 p-2">
            {recommend.length === 0 ? (
              <p className="glass-panel col-span-2 px-4 py-8 text-center text-sm text-momo-sub">
                暂无推荐，试试调整筛选
              </p>
            ) : (
              recommend.map((u) => (
                <RecommendCard key={u.id} user={u} onOpen={setProfileId} />
              ))
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={applyHomeFilters}
        onReset={() => applyHomeFilters({ gender: 'all', onlineOnly: false, maxKm: 5 })}
        maxFilterKm={vipPerks.maxFilterKm}
        onNeedVip={() => {
          showToast('该距离需更高会员等级，请到「我的」会员中心充值')
          patch({ tab: 'me' })
        }}
      />

      <CityPickerSheet
        open={cityOpen}
        onClose={() => setCityOpen(false)}
        value={{ province: state.user.province, city: state.user.city }}
        onSelect={({ province, city }) => {
          updateUser({ province, city })
          showToast(`已切换到 ${city}`)
          refreshNearby()
        }}
      />

      <ProfileSheet
        user={profileUser}
        open={Boolean(profileId && profileUser)}
        onClose={() => setProfileId(null)}
        onGreet={() => profileUser && greet(profileUser.id)}
        isFollowing={profileFollowing}
        onToggleFollow={() => {
          if (!profileUser) return
          toggleFollow(profileUser.id)
          showToast(profileFollowing ? '已取消关注' : '关注成功')
        }}
        greeted={profileUser ? isRadarUnlocked(profileUser.id) : false}
      />

      <SoulQuizModal
        open={quizOpen}
        profile={target}
        onClose={() => setQuizOpen(false)}
        onComplete={handleQuizComplete}
        minMatch={vipPerks.soulQuizMinMatch}
      />
    </div>
  )
}