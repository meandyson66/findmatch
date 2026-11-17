export function buildIcebreakers(myTags = [], theirTags = []) {
  const mine = myTags[0] ?? '探店'
  const theirs = theirTags[0] ?? '附近的人'
  return [
    `你好呀，看你资料里写了「${theirs}」，我也喜欢「${mine}」，有空聊聊？`,
    `哈喽～要是你也爱「${theirTags[1] ?? mine}」，我们没准挺合得来😊`,
  ]
}

export const SIM_REPLIES = [
  '哈哈可以呀，你平时周末都干嘛？',
  '嗯嗯，感觉你挺有意思的。',
  '收到～有空一起出来喝杯咖啡？',
]