/**
 * 演示用人像素材（Pexels 华裔气质人像，需联网）
 * 按用户 id 稳定映射，同一用户头像不随刷新变化
 */

/** 华裔女性 · 气质 / 妆造人像（资料页、推荐卡） */
const DEMO_AVATARS_FEMALE_CN = [
  8789240, 31085322, 25471932, 38794386, 25471909, 19551242, 5311755, 9217093,
  7618298, 3570211, 3756044, 3775531, 2681751, 2616513, 769746, 3025877,
  415829, 29069491, 2747449, 1126993, 1183266, 1382731, 2044005, 1129328,
  1239291, 1462637, 1820559, 1858175, 9856621, 1181686, 1516680,
]

/** 华裔男性 · 日常 / 商务人像 */
const DEMO_AVATARS_MALE_CN = [
  18285574, 7845231, 34152753, 34970889, 21044803, 38048167, 39843298,
  3028678, 1181690, 2379005, 926390, 708440,
]

function pexelsUrl(photoId, w = 520, h = 520) {
  return (
    `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg` +
    `?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=2&fit=crop&crop=faces`
  )
}

/** 场景 / 广告用横图 */
export const DEMO_SCENES = {
  matchmaker: pexelsWide(9217093),
  dating: pexelsWide(4491282),
  cityNight: pexelsWide(2673250),
  coffee: pexelsWide(302899),
}

function pexelsWide(photoId) {
  return (
    `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg` +
    `?auto=compress&cs=tinysrgb&w=900&h=520&dpr=2&fit=crop`
  )
}

function hashId(id = '') {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

export function resolveDemoAvatar(id, gender = '男') {
  const pool = gender === '女' ? DEMO_AVATARS_FEMALE_CN : DEMO_AVATARS_MALE_CN
  const photoId = pool[hashId(String(id)) % pool.length]
  return pexelsUrl(photoId)
}

export function resolveDemoScene(key, fallback = 'dating') {
  return DEMO_SCENES[key] ?? DEMO_SCENES[fallback]
}

/** 为附近用户 / 会员等补充 avatarImage（已有则保留） */
export function withDemoAvatar(entity) {
  if (!entity) return entity
  if (entity.avatarImage) return entity
  const gender = entity.gender ?? '男'
  return {
    ...entity,
    avatarImage: resolveDemoAvatar(entity.id ?? entity.nickname, gender),
  }
}