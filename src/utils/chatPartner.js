import { NEARBY_USERS } from '../data/mockData'
import { MATCHMAKERS } from '../data/matchmakers'

export function resolveChatPartner(chat) {
  if (!chat) return null
  if (chat.source === 'matchmaker') {
    const m = MATCHMAKERS.find((p) => p.id === chat.partnerId)
    if (!m) return null
    return {
      id: m.id,
      nickname: m.name,
      accent: m.accent?.[0] ?? '#F9A8D4',
      avatarImage: m.avatarImage,
      online: true,
      soulTags: m.tags,
    }
  }
  return NEARBY_USERS.find((p) => p.id === chat.partnerId)
}