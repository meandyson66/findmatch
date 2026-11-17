/** 演示用身份证校验（纯前端，不上传） */

const ID_REGEX =
  /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/

const CHECK_MAP = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

function idChecksum(id17) {
  let sum = 0
  for (let i = 0; i < 17; i += 1) sum += Number(id17[i]) * WEIGHTS[i]
  return CHECK_MAP[sum % 11]
}

export function validateRealName(name) {
  const n = (name ?? '').trim()
  if (n.length < 2 || n.length > 20) return '请输入 2–20 字真实姓名'
  if (!/^[\u4e00-\u9fa5·]+$/.test(n)) return '姓名请输入中文'
  return null
}

export function validateIdCard(idCard) {
  const id = (idCard ?? '').trim().toUpperCase()
  if (!ID_REGEX.test(id)) return '请输入 18 位有效身份证号'
  const expected = idChecksum(id.slice(0, 17))
  if (expected !== id[17]) return '身份证号校验未通过'
  return null
}

export function maskIdCard(idCard) {
  const id = (idCard ?? '').trim()
  if (id.length < 8) return '********'
  return `${id.slice(0, 4)}**********${id.slice(-4)}`
}

export function maskRealName(name) {
  const n = (name ?? '').trim()
  if (n.length <= 1) return n
  if (n.length === 2) return `${n[0]}*`
  return `${n[0]}${'*'.repeat(n.length - 2)}${n[n.length - 1]}`
}

export function isIdentityVerified(user) {
  return Boolean(user?.realNameVerified)
}