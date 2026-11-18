export function PhoneFrame({ children }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 p-0 md:p-6">
      <div className="glass-shell relative flex h-[100dvh] w-full flex-col overflow-hidden md:h-[850px] md:w-[414px] md:rounded-[2.25rem]">
        <div className="ios-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-transparent to-cyan-400/10"
          aria-hidden
        />
        <main className="relative z-10 min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}