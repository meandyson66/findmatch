import {
  DEMO_FEED_PHOTOS,
  DEMO_FEED_VIDEO,
  pexelsFeedWide,
  resolveDemoAvatar,
} from './demoAvatars'

/**
 * 首页推荐下方 · 客人信息流（多板块）
 * 板块：日常精选 / 讨论话题 / 群主交流 等，后续可接接口或 localStorage
 */
export const FEED_STORAGE_KEY = 'findmatch-home-feed-v5'

/** 每个板块单页展示条数，超过后可翻页 */
export const HOME_FEED_ITEMS_PER_BOARD = 15
export const HOME_FEED_PAGE_SIZE = HOME_FEED_ITEMS_PER_BOARD

/** 演示数据：每板块至少条数 */
export const HOME_FEED_MIN_DEMO_PER_BOARD = 22

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

function feedImg(n) {
  return pexelsFeedWide(DEMO_FEED_PHOTOS[n % DEMO_FEED_PHOTOS.length])
}

function videoFields(posterIndex, withUrl = true) {
  const poster = feedImg(posterIndex)
  return {
    mediaType: 'video',
    mediaPoster: poster,
    mediaUrl: withUrl ? DEMO_FEED_VIDEO.url : null,
    content: '',
  }
}

function stampPost(board, i, row) {
  const base = {
    board,
    stats: { like: row.stats?.like ?? 48 + i * 11, comment: row.stats?.comment ?? 6 + (i % 5) },
    createdAt: now - (i * 73 + (row.minAgo ?? i * 95)) * 60000,
    mediaType: row.mediaType ?? 'text',
    ...row,
  }
  if (base.mediaType === 'image' && !base.mediaUrl) {
    base.mediaUrl = feedImg(i)
  }
  if (base.mediaType === 'voice' && base.voiceSec == null) {
    base.voiceSec = 3 + (i % 8)
  }
  return base
}

