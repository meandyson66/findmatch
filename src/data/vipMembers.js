/**
 * 会员 Tab：展示会员用户特权（非充值页）
 * 前 5 位高级会员固定顺序，其余从池子中随机抽取
 */
import { resolveDemoAvatar } from './demoAvatars'
import { getVipTier } from './vip'

/** 固定展示的高级会员（至尊 / 钻石为主） */
export const VIP_FEATURED_FIXED = [
  {
    id: 'vf1',
    nickname: '星河引路人',
    age: 32,
    gender: '男',
    city: '上海',
    vipLevel: 4,
    accent: '#5a3d8a',
    bio: '商务差旅多，会员隐身浏览更自在',
    featureLine: '至尊 · 打招呼免默契测试',
    perkTags: ['免默契测试', '隐身访问', '全距离筛选'],
  },
  {
    id: 'vf2',
    nickname: '琥珀海岸线',
    age: 28,
    gender: '女',
    city: '杭州',
    vipLevel: 4,
    accent: '#E8B84A',
    bio: '红娘定制牵线后，见面成功率明显提高',
    featureLine: '至尊 · 红娘尊享定制通道',
    perkTags: ['优先曝光', '红娘专场', '访客无限'],
  },
  {
    id: 'vf3',
    nickname: '北纬三十度',
    age: 30,
    gender: '男',
    city: '成都',
    vipLevel: 3,
    accent: '#7EC8E3',
    bio: '首页推荐加权后，收到的打招呼翻倍',
    featureLine: '钻石 · 优先曝光推荐位',
    perkTags: ['优先曝光', '50km 筛选', '访客无限'],
  },
  {
    id: 'vf4',
    nickname: '清晨薄荷茶',
    age: 27,
    gender: '女',
    city: '深圳',
    vipLevel: 3,
    accent: '#10B981',
    bio: '默契测试 1 题过关，聊天启动更快',
    featureLine: '钻石 · 默契测试加速',
    perkTags: ['1 题通关', '资料优先', '访客无限'],
  },
  {
    id: 'vf5',
    nickname: '落日放映厅',
    age: 29,
    gender: '男',
    city: '北京',
    vipLevel: 3,
    accent: '#F472B6',
    bio: '筛选 50km 圈，跨区约会也不愁人选',
    featureLine: '钻石 · 远距离精准筛选',
    perkTags: ['50km', '优先曝光', '金币加成'],
  },
]

export const VIP_FEATURED_FIXED_IDS = new Set(VIP_FEATURED_FIXED.map((m) => m.id))

export function isVipFeaturedFixedId(id) {
  return VIP_FEATURED_FIXED_IDS.has(id)
}

/** 随机池：白银 / 黄金 / 钻石等付费会员 */
export const VIP_MEMBER_POOL = [
  {
    id: 'vr1',
    nickname: '小行星记',
    age: 25,
    gender: '女',
    city: '广州',
    vipLevel: 2,
    accent: '#E8B84A',
    bio: '黄金会员资料润色后回复率涨了一截',
    featureLine: '黄金 · 默契 1 题契合',
    perkTags: ['20km 筛选', '黄金标识'],
  },
  {
    id: 'vr2',
    nickname: '山间售票亭',
    age: 33,
    gender: '男',
    city: '武汉',
    vipLevel: 2,
    accent: '#0EA5E9',
    bio: '周末刷新附近列表，活跃嘉宾更多',
    featureLine: '黄金 · 刷新顺畅',
    perkTags: ['黄金标识', '访客全览'],
  },
  {
    id: 'vr3',
    nickname: '云边花店',
    age: 26,
    gender: '女',
    city: '南京',
    vipLevel: 1,
    accent: '#B8C5D6',
    bio: '白银标识让人更愿意点进资料',
    featureLine: '白银 · 昵称旁会员标',
    perkTags: ['10km 筛选', '寻伴币加成'],
  },
  {
    id: 'vr4',
    nickname: '南风与鲸',
    age: 31,
    gender: '男',
    city: '重庆',
    vipLevel: 2,
    accent: '#6366F1',
    bio: '黄金档筛选把无效推荐挡在外面',
    featureLine: '黄金 · 更远距离筛选',
    perkTags: ['1 题通关', '20km'],
  },
  {
    id: 'vr5',
    nickname: '橘色晚风',
    age: 24,
    gender: '女',
    city: '苏州',
    vipLevel: 1,
    accent: '#14B8A6',
    bio: '谁看过我记录看得更全，心里有数',
    featureLine: '白银 · 访客记录 8 条',
    perkTags: ['访客 8 条', '银币标识'],
  },
  {
    id: 'vr6',
    nickname: '拾光便利店',
    age: 28,
    gender: '男',
    city: '西安',
    vipLevel: 2,
    accent: '#F59E0B',
    bio: '会员专场红娘帮忙把关第一眼印象',
    featureLine: '黄金 · 红娘会员专场',
    perkTags: ['会员专场', '资料润色'],
  },
  {
    id: 'vr7',
    nickname: '浅海应答',
    age: 27,
    gender: '女',
    city: '厦门',
    vipLevel: 3,
    accent: '#8B5CF6',
    bio: '钻石曝光让我在同类资料里更靠前',
    featureLine: '钻石 · 推荐加权',
    perkTags: ['优先曝光', '50km'],
  },
  {
    id: 'vr8',
    nickname: '旧城慢邮',
    age: 34,
    gender: '男',
    city: '天津',
    vipLevel: 1,
    accent: '#64748B',
    bio: '先升白银试试水，性价比还不错',
    featureLine: '白银 · 入门会员特权',
    perkTags: ['10km', '币加成'],
  },
  {
    id: 'vr9',
    nickname: '雨巷灯影',
    age: 29,
    gender: '女',
    city: '青岛',
    vipLevel: 2,
    accent: '#EC4899',
    bio: '默契一题就能开聊，适合工作忙的人',
    featureLine: '黄金 · 快速开聊',
    perkTags: ['1 题通关', '黄金标识'],
  },
  {
    id: 'vr10',
    nickname: '循光者 K',
    age: 30,
    gender: '男',
    city: '长沙',
    vipLevel: 2,
    accent: '#3EB575',
    bio: '筛选在线_only 加会员距离，效率挺高',
    featureLine: '黄金 · 组合筛选',
    perkTags: ['20km', '在线优先'],
  },
  {
    id: 'vr11',
    nickname: '纸飞机航线',
    age: 23,
    gender: '女',
    city: '合肥',
    vipLevel: 1,
    accent: '#FB7185',
    bio: '学生党白银档，预算友好',
    featureLine: '白银 · 轻度会员',
    perkTags: ['访客 8 条', '10km'],
  },
  {
    id: 'vr12',
    nickname: '昼夜分界线',
    age: 35,
    gender: '男',
    city: '郑州',
    vipLevel: 3,
    accent: '#2563EB',
    bio: '离异再寻缘，钻石隐私与曝光平衡得好',
    featureLine: '钻石 · 成熟嘉宾优选',
    perkTags: ['访客无限', '优先曝光'],
  },
]

