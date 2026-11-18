/**
 * 首页搜索栏下展示区数据（视频 / 图片 / 广告 / 通告）
 * 后续可改为接口或运营后台下发；也可用 localStorage 覆盖演示
 */
export const PROMO_STORAGE_KEY = 'findmatch-home-promos-v1'

export const DEFAULT_HOME_PROMOS = [
  {
    id: 'notice-safety',
    type: 'notice',
    tag: '通告',
    title: '文明交友 · 实名后发言',
    subtitle: '请勿私下转账，线下见面选择公共场所',
    accent: ['#5B8FB9', '#3EB575'],
  },
  {
    id: 'ad-vip',
    type: 'ad',
    tag: '广告',
    title: '会员季卡限时加赠寻伴币',
    subtitle: '开通黄金会员 · 默契测试 1 题通关',
    accent: ['#E8B84A', '#E07A38'],
    action: { tab: 'vip' },
  },
  {
    id: 'video-intro',
    type: 'video',
    tag: '视频',
    title: '一分钟了解寻伴',
    subtitle: '如何筛选、打招呼与安全提示',
    accent: ['#A78BFA', '#F472B6'],
    videoPoster: null,
  },
  {
    id: 'img-matchmaker',
    type: 'image',
    tag: '专题',
    title: '红娘牵线服务上线',
    subtitle: '会员专享金牌红娘 · 资料润色',
    accent: ['#FB7185', '#FDBA74'],
    action: { tab: 'matchmaker' },
  },
]

export const PROMO_TYPE_META = {
  notice: { label: '通告', className: 'bg-sky-500/25 text-sky-900' },
  ad: { label: '广告', className: 'bg-amber-500/30 text-amber-950' },
  video: { label: '视频', className: 'bg-violet-500/25 text-violet-900' },
  image: { label: '图片', className: 'bg-rose-500/25 text-rose-900' },
}

export function loadHomePromos() {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY)
    if (!raw) return DEFAULT_HOME_PROMOS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_HOME_PROMOS
  } catch {
    return DEFAULT_HOME_PROMOS
  }
}