const FEATURED_ROWS = [
  { id: 'f01', author: '薄荷电波', accent: '#10B981', content: '滨江日落刷卡完毕，有谁今晚也想沿江边慢跑？配速 6 左右即可～' },
  {
    id: 'f02',
    author: '半糖主张',
    authorBadge: '实名',
    accent: '#EC4899',
    mediaType: 'image',
    mediaUrl: feedImg(1),
    content: '周末徒步抓拍：雾里的栈道，下次想组个 8 人小队。',
    topicTag: '周末徒步',
  },
  { id: 'f03', author: '南风过境', accent: '#F59E0B', mediaType: 'voice', voiceSec: 5, content: '语音碎碎念：刚来这座城市，想找人一起探店。' },
  { id: 'f04', author: '霓虹巷口', accent: '#0EA5E9', content: '爵士吧驻唱结束了，今晚的 setlist 绝了，有人一起回顾吗？' },
  {
    id: 'f05',
    author: '小鹿洋房',
    accent: '#8B5CF6',
    mediaType: 'video',
    ...videoFields(3),
    content: '剪了条 15 秒 vlog：市集买菜 → 回家煲汤。',
    topicTag: '生活碎片',
  },
  {
    id: 'f06',
    author: 'Cloud鸢',
    accent: '#14B8A6',
    mediaType: 'image',
    mediaUrl: feedImg(5),
    content: '办公室窗台的绿植终于开花了，心情愉悦指数 +30。',
  },
  { id: 'f07', author: '米娅不熬夜', authorBadge: '实名', accent: '#EC4899', content: '求助：第一次线下见面穿搭，男生商务 casual 有参考图吗？' },
  { id: 'f08', author: '跑步的阿树', accent: '#3EB575', mediaType: 'voice', voiceSec: 8, content: '刚跑完 8k，用语音记一下今天的配速和心率区间。' },
  {
    id: 'f09',
    author: '胶片夏洛',
    accent: '#6366F1',
    mediaType: 'image',
    mediaUrl: feedImg(8),
    content: '柯尼卡 521 试拍：楼下便利店霓虹，颗粒感爱了。',
    topicTag: '胶片',
  },
  { id: 'f10', author: '蛋黄吐司', accent: '#FB7185', content: '周三治愈系列：一个人看电影也可以很舒服，关键是选对小剧场。' },
  {
    id: 'f11',
    author: '山迹',
    accent: '#10B981',
    mediaType: 'video',
    ...videoFields(10, false),
    content: '分享爬山延时：日出从云层里探头的 20 秒。',
  },
  { id: 'f12', author: '夜航员Luna', accent: '#8B5CF6', mediaType: 'voice', voiceSec: 4, content: '即兴哼了一段副歌，欢迎帮我起歌名哈哈。' },
  {
    id: 'f13',
    author: '柚子汽水',
    accent: '#F472B6',
    mediaType: 'image',
    mediaUrl: feedImg(12),
    content: '猫主子今天难得赏脸合影，求夸夸。',
  },
  { id: 'f14', author: '旧城钟声', accent: '#0EA5E9', content: '写字打卡第 12 天：复刻了一页《兰亭》，手还在抖。' },
  {
    id: 'f15',
    author: '拾光便利店',
    accent: '#A78BFA',
    mediaType: 'image',
    mediaUrl: feedImg(14),
    content: '周日晚餐：三文鱼饭 + 佐贺小菜，厨艺小白的高级感来源是摆盘。',
    topicTag: '吃好每一餐',
    stats: { like: 210, comment: 31 },
  },
  { id: 'f16', author: '冬至饺子', accent: '#0EA5E9', content: '加班夜归路上的便利店关东煮，治愈打工人的小确幸。' },
  {
    id: 'f17',
    author: '浪里白条',
    accent: '#6366F1',
    mediaType: 'image',
    mediaUrl: feedImg(3),
    content: '泳池静谧时刻的一张抓拍，夏天要来了。',
  },
  { id: 'f18', author: '茶白', accent: '#14B8A6', mediaType: 'voice', voiceSec: 6, content: '泡茶白噪音分享：咕嘟声里慢慢说今天遇见的一件小事。' },
  { id: 'f19', author: '通勤诗', accent: '#F472B6', content: '地铁读书角第 9 期：推荐《深夜食堂》短篇，很短很暖。' },
  {
    id: 'f20',
    author: '林深',
    accent: '#F59E0B',
    mediaType: 'video',
    ...videoFields(7, false),
    content: '延时摄影：云层压过楼顶的二十秒，配了首 lo-fi。',
    topicTag: 'sky',
  },
  { id: 'f21', author: '晴野', accent: '#22C55E', mediaType: 'image', mediaUrl: feedImg(9), content: '晨跑后的豆浆油条局，老小区门口永远队伍最长。' },
  { id: 'f22', author: '蓝虹口', accent: '#3B82F6', mediaType: 'voice', voiceSec: 7, content: '分享一首适合独处夜晚的单曲循环，不剧透歌名猜风格。' },
]

