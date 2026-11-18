/**
 * 演示用人像素材（randomuser.me / picsum，需联网）
 * 按用户 id 稳定映射，避免每次刷新换脸
 */

const PORTRAIT_MAX = 90

/** 场景 / 广告用横图（picsum 种子稳定） */
export const DEMO_SCENES = {
  matchmaker: 'https://picsum.photos/seed/findmatch-matchmaker/800/500',
  dating: 'https://picsum.photos/seed/findmatch-dating/800/500',
  cityNight: 'https://picsum.photos/seed/findmatch-city-night/800/500',
  coffee: 'https://picsum.photos/seed/findmatch-coffee/800/500',
}

function hashId(id = '') {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function portraitIndex(id) {
  return (hashId(String(id)) % PORTRAIT_MAX) + 1
}

export function resolveDemoAvatar(id, gender = '男') {
  const folder = gender === '女' ? 'women' : 'men'
  const idx = portraitIndex(id)
  return `https://randomuser.me/api/portraits/${folder}/${idx}.jpg`
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