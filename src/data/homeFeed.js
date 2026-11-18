import { resolveDemoAvatar } from './demoAvatars'

/**
 * 首页推荐下方 · 客人信息流（多板块）
 * 板块：日常精选 / 讨论话题 / 群主交流 等，后续可接接口或 localStorage
 */
export const FEED_STORAGE_KEY = 'findmatch-home-feed-v2'

export const HOME_FEED_BOARDS = [
  {
    id: 'featured',
    label: '日常精选',
    desc: '动态与生活碎片',
    frame: ['#10B981', '#3EB575'],
  },
  {
    id: 'topic',
    label: '讨论话题',
    desc: '今日热议',
    frame: ['#8B5CF6', '#6366F1'],
  },
  {
    id: 'group',
    label: '群主交流',
    desc: '圈子与活动',
    frame: ['#0EA5E9', '#14B8A6'],
  },
  {
    id: 'match',
    label: '牵线手记',
    desc: '红娘与会员分享',
    frame: ['#FB7185', '#F59E0B'],
  },
]

const now = Date.now()

export const DEFAULT_HOME_FEED = [
  {
    id: 'f1',
    board: 'featured',
    author: '薄荷电波',
    authorBadge: null,
    accent: '#10B981',
    content: '滨江日落刷卡完毕，有谁今晚也想沿江边慢跑？配速 6 左右即可～',
    topicTag: null,
    stats: { like: 128, comment: 23 },
    createdAt: now - 42 * 60000,
  },
  {
    id: 'f2',
    board: 'featured',
    author: '半糖主张',
    authorBadge: '实名',
    accent: '#EC4899',
    content: '周末徒步照鼎湖山，雾大但人少，很适合放空。下次想组个 8 人小队。',
    topicTag: '周末徒步',
    stats: { like: 86, comment: 11 },
    createdAt: now - 3 * 3600000,
  },
  {
    id: 't1',
    board: 'topic',
    author: '夜航员Luna',
    authorBadge: null,
    accent: '#8B5CF6',
    content: '#第一次见面该不该AA# 我倾向各付各的，但别在桌上算得太细，气氛比金额重要。',
    topicTag: '#第一次见面该不该AA',
    stats: { like: 240, comment: 67 },
    createdAt: now - 55 * 60000,
  },
  {
    id: 't2',
    board: 'topic',
    author: '旧城钟声',
    authorBadge: null,
    accent: '#0EA5E9',
    content: '#慢热怎么破冰# 先从共同爱好切入，别急着查户口。我一般会问对方最近在听什么歌。',
    topicTag: '#慢热怎么破冰',
    stats: { like: 152, comment: 34 },
    createdAt: now - 6 * 3600000,
  },
  {
    id: 'g1',
    board: 'group',
    author: '静安夜跑群',
    authorBadge: '群主',
    accent: '#3EB575',
    content: '【活动】本周六 20:00 静安雕塑公园集合，5km 夜跑 + 拉伸，新人欢迎，记得带水。',
    topicTag: '线下活动',
    stats: { like: 89, comment: 41 },
    createdAt: now - 2 * 3600000,
  },
  {
    id: 'g2',
    board: 'group',
    author: '胶片摄影小队',
    authorBadge: '群主',
    accent: '#F59E0B',
    content: '三月主题：「窗边的光」。本周内发片到群相册，周五晚 21:00 线上点评与互粉。',
    topicTag: '创作打卡',
    stats: { like: 64, comment: 18 },
    createdAt: now - 9 * 3600000,
  },
  {
    id: 'm1',
    board: 'match',
    author: '金牌红娘·苏瑾',
    authorBadge: '红娘',
    accent: '#FB7185',
    content: '牵线手记：两位都是慢热型，第一次约会选在书店+咖啡，比饭局压力小很多，反馈不错。',
    topicTag: '约会灵感',
    stats: { like: 201, comment: 29 },
    createdAt: now - 5 * 3600000,
  },
  {
    id: 'm2',
    board: 'match',
    author: '会员 小行星',
    authorBadge: '黄金会员',
    accent: '#A78BFA',
    content: '用了资料润色后私信回复率高了不少，最关键还是简介里写清「我在找什么」而不是只晒标签。',
    topicTag: '经验分享',
    stats: { like: 97, comment: 15 },
    createdAt: now - 26 * 3600000,
  },
]

function enrichPost(p, idx) {
  const gender =
    p.gender ??
    (p.authorBadge === '红娘' || String(p.author).includes('红娘')
      ? '女'
      : p.authorBadge === '群主'
        ? idx % 2 === 0
          ? '女'
          : '男'
        : idx % 2 === 0
          ? '女'
          : '男')
  return {
    ...p,
    gender,
    avatarImage: p.avatarImage ?? resolveDemoAvatar(p.id ?? p.author, gender),
  }
}

function enrichFeed(posts) {
  return posts.map((p, idx) => enrichPost(p, idx))
}

export function loadHomeFeedRaw() {
  try {
    const legacy = localStorage.getItem('findmatch-home-feed-v1')
    const raw = localStorage.getItem(FEED_STORAGE_KEY) ?? legacy
    if (!raw) return [...DEFAULT_HOME_FEED]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_HOME_FEED]
  } catch {
    return [...DEFAULT_HOME_FEED]
  }
}

export function loadHomeFeed() {
  return enrichFeed(loadHomeFeedRaw())
}

export function addHomeFeedPost(entry) {
  const list = loadHomeFeedRaw()
  const post = {
    stats: { like: 0, comment: 0 },
    createdAt: Date.now(),
    mediaType: 'text',
    ...entry,
    id: entry.id ?? `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  }
  const next = [post, ...list]
  try {
    localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(next))
  } catch {
    return null
  }
  return enrichPost(post, 0)
}

export function createUserFeedPost({ board, user, mediaType, content, mediaUrl, mediaPoster, voiceSec }) {
  const typeTag = { image: '图片动态', video: '视频动态', voice: '语音动态' }[mediaType]
  return {
    board,
    author: user.nickname ?? '我',
    authorBadge: user.realNameVerified ? '实名' : null,
    accent: user.avatarAccent ?? '#3EB575',
    avatarImage: user.avatarImage ?? null,
    gender: user.gender,
    content: content?.trim() ?? '',
    mediaType: mediaType ?? 'text',
    mediaUrl: mediaUrl ?? null,
    mediaPoster: mediaPoster ?? null,
    voiceSec: voiceSec ?? null,
    topicTag: typeTag ?? null,
  }
}