const TOPIC_ROWS = [
  { id: 't01', author: '夜航员Luna', accent: '#8B5CF6', content: '#第一次见面该不该AA# 各付各的更轻松，但别现场计算器，气氛比金额重要。', topicTag: '#第一次见面该不该AA#' },
  { id: 't02', author: '旧城钟声', accent: '#0EA5E9', content: '#慢热怎么破冰# 从「最近在听什么」切入，比查户口自然多了。', topicTag: '#慢热怎么破冰#' },
  { id: 't03', author: '理性派小白', accent: '#6366F1', mediaType: 'voice', voiceSec: 6, content: '语音辩论：异地恋要不要每天视频？我站「有需要再联」。', topicTag: '#异地恋边界#' },
  {
    id: 't04',
    author: '半糖主张',
    accent: '#EC4899',
    mediaType: 'image',
    mediaUrl: feedImg(4),
    content: '#你的理想约会时长# 我觉得 2～3 小时刚好，留点念想比一次性聊透更好。',
    topicTag: '#理想约会时长#',
  },
  { id: 't05', author: '霓虹巷口', accent: '#14B8A6', content: '#能接受对方有娃吗# 真诚比标签重要，相处一段再谈结构问题。', topicTag: '#再婚家庭#' },
  {
    id: 't06',
    author: '透彻',
    accent: '#F59E0B',
    mediaType: 'video',
    ...videoFields(6),
    content: '#线上聊天冷场# 录了段 mock 对话：如何用开放提问救场。',
    topicTag: '#聊天救场#',
  },
  { id: 't07', author: '南风过境', accent: '#FB7185', content: '#第一次见面选在哪# 书店 / 展览 > 吵闹酒吧，能边走边聊。' },
  { id: 't08', author: '跑步的阿树', accent: '#3EB575', mediaType: 'image', mediaUrl: feedImg(9), content: '#运动情侣# 约跑比约饭更能看出节奏合不合。', topicTag: '#运动约会#' },
  { id: 't09', author: '米娅不熬夜', authorBadge: '实名', accent: '#A78BFA', mediaType: 'voice', voiceSec: 7, content: '#安全感从哪来# 语音说说：回应速度 vs 情绪稳定，我选后者。' },
  { id: 't10', author: 'Cloud鸢', accent: '#10B981', content: '#分手后还做朋友吗# 我倾向礼貌距离，对下一任更公平。', topicTag: '#边界感#' },
  {
    id: 't11',
    author: '胶片夏洛',
    accent: '#8B5CF6',
    mediaType: 'image',
    mediaUrl: feedImg(11),
    content: '#朋友圈要公开恋情吗# 我发作品不发人，保护欲和分享欲可以并存。',
  },
  { id: 't12', author: '蛋黄吐司', accent: '#0EA5E9', content: '#父母催婚怎么回# 「我在认真看，但不是完成任务」这句话很好用。' },
  {
    id: 't13',
    author: '山迹',
    accent: '#6366F1',
    mediaType: 'video',
    ...videoFields(13, false),
    content: '#第一次见面带礼物吗# 小花 / 手写卡即可，别用力过猛。',
    topicTag: '#礼仪分寸#',
  },
  { id: 't14', author: '柚子汽水', accent: '#EC4899', mediaType: 'voice', voiceSec: 3, content: '#颜值和性格# 熬过三个月热忱后，性格决定还会不会想见。' },
  {
    id: 't15',
    author: '拾光便利店',
    accent: '#14B8A6',
    mediaType: 'text',
    content: '#会员值不值# 筛选距离和访客记录，对我来说是省时间而不是炫富。',
    topicTag: '#会员体验#',
    stats: { like: 312, comment: 88 },
  },
  { id: 't16', author: '疏朗', accent: '#10B981', content: '#要不要看对方手机# 我的答案：不主动看，但重大猜疑要当面沟通。', topicTag: '#信任边界#' },
  { id: 't17', author: '砂砾', accent: '#F97316', mediaType: 'voice', voiceSec: 5, content: '#聊天已读不回# 语音聊聊：忙和冷淡在外显上怎么区分。' },
  {
    id: 't18',
    author: '青璃',
    accent: '#8B5CF6',
    mediaType: 'image',
    mediaUrl: feedImg(10),
    content: '#姐弟恋年龄差# 三观和生活节奏比数字更让人踏实。',
    topicTag: '#年龄差#',
  },
  { id: 't19', author: '冷萃', accent: '#0EA5E9', content: '#要不要透露收入# 区间可以讲，精确数留到互信以后。' },
  {
    id: 't20',
    author: '月台',
    accent: '#EC4899',
    mediaType: 'video',
    ...videoFields(11, false),
    content: '#视频约会尴尬# 演示：3 个不尴尬的暖场话题。',
    topicTag: '#视频约会#',
  },
  { id: 't21', author: '书脊', accent: '#6366F1', content: '#靠介绍脱单靠谱吗# 朋友背书是加分，但相处还是要自己验证。' },
  { id: 't22', author: '雨亭', accent: '#14B8A6', mediaType: 'image', mediaUrl: feedImg(12), content: '#宠物家庭和娃# 猫猫狗狗也是家庭结构的一部分，早点对齐。' },
]

