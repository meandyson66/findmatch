import { Crown, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProfileSheet } from '../components/home/ProfileSheet'
import { SoulQuizModal } from '../components/radar/SoulQuizModal'
import { VipMemberCard } from '../components/vip/VipMemberCard'
import { useApp } from '../context/AppContext'
import {
  buildVipMemberList,
  findVipMemberById,
  findVipMemberProfile,
} from '../data/vipMembers'
import { chatIdForRadar } from '../data/storage'
import { getVipPerks } from '../data/vip'
import { isIdentityVerified } from '../utils/identity'

export function VipPage({ onOpenChat }) {
  const {
    state,
    patch,
    getMergedUser,
    nearbyUsers,
    isRadarUnlocked,
    completeSoulQuiz,
    toggleFollow,
    openRealNameVerify,
  } = useApp()
  const vipPerks = getVipPerks(state.user.vipTotalRecharge ?? 0)
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now())
  const [toast, setToast] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [profileMemberId, setProfileMemberId] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const [targetId, setTargetId] = useState(null)

  const members = useMemo(
    () => buildVipMemberList(shuffleSeed).members,
    [shuffleSeed]
  )

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const reshuffle = () => {
    setRefreshing(true)
    setShuffleSeed(Date.now())
    setTimeout(() => {
      setRefreshing(false)
      showToast('已换一批会员')
    }, 400)
  }

  const resolveProfile = (memberId) => {
    const member = findVipMemberById(memberId)
    if (member?.linkUserId) {
      const fromNearby = nearbyUsers.find((u) => u.id === member.linkUserId)
      if (fromNearby) return getMergedUser(fromNearby)
    }
    return findVipMemberProfile(memberId)
  }

  const contactId = (member) => member?.linkUserId ?? member?.id

  const openProfile = (member) => {
    setProfileMemberId(member.id)
  }

  const profileUser = profileMemberId ? resolveProfile(profileMemberId) : null
  const activeMember = profileMemberId ? findVipMemberById(profileMemberId) : null
  const greetProfileId = activeMember ? contactId(activeMember) : null
  const resolveContactProfile = (id) => {
    if (!id) return null
    const vipProf = findVipMemberProfile(id)
    if (vipProf) return vipProf
    const n = nearbyUsers.find((u) => u.id === id)
    return n ? getMergedUser(n) : null
  }

  const target = targetId ? resolveContactProfile(targetId) : null
  const profileFollowing = greetProfileId
    ? (state.user.following ?? []).includes(greetProfileId)
    : false

  const greet = (memberOrId) => {
    const id =
      typeof memberOrId === 'string'
        ? memberOrId
        : contactId(memberOrId) ?? memberOrId.id
    setProfileMemberId(null)
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
      showToast('默契度不足，再试一次吧')
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
    setTargetId(null)
  }

  return (
    <div className="relative flex h-full flex-col">
      <header className="glass-bar shrink-0 border-b px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-[17px] font-semibold text-momo-text">
            <Crown className="h-5 w-5 text-amber-600" />
            会员嘉宾
          </h1>
          <button
            type="button"
            onClick={reshuffle}
            disabled={refreshing}
            className="rounded-full p-1.5 text-momo-text active:bg-white/40 disabled:opacity-50"
            title="换一批"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-[10px] text-momo-sub">平台会员 · 点头像查看资料并沟通</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <div className="glass-panel mt-2 overflow-hidden px-2 py-1">
          {members.map((m) => (
            <VipMemberCard key={m.id} member={m} onPress={openProfile} />
          ))}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}

      <ProfileSheet
        user={profileUser}
        open={Boolean(profileMemberId && profileUser)}
        onClose={() => setProfileMemberId(null)}
        onGreet={() => {
          if (activeMember) greet(activeMember)
          else if (greetProfileId) greet(greetProfileId)
        }}
        isFollowing={profileFollowing}
        onToggleFollow={() => {
          if (!greetProfileId) return
          toggleFollow(greetProfileId)
          showToast(profileFollowing ? '已取消关注' : '关注成功')
        }}
        greeted={greetProfileId ? isRadarUnlocked(greetProfileId) : false}
      />

      <SoulQuizModal
        open={quizOpen}
        profile={target}
        onClose={() => {
          setQuizOpen(false)
          setTargetId(null)
        }}
        onComplete={handleQuizComplete}
        minMatch={vipPerks.soulQuizMinMatch}
      />
    </div>
  )
}