export function VipFeaturedGlowName({
  nickname,
  featured = false,
  accent = '#E8B84A',
  className = '',
}) {
  if (!featured) {
    return <span className={className}>{nickname}</span>
  }

  const chars = [...(nickname || '')]

  return (
    <span className={`vip-featured-glow-title ${className}`} aria-label={nickname}>
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="vip-featured-glow-char"
          style={{
            animationDelay: `${i * 0.11}s`,
            ['--vip-name-accent']: accent,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}