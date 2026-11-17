import { DEFAULT_USER } from './mockData'
import { inferProvinceFromCity } from './chinaRegions'

export const STORAGE_KEY = 'findmatch-state-v2'

const TAB_MAP = { radar: 'home', bottles: 'home', darkroom: 'me', home: 'home', messages: 'messages', me: 'me' }

const DEFAULT_NOTICES = [
  {
    id: 'sys-welcome',
    title: '欢迎来到寻伴',
    body: '完善资料能让附近的人更快认识你。请勿私下转账，线下见面请选择公共场所。',
    at: Date.now() - 86400000 * 2,
    read: false,
  },
  {
    id: 'sys-safety',
    title: '安全交友提示',
    body: '如遇骚扰可长按会话删除并拉黑。平台演示版所有数据仅存于本机。',
    at: Date.now() - 3600000 * 5,
    read: false,
  },
  {
    id: 'sys-identity',
    title: '实名认证提示',
    body: '未实名用户无法发送消息或发起新的聊天。请在「我的」完成实名认证后再使用聊天功能。',
    at: Date.now() - 3600000,
    read: false,
  },
]

export function getInitialState() {
  return {
    tab: 'home',
    homeSubTab: 'nearby',
    user: { ...DEFAULT_USER },
    homeFilters: { gender: 'all', onlineOnly: false, maxKm: 5 },
    nearbyOverrides: {},
    homeRefreshAt: null,
    radarLinks: {},
    bottleLinks: {},
    chats: {},
    chatMeta: {},
    systemNotices: DEFAULT_NOTICES,
    badgesEarned: [],
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const legacy = localStorage.getItem('findmatch-state-v1')
      if (legacy) {
        const parsed = JSON.parse(legacy)
        return normalizeParsed(parsed)
      }
      return getInitialState()
    }
    return normalizeParsed(JSON.parse(raw))
  } catch {
    return getInitialState()
  }
}

function normalizeUser(raw = {}) {
  const city = raw.city ?? DEFAULT_USER.city
  const province = raw.province ?? inferProvinceFromCity(city)
  return {
    ...DEFAULT_USER,
    ...raw,
    province,
    city,
    avatarAccent: raw.avatarAccent ?? DEFAULT_USER.avatarAccent,
    avatarEmoji: raw.avatarEmoji ?? null,
    avatarImage: raw.avatarImage ?? null,
    education: raw.education ?? DEFAULT_USER.education,
    job: raw.job ?? DEFAULT_USER.job,
    jobTitle: raw.jobTitle ?? DEFAULT_USER.jobTitle,
    income: raw.income ?? DEFAULT_USER.income,
    heightCm: raw.heightCm ?? DEFAULT_USER.heightCm,
    marital: raw.marital ?? DEFAULT_USER.marital,
    hometown: raw.hometown ?? DEFAULT_USER.hometown ?? '',
    company: raw.company ?? DEFAULT_USER.company ?? '',
    settings: { ...DEFAULT_USER.settings, ...(raw.settings ?? {}) },
    soulTags: raw.soulTags?.length ? raw.soulTags : DEFAULT_USER.soulTags,
    following: raw.following ?? DEFAULT_USER.following,
    fans: raw.fans ?? DEFAULT_USER.fans,
    moments: raw.moments ?? DEFAULT_USER.moments,
    profileViews: raw.profileViews ?? DEFAULT_USER.profileViews,
    profileViewsUnread:
      typeof raw.profileViewsUnread === 'number'
        ? raw.profileViewsUnread
        : DEFAULT_USER.profileViewsUnread,
    feedbackList: raw.feedbackList ?? [],
    realNameVerified: Boolean(raw.realNameVerified),
    realNameMasked: raw.realNameMasked ?? '',
    idCardMasked: raw.idCardMasked ?? '',
    identityVerifiedAt: raw.identityVerifiedAt ?? null,
    coinBalance: typeof raw.coinBalance === 'number' ? raw.coinBalance : 0,
    vipTotalRecharge: typeof raw.vipTotalRecharge === 'number' ? raw.vipTotalRecharge : 0,
    rechargeHistory: raw.rechargeHistory ?? [],
  }
}

function normalizeParsed(parsed) {
  return {
    ...getInitialState(),
    ...parsed,
    tab: TAB_MAP[parsed.tab] ?? parsed.tab ?? 'home',
    homeSubTab: parsed.homeSubTab ?? 'nearby',
    user: normalizeUser(parsed.user),
    radarLinks: parsed.radarLinks ?? {},
    bottleLinks: parsed.bottleLinks ?? {},
    chats: parsed.chats ?? {},
    chatMeta: parsed.chatMeta ?? {},
    homeFilters: { ...getInitialState().homeFilters, ...(parsed.homeFilters ?? {}) },
    nearbyOverrides: parsed.nearbyOverrides ?? {},
    homeRefreshAt: parsed.homeRefreshAt ?? null,
    systemNotices: parsed.systemNotices?.length
      ? parsed.systemNotices
      : DEFAULT_NOTICES,
    badgesEarned: parsed.badgesEarned ?? [],
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  return getInitialState()
}

export function chatIdForRadar(profileId) {
  return `chat-radar-${profileId}`
}

export function chatIdForBottle(bottleId) {
  return `chat-bottle-${bottleId}`
}