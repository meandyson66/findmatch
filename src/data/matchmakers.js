/** 红娘演示数据（纯前端） */
export const MATCHMAKERS = [
  {
    id: 'm1',
    name: '小叶红娘',
    title: '资深牵线 · 5年',
    city: '上海',
    rate: '98%',
    cases: '1200+',
    tags: ['同城', '腼腆破冰', '职场白领'],
    intro: '擅长慢热型嘉宾破冰，周末可安排视频预审。',
    vipOnly: false,
    accent: ['#FDA4AF', '#F472B6'],
    emoji: '🌸',
  },
  {
    id: 'm2',
    name: '安然',
    title: '金牌红娘',
    city: '杭州',
    rate: '96%',
    cases: '860+',
    tags: ['高学历', '家长沟通', '实名背调'],
    intro: '会员及以上可享一对一资料优化与匹配建议。',
    vipOnly: true,
    minVipLevel: 2,
    accent: ['#FCD34D', '#F59E0B'],
    emoji: '✨',
  },
  {
    id: 'm3',
    name: 'Kiki',
    title: '情感顾问',
    city: '深圳',
    rate: '94%',
    cases: '640+',
    tags: ['第一次见面策划', '约会复盘'],
    intro: '帮你把「聊得来」推进到「愿意再见」。',
    vipOnly: false,
    accent: ['#7DD3FC', '#38BDF8'],
    emoji: '💎',
  },
]

export const MATCH_SERVICES = [
  { id: 'basic', title: '基础牵线', desc: '红娘代为介绍 1 位匹配嘉宾', coin: 0, vipLevel: 0 },
  { id: 'vip', title: '会员专场', desc: '优先匹配 + 资料润色', coin: 50, vipLevel: 1 },
  { id: 'exclusive', title: '尊享定制', desc: '金牌红娘 7 日跟踪', coin: 200, vipLevel: 3 },
]