import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { maskIdCard, maskRealName, validateIdCard, validateRealName } from '../../utils/identity'
import { SheetModal } from './SheetModal'

export function RealNameVerifySheet({ open, onClose, onSubmit, verified, maskedName, maskedId }) {
  const [name, setName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = () => {
    const nameErr = validateRealName(name)
    if (nameErr) {
      setErr(nameErr)
      return
    }
    const idErr = validateIdCard(idCard)
    if (idErr) {
      setErr(idErr)
      return
    }
    if (!agree) {
      setErr('请阅读并同意实名认证服务协议')
      return
    }
    setErr('')
    setBusy(true)
    setTimeout(() => {
      const ok = onSubmit?.({
        realName: name.trim(),
        idCard: idCard.trim().toUpperCase(),
        idCardMasked: maskIdCard(idCard),
        realNameMasked: maskRealName(name.trim()),
      })
      setBusy(false)
      if (ok === false) setErr('提交失败，请稍后重试')
      else {
        setName('')
        setIdCard('')
        setAgree(false)
        onClose?.()
      }
    }, 700)
  }

  return (
    <SheetModal open={open} title="实名认证" onClose={onClose} tall>
      <div className="px-4 pb-6">
        {verified ? (
          <div className="glass-panel rounded-xl px-4 py-5 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-momo" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-medium text-momo-text">已通过实名认证</p>
            <p className="mt-2 text-xs text-momo-sub">
              {maskedName} · {maskedId}
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-momo-sub">
              认证信息仅保存在本机浏览器，演示版不会上传至服务器。完成认证后可正常发送聊天消息。
            </p>
            <button
              type="button"
              onClick={onClose}
              className="glass-primary-btn mt-4 w-full rounded-lg py-2.5 text-sm"
            >
              知道了
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] leading-relaxed text-momo-sub">
              根据平台规则，未实名用户无法与他人聊天。请填写本人信息完成认证（演示环境本地校验，不联网）。
            </p>
            <label className="mt-4 block">
              <span className="text-xs text-momo-sub">真实姓名</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="与身份证一致"
                className="mt-1 w-full rounded-lg glass-input px-3 py-2 text-sm outline-none"
                maxLength={20}
              />
            </label>
            <label className="mt-3 block">
              <span className="text-xs text-momo-sub">身份证号</span>
              <input
                value={idCard}
                onChange={(e) => setIdCard(e.target.value.replace(/\s/g, ''))}
                placeholder="18 位号码"
                className="mt-1 w-full rounded-lg glass-input px-3 py-2 text-sm outline-none"
                maxLength={18}
                inputMode="text"
                autoComplete="off"
              />
            </label>
            <label className="mt-3 flex items-start gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-momo-sub/50"
              />
              <span className="text-[11px] leading-relaxed text-momo-sub">
                我已阅读并同意《实名认证服务协议》及《个人信息处理说明》，确认所填信息真实有效。
              </span>
            </label>
            {err && <p className="mt-2 text-xs text-red-600/90">{err}</p>}
            <button
              type="button"
              disabled={busy}
              onClick={handleSubmit}
              className="glass-primary-btn mt-4 w-full rounded-xl py-3 text-sm font-medium disabled:opacity-60"
            >
              {busy ? '认证中…' : '提交认证'}
            </button>
            <p className="mt-3 text-center text-[10px] text-momo-sub">
              测试可用任意符合格式的 18 位身份证（校验码正确即可）
            </p>
          </>
        )}
      </div>
    </SheetModal>
  )
}