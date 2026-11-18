const APP_NAME = '寻伴'

export function AppBrand({ className = '' }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`} aria-label={APP_NAME}>
      <img
        src="/app-logo.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-[10px] shadow-sm ring-1 ring-white/65"
        draggable={false}
      />
      <p className="truncate text-[17px] font-semibold leading-tight tracking-tight text-momo-text">
        {APP_NAME}
      </p>
    </div>
  )
}