const GROUP_ROWS = [
  { id: 'g01', author: '静安夜跑群', authorBadge: '群主', accent: '#3EB575', content: '【活动】周六 20:00 雕塑公园集合，5km 夜跑 + 拉伸，新人免圈费。', topicTag: '线下活动' },
  { id: 'g02', author: '胶片摄影小队', authorBadge: '群主', accent: '#F59E0B', mediaType: 'image', mediaUrl: feedImg(2), content: '三月主题「窗边的光」，本周五 21:00 线上选片点评。', topicTag: '创作打卡' },
  { id: 'g03', author: '滨江骑行社', authorBadge: '群主', accent: '#0EA5E9', mediaType: 'voice', voiceSec: 9, content: '语音公告：周日开行江线 25km，均速 22，护具必戴。' },
  {
    id: 'g04',
    author: '咖啡杯友会',
    authorBadge: '群主',
    accent: '#78716C',
    mediaType: 'video',
    ...videoFields(4),
    content: '短视频：手冲全过程，新人可来抄作业。',
    topicTag: '技能分享',
  },
  { id: 'g05', author: '城市徒步联盟', authorBadge: '群主', accent: '#10B981', content: '清明短线：苏州穹窿山一日，限 20 人，群公告报名。' },
  { id: 'g06', author: '猫奴互助站', authorBadge: '群主', accent: '#F472B6', mediaType: 'image', mediaUrl: feedImg(7), content: '群相册更新：领养日剪影，欢迎帮扩散。', topicTag: '公益' },
  { id: 'g07', author: '读书会·静安', authorBadge: '群主', accent: '#8B5CF6', content: '线下共读《小王子的玫瑰》，4/12 19:30，场地已订，剩 3 座。' },
  { id: 'g08', author: '飞盘萌新局', authorBadge: '群主', accent: '#22D3EE', mediaType: 'voice', voiceSec: 4, content: '教练语音：反手扔盘手腕发力要点，反复听三遍。' },
  {
    id: 'g09',
    author: '露营后勤组',
    authorBadge: '群主',
    accent: '#84CC16',
    mediaType: 'image',
    mediaUrl: feedImg(15),
    content: '装备清单晒图：实惠双层帐 + 露营灯，适合第一次过夜。',
  },
  { id: 'g10', author: '古典乐入门', authorBadge: '群主', accent: '#6366F1', content: '本周曲目：德彪西《月光》，群内接龙写听后感 140 字。' },
  {
    id: 'g11',
    author: '爵士即兴Jam',
    authorBadge: '群主',
    accent: '#FB7185',
    mediaType: 'video',
    ...videoFields(16, false),
    content: '昨晚 jam 片段：萨克斯 + 钢琴，欢迎乐手来排队 solo。',
    topicTag: 'Live',
  },
  { id: 'g12', author: '素颜通勤妆', authorBadge: '群主', accent: '#EC4899', mediaType: 'image', mediaUrl: feedImg(0), content: '妆教图解：5 分钟完成面试妆，群文件已更新 PDF。' },
  { id: 'g13', author: '火影跑酷少年', authorBadge: '群主', accent: '#F59E0B', content: '【约练】人民公园阶梯冲刺 10 组，下雨改室内汗水局。' },
  { id: 'g14', author: '心动盲盒桌游', authorBadge: '群主', accent: '#A78BFA', mediaType: 'voice', voiceSec: 6, content: '主持人语音：周六情侣局还差 2 男 2 女，破冰游戏已备。' },
  {
    id: 'g15',
    author: '程序员养生局',
    authorBadge: '群主',
    accent: '#14B8A6',
    mediaType: 'image',
    mediaUrl: feedImg(17),
    content: '站立办公 + 颈肩拉伸打卡周报，卷王也要护颈。',
    topicTag: '健康',
    stats: { like: 166, comment: 52 },
  },
  { id: 'g16', author: '港风舞室', authorBadge: '群主', accent: '#D946EF', content: '爵士零基础：周二晚入门跟练，穿软底鞋即可，限 15 人。' },
  { id: 'g17', author: '轻徒步亲子', authorBadge: '群主', accent: '#84CC16', mediaType: 'voice', voiceSec: 5, content: '亲子线语音说明：5km 无陡坡，适合推婴儿车的新手爸妈。' },
  {
    id: 'g18',
    author: '精酿打卡团',
    authorBadge: '群主',
    accent: '#F59E0B',
    mediaType: 'image',
    mediaUrl: feedImg(8),
    content: '本周跳转三家小酒馆，不强饮，以闻香笔记为主。',
    topicTag: 'CityWalk',
  },
  { id: 'g19', author: '晨间瑜伽共修', authorBadge: '群主', accent: '#06B6D4', content: '工作日 7:00 线上共修 25 分钟，跟练链接置顶。' },
  {
    id: 'g20',
    author: '播客听友会',
    authorBadge: '群主',
    accent: '#A855F7',
    mediaType: 'video',
    ...videoFields(9),
    content: '复盘热门情感播客一期：线下圆桌旁听名额 8 个。',
  },
  { id: 'g21', author: '面食研究所', authorBadge: '群主', accent: '#EF4444', content: '手擀面 workshop：和面 / 切面 / 鸡蛋酱，周六下午满员可候补。' },
  { id: 'g22', author: '城市观鸟队', authorBadge: '群主', accent: '#22C55E', mediaType: 'image', mediaUrl: feedImg(1), content: '春日观鸟路线更新，滨江湿地 9 种常见候鸟对照图。', topicTag: '自然' },
]