function seededShuffle(list, seed) {
  const arr = [...list]
  let s = seed >>> 0
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const ALL_VIP_MEMBER_SRC = [...VIP_FEATURED_FIXED, ...VIP_MEMBER_POOL]

const VIP_MEMBER_PLAIN_ACCENT = '#94A3B8'

function enrichMember(m) {
  const tier = getVipTier(m.vipLevel)
  const n = Number.parseInt(m.id.replace(/\D/g, ''), 10) || 1
  const featured = Boolean(m.fixed)
  const accent = featured ? (m.accent ?? '#3EB575') : VIP_MEMBER_PLAIN_ACCENT
  return {
    ...m,
    tier,
    accent,
    /** 运营/后台统计用，禁止在 C 端展示 */
    vipInvest: m.vipInvest ?? tier.minRecharge + (n % 4) * 22,
    education: m.education ?? (['本科', '硕士', '大专'])[n % 3],
    jobTitle: m.jobTitle ?? (['产品经理', '设计师', '教师', '工程师'])[n % 4],
    heightCm: m.heightCm ?? 158 + (n % 22),
    income: m.income ?? (['10-15k', '15-25k', '25k+'])[n % 3],
    marital: m.marital ?? '单身',
    distanceKm: m.distanceKm ?? Math.round((1.2 + (n % 6) * 0.45) * 10) / 10,
    online: m.online ?? n % 4 !== 0,
    soulTags: m.soulTags ?? ['认真交友', tier.name + '会员'],
    bio: m.bio ?? `${m.city} · ${tier.name}会员`,
    avatarImage: m.avatarImage ?? resolveDemoAvatar(m.id, m.gender),
  }
}

export function findVipMemberById(id) {
  return ALL_VIP_MEMBER_SRC.find((m) => m.id === id) ?? null
}

/** 供资料卡 / 聊天使用的附近用户形态 */
export function findVipMemberProfile(id) {
  const m = findVipMemberById(id)
  if (!m) return null
  const row = enrichMember({ ...m, fixed: isVipFeaturedFixedId(id) })
  return {
    id: row.linkUserId ?? row.id,
    nickname: row.nickname,
    age: row.age,
    gender: row.gender,
    city: row.city,
    province: row.city,
    distanceKm: row.distanceKm,
    online: row.online,
    bio: row.bio,
    soulTags: row.soulTags,
    accent: row.accent,
    education: row.education,
    job: row.job ?? '互联网/IT',
    jobTitle: row.jobTitle,
    income: row.income,
    heightCm: row.heightCm,
    marital: row.marital,
    vipLevel: row.vipLevel,
    avatarImage: row.avatarImage,
  }
}

/** 后台对账展示（勿用于会员 Tab / 资料卡等 C 端） */
export function formatVipInvest(yuan) {
  return `¥${yuan}`
}

/** @param {number} [seed] 不传则用时间戳，便于刷新换一批 */
export function buildVipMemberList(seed = Date.now()) {
  const shuffled = seededShuffle(VIP_MEMBER_POOL, seed)
  const featured = VIP_FEATURED_FIXED.map((m) => enrichMember({ ...m, fixed: true }))
  const more = shuffled.map((m) => enrichMember({ ...m, fixed: false }))
  return {
    featured,
    more,
    /** 统一列表：前 5 固定 + 其余随机，UI 不区分区块 */
    members: [...featured, ...more],
  }
}