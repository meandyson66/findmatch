export function PhoneFrame({ children }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 p-0 md:p-6">
      <div className="glass-shell relative flex h-[100dvh] w-full flex-col overflow-hidden md:h-[850px] md:w-[414px] md:rounded-[2.25rem]">
        <div className="ios-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-white/10" aria-hidden />
        <main className="relative z-10 min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}