const MATCH_ROWS = [
  { id: 'm01', author: '金牌红娘·苏瑾', authorBadge: '红娘', accent: '#FB7185', content: '手记：慢热型首选书店 + 咖啡，比火锅局压力小，成功率更高。', topicTag: '约会灵感' },
  { id: 'm02', author: '会员 小行星', authorBadge: '黄金会员', accent: '#A78BFA', content: '资料润色后回复率涨了，关键是简介里写清「我在找什么」。', topicTag: '经验分享' },
  { id: 'm03', author: '红娘·阿初', authorBadge: '红娘', accent: '#EC4899', mediaType: 'voice', voiceSec: 5, content: '语音 Tips：首条私信别长篇，三句话 + 一个具体问题。' },
  {
    id: 'm04',
    author: '钻石会员·北宸',
    authorBadge: '钻石会员',
    accent: '#6366F1',
    mediaType: 'image',
    mediaUrl: feedImg(6),
    content: '见面照经红娘把关后换了更自然的室外光，点赞多了一倍。',
    topicTag: '形象优化',
  },
  {
    id: 'm05',
    author: '红娘·林溪',
    authorBadge: '红娘',
    accent: '#10B981',
    mediaType: 'video',
    ...videoFields(5),
    content: '案例复盘视频（脱敏）：异地如何维持每周一次高质量通话。',
    topicTag: '异地',
  },
  { id: 'm06', author: '至尊·星河引路人', authorBadge: '至尊会员', accent: '#5a3d8a', content: '至尊通道：48 小时内安排三位候选，省掉海选时间。', topicTag: '尊享' },
  { id: 'm07', author: '会员 琥珀海岸线', authorBadge: '至尊会员', accent: '#E8B84A', mediaType: 'voice', voiceSec: 11, content: '见面后语音反馈：对方守时 + 会倾听，已约第二次展览。' },
  { id: 'm08', author: '红娘·苏瑾', authorBadge: '红娘', accent: '#FB7185', content: '不建议第一次见面送礼过重，小花或手写卡足够表达诚意。' },
  {
    id: 'm09',
    author: '黄金·山间售票亭',
    authorBadge: '黄金会员',
    accent: '#0EA5E9',
    mediaType: 'image',
    mediaUrl: feedImg(13),
    content: '红娘推荐的周末徒步局成了我们和对方的缘分起点。',
    topicTag: '成功故事',
  },
  { id: 'm10', author: '红娘·阿初', authorBadge: '红娘', accent: '#F472B6', content: '离婚再婚嘉宾：先对齐带娃观念，再谈感觉，节奏要慢半拍。' },
  {
    id: 'm11',
    author: '钻石·浅海应答',
    authorBadge: '钻石会员',
    accent: '#8B5CF6',
    mediaType: 'video',
    ...videoFields(14, false),
    content: '会员访谈剪辑：如何在一个月内从破冰聊到共同旅行计划。',
  },
  { id: 'm12', author: '会员 北纬三十度', authorBadge: '钻石会员', accent: '#14B8A6', mediaType: 'voice', voiceSec: 4, content: '感谢红娘牵线，语音给还在观望的姐妹：大胆线下见面。' },
  { id: 'm13', author: '红娘·林溪', authorBadge: '红娘', accent: '#F59E0B', content: '父亲节专场：成熟男性嘉宾注意事项清单已发群公告。', topicTag: '专题' },
  {
    id: 'm14',
    author: '黄金·橘色晚风',
    authorBadge: '黄金会员',
    accent: '#14B8A6',
    mediaType: 'image',
    mediaUrl: feedImg(16),
    content: '一对通过默契测试后互关的第 7 天合照（征得同意）。',
  },
  {
    id: 'm15',
    author: '红娘·苏瑾',
    authorBadge: '红娘',
    accent: '#FB7185',
    content: '本周数据：会员专场配对回复率 68%，非会员对照组 41%，真诚资料是关键。',
    topicTag: '周报',
    stats: { like: 402, comment: 96 },
  },
  { id: 'm16', author: '红娘·阿初', authorBadge: '红娘', accent: '#EC4899', content: '春季牵线高峰：资料三件套齐全（近照 / 爱好 / 期待）回复更快。' },
  { id: 'm17', author: '白银·旧城慢邮', authorBadge: '白银会员', accent: '#64748B', mediaType: 'voice', voiceSec: 6, content: '会员升级后筛选放宽，语音记录一下真实感受供参考。' },
  {
    id: 'm18',
    author: '红娘·林溪',
    authorBadge: '红娘',
    accent: '#10B981',
    mediaType: 'image',
    mediaUrl: feedImg(2),
    content: '线下见面会布景：柔光 + 绿植背景，紧张型嘉宾反馈放松不少。',
  },
  { id: 'm19', author: '钻石·南风与鲸', authorBadge: '钻石会员', accent: '#6366F1', content: '第二次约会选桌游吧：规则简明、互动多，比尬聊高效。' },
  {
    id: 'm20',
    author: '红娘·苏瑾',
    authorBadge: '红娘',
    accent: '#FB7185',
    mediaType: 'video',
    ...videoFields(12, false),
    content: '避坑课堂：聊天里常见的 5 类「用力过猛」信号。',
    topicTag: '安全',
  },
  { id: 'm21', author: '黄金·云边花店', authorBadge: '黄金会员', accent: '#F472B6', mediaType: 'voice', voiceSec: 4, content: '红娘帮忙改的开场白，第三天终于收到正经回复。' },
  {
    id: 'm22',
    author: '会员 拾光便利店',
    authorBadge: '黄金会员',
    accent: '#F59E0B',
    mediaType: 'image',
    mediaUrl: feedImg(4),
    content: '牵手照不宜首图当头像，换成半身生活照后访客停留更久。',
    topicTag: '资料技巧',
  },
]

function buildBoardFeed(board, rows) {
  return rows.map((row, i) => stampPost(board, i, row))
}

export const DEFAULT_HOME_FEED = [
  ...buildBoardFeed('featured', FEATURED_ROWS),
  ...buildBoardFeed('topic', TOPIC_ROWS),
  ...buildBoardFeed('group', GROUP_ROWS),
  ...buildBoardFeed('match', MATCH_ROWS),
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