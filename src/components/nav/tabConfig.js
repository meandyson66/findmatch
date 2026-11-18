export const MAIN_TAB_IDS = ['home', 'vip', 'matchmaker', 'messages', 'me']

export const TABS = [
  { id: 'home', label: '首页' },
  { id: 'vip', label: '会员' },
  { id: 'matchmaker', label: '红娘' },
  { id: 'messages', label: '消息' },
  { id: 'me', label: '我的' },
]

export const TAB_ACCENT = {
  home: { a: '#3EB575', b: '#22D3EE', glow: '62,181,117' },
  vip: { a: '#E8B84A', b: '#F59E0B', glow: '232,184,74' },
  matchmaker: { a: '#F472B6', b: '#FB7185', glow: '244,114,182' },
  messages: { a: '#C084FC', b: '#F472B6', glow: '168,85,247' },
  me: { a: '#FBBF24', b: '#FB923C', glow: '251,191,36' },
}

export function tabIndex(id) {
  const i = MAIN_TAB_IDS.indexOf(id)
  return i >= 0 ? i : 0
}