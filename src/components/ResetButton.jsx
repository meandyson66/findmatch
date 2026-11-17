import { useApp } from '../context/AppContext'

export function ResetButton({ className = '' }) {
  const { resetDemo } = useApp()

  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm('清空本地数据并恢复演示初始状态？')) resetDemo()
      }}
      className={`text-xs text-momo-sub active:text-momo ${className}`}
    >
      重置演示
    </button>
  )
}