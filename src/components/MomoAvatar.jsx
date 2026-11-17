export function MomoAvatar({
  nickname,
  accent = '#3EB575',
  emoji,
  imageUrl,
  size = 52,
  online,
  className = '',
}) {
  const initial = (nickname || '?').slice(0, 1)

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-white/45 font-semibold text-white shadow-glass-sm backdrop-blur-sm"
        style={
          imageUrl
            ? undefined
            : {
                background: `linear-gradient(145deg, ${accent}, ${accent}99)`,
                fontSize: emoji ? size * 0.46 : size * 0.38,
              }
        }
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : emoji ? (
          emoji
        ) : (
          initial
        )}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-momo" />
      )}
    </div>
  )
}