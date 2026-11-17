export function AvatarGlow({ nickname, accent = '#A855F7', size = 48, blur = false }) {
  const initial = (nickname || '?').slice(0, 1)
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full font-semibold text-parchment"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${accent}88, #0F0D15)`,
        boxShadow: `0 0 20px ${accent}66`,
      }}
    >
      <span className={blur ? 'blur-[3px] select-none' : ''}>{initial}</span>
      <span
        className="pointer-events-none absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${accent}88` }}
      />
    </div>
  )
}