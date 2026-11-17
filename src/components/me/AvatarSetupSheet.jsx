import { ImagePlus } from 'lucide-react'
import { useRef } from 'react'
import { AVATAR_COLORS, AVATAR_EMOJIS } from '../../data/avatarPresets'
import { MomoAvatar } from '../MomoAvatar'
import { SheetModal } from './SheetModal'

const MAX_IMAGE_BYTES = 600_000

export function AvatarSetupSheet({ open, onClose, user, onApply, onToast }) {
  const fileRef = useRef(null)

  const pickImage = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      onToast?.('请选择图片文件')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onToast?.('图片请小于 600KB，便于本地保存')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      onApply({
        avatarImage: reader.result,
        avatarEmoji: null,
      })
      onToast?.('头像已更新')
      onClose()
    }
    reader.readAsDataURL(file)
  }

  return (
    <SheetModal open={open} title="设置头像" onClose={onClose} tall>
      <div className="px-4 pb-6">
        <div className="flex flex-col items-center py-4">
          <MomoAvatar
            nickname={user.nickname}
            accent={user.avatarAccent}
            emoji={user.avatarEmoji}
            imageUrl={user.avatarImage}
            size={88}
          />
          <p className="mt-2 text-xs text-momo-sub">预览效果</p>
        </div>

        <p className="text-xs text-momo-sub">头像底色</p>
        <div className="mt-2 grid grid-cols-5 gap-3">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onApply({ avatarAccent: c, avatarEmoji: null, avatarImage: null })
                onToast?.('已更换底色')
              }}
              className={`h-10 w-10 rounded-xl border-2 ${
                user.avatarAccent === c && !user.avatarImage ? 'border-momo scale-105' : 'border-white/60'
              }`}
              style={{ background: c }}
              aria-label={`颜色 ${c}`}
            />
          ))}
        </div>

        <p className="mt-5 text-xs text-momo-sub">表情头像</p>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {AVATAR_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                onApply({ avatarEmoji: e, avatarImage: null })
                onToast?.('已设置表情头像')
              }}
              className={`glass-panel-sm py-2 text-xl ${
                user.avatarEmoji === e ? 'ring-2 ring-momo' : ''
              }`}
            >
              {e}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            onApply({ avatarEmoji: null, avatarImage: null })
            onToast?.('已恢复文字头像')
          }}
          className="mt-2 text-xs text-momo"
        >
          使用昵称首字
        </button>

        <p className="mt-5 text-xs text-momo-sub">从相册选择（仅存于本机）</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(ev) => {
            const file = ev.target.files?.[0]
            pickImage(file)
            ev.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="glass-input mt-2 flex w-full items-center justify-center gap-2 py-3 text-sm text-momo-text"
        >
          <ImagePlus className="h-4 w-4 text-momo" />
          上传照片
        </button>

        {user.avatarImage && (
          <button
            type="button"
            onClick={() => {
              onApply({ avatarImage: null })
              onToast?.('已移除照片头像')
            }}
            className="mt-3 w-full text-center text-xs text-red-500"
          >
            移除当前照片
          </button>
        )}
      </div>
    </SheetModal>
  )
}