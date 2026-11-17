/** 累计充值（元）决定会员等级；纯前端演示，无真实支付 */

export const VIP_TIERS = [
  {
    level: 0,
    name: '普通',
    minRecharge: 0,
    color: '#9C958B',
    perks: ['附近列表与基础筛选', '筛选距离 5 km', '默契测试需 2 题契合', '访客记录展示 3 条'],
  },
  {
    level: 1,
    name: '白银',
    minRecharge: 30,
    color: '#B8C5D6',
    perks: ['昵称旁白银标识', '筛选距离 10 km', '访客记录展示 8 条', '充值赠送寻伴币加成'],
  },
  {
    level: 2,
    name: '黄金',
    minRecharge: 98,
    color: '#E8B84A',
    perks: ['黄金标识', '筛选距离 20 km', '默契测试 1 题契合即可', '附近刷新更顺畅（演示）'],
  },
  {
    level: 3,
    name: '钻石',
    minRecharge: 298,
    color: '#7EC8E3',
    perks: ['钻石标识', '筛选距离 50 km', '优先曝光（首页推荐加权）', '访客记录无限制'],
  },
  {
    level: 4,
    name: '至尊',
    minRecharge: 648,
    color: '#2E1A4D',
    perks: ['至尊标识', '打招呼免默契测试', '可开启隐身访问', '全部距离与筛选特权'],
  },
]

const PERK_CONFIG = [
  {
    maxFilterKm: 5,
    soulQuizMinMatch: 2,
    skipSoulQuiz: false,
    viewerShow: 3,
    priorityExpose: false,
    stealthBrowse: false,
  },
  {
    maxFilterKm: 10,
    soulQuizMinMatch: 2,
    skipSoulQuiz: false,
    viewerShow: 8,
    priorityExpose: false,
    stealthBrowse: false,
  },
  {
    maxFilterKm: 20,
    soulQuizMinMatch: 1,
    skipSoulQuiz: false,
    viewerShow: 999,
    priorityExpose: false,
    stealthBrowse: false,
  },
  {
    maxFilterKm: 50,
    soulQuizMinMatch: 1,
    skipSoulQuiz: false,
    viewerShow: 999,
    priorityExpose: true,
    stealthBrowse: false,
  },
  {
    maxFilterKm: 50,
    soulQuizMinMatch: 0,
    skipSoulQuiz: true,
    viewerShow: 999,
    priorityExpose: true,
    stealthBrowse: true,
  },
]

export const RECHARGE_PACKAGES = [
  { id: 'p6', price: 6, coins: 60, label: '6 元', subtitle: '60 寻伴币', tag: '尝鲜' },
  { id: 'p30', price: 30, coins: 330, label: '30 元', subtitle: '330 寻伴币', tag: '升白银' },
  { id: 'p98', price: 98, coins: 1100, label: '98 元', subtitle: '1100 寻伴币', tag: '升黄金' },
  { id: 'p298', price: 298, coins: 3500, label: '298 元', subtitle: '3500 寻伴币', tag: '升钻石' },
  { id: 'p648', price: 648, coins: 8000, label: '648 元', subtitle: '8000 寻伴币', tag: '升至尊' },
]

export function resolveVipLevel(totalRecharge = 0) {
  let level = 0
  for (const t of VIP_TIERS) {
    if (totalRecharge >= t.minRecharge) level = t.level
  }
  return level
}

export function getVipTier(level) {
  return VIP_TIERS[level] ?? VIP_TIERS[0]
}

export function getVipPerks(totalRecharge = 0) {
  const level = resolveVipLevel(totalRecharge)
  return {
    level,
    tier: getVipTier(level),
    ...PERK_CONFIG[level],
  }
}

export function getNextTier(level) {
  return VIP_TIERS[level + 1] ?? null
}

/** 当前等级升级进度 0–1 */
export function vipProgress(totalRecharge = 0) {
  const level = resolveVipLevel(totalRecharge)
  const cur = VIP_TIERS[level]
  const next = VIP_TIERS[level + 1]
  if (!next) return 1
  const span = next.minRecharge - cur.minRecharge
  if (span <= 0) return 1
  return Math.min(1, Math.max(0, (totalRecharge - cur.minRecharge) / span))
}

export function allFilterKmOptions() {
  return [2, 5, 10, 20, 50]
}