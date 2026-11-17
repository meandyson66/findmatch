import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { NEARBY_USERS } from '../data/mockData'
import { RECHARGE_PACKAGES, getVipPerks } from '../data/vip'
import { chatIdForRadar, loadState, resetState, saveState } from '../data/storage'
import { RealNameVerifySheet } from '../components/me/RealNameVerifySheet'
import { isIdentityVerified } from '../utils/identity'

const AppContext = createContext(null)

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadState())
  const [realNameSheetOpen, setRealNameSheetOpen] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  const patch = useCallback((partial) => {
    setState((s) => ({ ...s, ...partial }))
  }, [])

  const resetDemo = useCallback(() => {
    setState(resetState())
  }, [])

  const openRealNameVerify = useCallback(() => setRealNameSheetOpen(true), [])
  const closeRealNameVerify = useCallback(() => setRealNameSheetOpen(false), [])

  const submitRealNameVerification = useCallback((payload) => {
    if (!payload?.realName || !payload?.idCardMasked) return false
    setState((s) => ({
      ...s,
      user: {
        ...s.user,
        realNameVerified: true,
        realNameMasked: payload.realNameMasked ?? '',
        idCardMasked: payload.idCardMasked,
        identityVerifiedAt: Date.now(),
      },
    }))
    return true
  }, [])

  const purchaseRecharge = useCallback((packageId) => {
    const pkg = RECHARGE_PACKAGES.find((p) => p.id === packageId)
    if (!pkg) return { ok: false, message: '套餐不存在' }
    let tierName = '普通'
    setState((s) => {
      const total = (s.user.vipTotalRecharge ?? 0) + pkg.price
      tierName = getVipPerks(total).tier.name
      const record = {
        id: newId(),
        packageId: pkg.id,
        price: pkg.price,
        coins: pkg.coins,
        at: Date.now(),
      }
      return {
        ...s,
        user: {
          ...s.user,
          vipTotalRecharge: total,
          coinBalance: (s.user.coinBalance ?? 0) + pkg.coins,
          rechargeHistory: [record, ...(s.user.rechargeHistory ?? [])].slice(0, 30),
        },
      }
    })
    return { ok: true, message: `充值成功，当前为${tierName}会员` }
  }, [])

  const updateUser = useCallback((partial) => {
    setState((s) => ({
      ...s,
      user: {
        ...s.user,
        ...partial,
        settings: partial.settings
          ? { ...s.user.settings, ...partial.settings }
          : s.user.settings,
      },
    }))
  }, [])

  const updateSettings = useCallback((partial) => {
    setState((s) => ({
      ...s,
      user: {
        ...s.user,
        settings: { ...s.user.settings, ...partial },
      },
    }))
  }, [])

  const clearProfileViewsUnread = useCallback(() => {
    setState((s) => ({
      ...s,
      user: { ...s.user, profileViewsUnread: 0 },
    }))
  }, [])

  const submitFeedback = useCallback((text) => {
    const body = text.trim()
    if (!body) return false
    const item = { id: newId(), text: body, at: Date.now() }
    setState((s) => ({
      ...s,
      user: {
        ...s.user,
        feedbackList: [item, ...(s.user.feedbackList ?? [])].slice(0, 20),
      },
    }))
    return true
  }, [])

  const toggleFollow = useCallback((userId) => {
    setState((s) => {
      const set = new Set(s.user.following ?? [])
      if (set.has(userId)) set.delete(userId)
      else set.add(userId)
      return { ...s, user: { ...s.user, following: [...set] } }
    })
  }, [])

  const addMoment = useCallback((text) => {
    const body = text.trim()
    if (!body) return false
    const item = { id: newId(), text: body, at: Date.now() }
    setState((s) => ({
      ...s,
      user: { ...s.user, moments: [item, ...(s.user.moments ?? [])] },
    }))
    return true
  }, [])

  const deleteMoment = useCallback((momentId) => {
    setState((s) => ({
      ...s,
      user: {
        ...s.user,
        moments: (s.user.moments ?? []).filter((m) => m.id !== momentId),
      },
    }))
  }, [])

  const completeSoulQuiz = useCallback((profileId, answers, matched) => {
    if (!matched) return null
    const chatId = chatIdForRadar(profileId)
    const profile = NEARBY_USERS.find((p) => p.id === profileId)
    const now = Date.now()
    let outcome = null
    setState((s) => {
      if (!isIdentityVerified(s.user)) {
        outcome = 'NEED_IDENTITY'
        return s
      }
      const messages = [
        {
          id: newId(),
          text: '你已向对方打招呼，快发一句开场白吧',
          from: 'system',
          at: now,
        },
      ]
      outcome = chatId
      return {
        ...s,
        radarLinks: {
          ...s.radarLinks,
          [profileId]: { quizDone: true, answers, unlockedAt: now },
        },
        chats: {
          ...s.chats,
          [chatId]: {
            partnerId: profileId,
            source: 'radar',
            title: profile?.nickname ?? '附近的人',
            messages,
            updatedAt: now,
            unread: 0,
          },
        },
      }
    })
    return outcome
  }, [])

  const sendMessage = useCallback((chatId, text, from = 'me') => {
    let sent = false
    setState((s) => {
      const chat = s.chats[chatId]
      if (!chat) return s
      if (from === 'me' && !isIdentityVerified(s.user)) return s
      sent = true
      const now = Date.now()
      const isFromThem = from === 'them'
      return {
        ...s,
        chats: {
          ...s.chats,
          [chatId]: {
            ...chat,
            updatedAt: now,
            unread: isFromThem ? (chat.unread ?? 0) + 1 : chat.unread ?? 0,
            messages: [
              ...chat.messages,
              { id: newId(), text, from, at: now },
            ],
          },
        },
      }
    })
    return sent
  }, [])

  const markChatRead = useCallback((chatId) => {
    setState((s) => {
      const chat = s.chats[chatId]
      if (!chat || !chat.unread) return s
      return {
        ...s,
        chats: {
          ...s.chats,
          [chatId]: { ...chat, unread: 0 },
        },
      }
    })
  }, [])

  const appendSimReply = useCallback((chatId, text) => {
    setTimeout(() => {
      sendMessage(chatId, text, 'them')
    }, 800)
  }, [sendMessage])

  const markIcebreakerUsed = useCallback(() => {}, [])

  const setHomeFilters = useCallback((partial) => {
    setState((s) => ({
      ...s,
      homeFilters: { ...s.homeFilters, ...partial },
    }))
  }, [])

  const refreshNearby = useCallback(() => {
    const overrides = {}
    NEARBY_USERS.forEach((u) => {
      const delta = (Math.random() - 0.5) * 0.8
      overrides[u.id] = {
        distanceKm: Math.max(0.3, Math.round((u.distanceKm + delta) * 10) / 10),
      }
    })
    setState((s) => ({
      ...s,
      nearbyOverrides: overrides,
      homeRefreshAt: Date.now(),
    }))
  }, [])

  const deleteChat = useCallback((chatId) => {
    setState((s) => {
      const { [chatId]: removed, ...chats } = s.chats
      const { [chatId]: _m, ...chatMeta } = s.chatMeta ?? {}
      const partnerId = removed?.partnerId
      const radarLinks = { ...s.radarLinks }
      if (partnerId && radarLinks[partnerId]) delete radarLinks[partnerId]
      return { ...s, chats, chatMeta, radarLinks }
    })
  }, [])

  const togglePinChat = useCallback((chatId) => {
    setState((s) => {
      const cur = s.chatMeta?.[chatId]?.pinned
      return {
        ...s,
        chatMeta: {
          ...s.chatMeta,
          [chatId]: { ...s.chatMeta?.[chatId], pinned: !cur },
        },
      }
    })
  }, [])

  const markAllChatsRead = useCallback(() => {
    setState((s) => {
      const chats = { ...s.chats }
      Object.keys(chats).forEach((id) => {
        chats[id] = { ...chats[id], unread: 0 }
      })
      return { ...s, chats }
    })
  }, [])

  const markSystemNoticesRead = useCallback(() => {
    setState((s) => ({
      ...s,
      systemNotices: (s.systemNotices ?? []).map((n) => ({ ...n, read: true })),
    }))
  }, [])

  const getMergedUser = useCallback(
    (user) => {
      const o = state.nearbyOverrides?.[user.id]
      if (!o) return user
      return { ...user, ...o }
    },
    [state.nearbyOverrides]
  )

  const isRadarUnlocked = useCallback(
    (id) => Boolean(state.radarLinks[id]?.unlockedAt),
    [state.radarLinks]
  )

  const value = useMemo(
    () => ({
      state,
      patch,
      resetDemo,
      purchaseRecharge,
      updateUser,
      updateSettings,
      clearProfileViewsUnread,
      submitFeedback,
      toggleFollow,
      addMoment,
      deleteMoment,
      completeSoulQuiz,
      sendMessage,
      appendSimReply,
      markIcebreakerUsed,
      markChatRead,
      setHomeFilters,
      refreshNearby,
      deleteChat,
      togglePinChat,
      markAllChatsRead,
      markSystemNoticesRead,
      getMergedUser,
      isRadarUnlocked,
      nearbyUsers: NEARBY_USERS,
      openRealNameVerify,
      closeRealNameVerify,
      submitRealNameVerification,
    }),
    [
      state,
      patch,
      resetDemo,
      openRealNameVerify,
      closeRealNameVerify,
      submitRealNameVerification,
      purchaseRecharge,
      updateUser,
      updateSettings,
      clearProfileViewsUnread,
      submitFeedback,
      toggleFollow,
      addMoment,
      deleteMoment,
      completeSoulQuiz,
      sendMessage,
      appendSimReply,
      markIcebreakerUsed,
      markChatRead,
      setHomeFilters,
      refreshNearby,
      deleteChat,
      togglePinChat,
      markAllChatsRead,
      markSystemNoticesRead,
      getMergedUser,
      isRadarUnlocked,
    ]
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <RealNameVerifySheet
        open={realNameSheetOpen}
        onClose={closeRealNameVerify}
        onSubmit={submitRealNameVerification}
        verified={state.user.realNameVerified}
        maskedName={state.user.realNameMasked}
        maskedId={state.user.idCardMasked}
      />
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}