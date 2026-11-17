import { ChevronLeft, MapPin, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  CHINA_REGIONS,
  HOT_LOCATIONS,
  formatUserLocationDetail,
  matchLocationSearch,
} from '../../data/chinaRegions'
import { SheetModal } from '../me/SheetModal'

export function CityPickerSheet({ open, onClose, value, onSelect }) {
  const [step, setStep] = useState('main')
  const [province, setProvince] = useState(value?.province ?? '上海市')
  const [search, setSearch] = useState('')

  const currentRegion = CHINA_REGIONS.find((r) => r.province === province) ?? CHINA_REGIONS[0]

  const filteredProvinces = useMemo(() => {
    return CHINA_REGIONS.filter((r) => matchLocationSearch(r.province, search))
  }, [search])

  useEffect(() => {
    if (open && value?.province) setProvince(value.province)
  }, [open, value?.province])

  const filteredCities = useMemo(() => {
    const q = search.trim()
    if (q && (step === 'cities' || step === 'main')) {
      const all = []
      CHINA_REGIONS.forEach((r) => {
        r.cities.forEach((c) => {
          const text = `${r.province} ${c}`
          if (matchLocationSearch(text, q) || matchLocationSearch(r.province, q)) {
            all.push({ province: r.province, city: c })
          }
        })
      })
      return all.slice(0, 100)
    }
    if (step === 'cities') {
      return currentRegion.cities
        .filter((c) => matchLocationSearch(c, search))
        .map((c) => ({ province: currentRegion.province, city: c }))
    }
    return []
  }, [step, search, currentRegion])

  const handlePick = (p, c) => {
    onSelect({ province: p, city: c })
    onClose()
    setStep('main')
    setSearch('')
  }

  const resetOnClose = () => {
    setStep('main')
    setSearch('')
    onClose()
  }

  const title =
    step === 'provinces' ? '选择省份' : step === 'cities' ? province : '选择所在城市'

  return (
    <SheetModal open={open} title={title} onClose={resetOnClose} tall>
      <div className="px-3 pb-4">
        {step === 'cities' && (
          <button
            type="button"
            onClick={() => {
              setStep('provinces')
              setSearch('')
            }}
            className="mb-2 flex items-center gap-1 text-sm text-momo"
          >
            <ChevronLeft className="h-4 w-4" />
            返回省份
          </button>
        )}

        <div className="glass-input flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-momo-sub" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (e.target.value.trim() && step === 'main') setStep('cities')
            }}
            placeholder={step === 'provinces' ? '搜索省份' : '搜索省 / 市 / 区'}
            className="w-full bg-transparent text-sm outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-momo-sub">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {(value?.province || value?.city) && (
          <p className="mt-2 flex items-center gap-1 text-xs text-momo-sub">
            <MapPin className="h-3.5 w-3.5 text-momo" />
            当前：{formatUserLocationDetail(value)}
          </p>
        )}

        {step === 'main' && !search && (
          <>
            <p className="mb-2 mt-4 text-xs font-medium text-momo-sub">热门城市</p>
            <div className="flex flex-wrap gap-2">
              {HOT_LOCATIONS.map((loc) => (
                <button
                  key={`${loc.province}-${loc.city}`}
                  type="button"
                  onClick={() => handlePick(loc.province, loc.city)}
                  className="glass-panel-sm rounded-full px-3 py-1.5 text-xs text-momo-text active:scale-95"
                >
                  {loc.city}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep('provinces')}
              className="glass-primary-btn mt-4 w-full rounded-xl py-2.5 text-sm font-medium"
            >
              按省 / 市选择
            </button>
          </>
        )}

        {step === 'provinces' && (
          <ul className="mt-3 max-h-[55vh] overflow-y-auto divide-y divide-white/35">
            {filteredProvinces.map((r) => (
              <li key={r.province}>
                <button
                  type="button"
                  onClick={() => {
                    setProvince(r.province)
                    setStep('cities')
                    setSearch('')
                  }}
                  className="flex w-full items-center justify-between px-2 py-3 text-left text-sm text-momo-text active:bg-white/40"
                >
                  <span>{r.province}</span>
                  <span className="text-xs text-momo-sub">{r.cities.length} 个城市</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {(step === 'cities' || (step === 'main' && search)) && (
          <ul className="mt-3 max-h-[55vh] overflow-y-auto divide-y divide-white/35">
            {filteredCities.length === 0 ? (
              <li className="py-8 text-center text-sm text-momo-sub">未找到匹配地区</li>
            ) : (
              filteredCities.map((item) => (
                <li key={`${item.province}-${item.city}`}>
                  <button
                    type="button"
                    onClick={() => handlePick(item.province, item.city)}
                    className={`flex w-full flex-col px-2 py-3 text-left active:bg-white/40 ${
                      value?.province === item.province && value?.city === item.city
                        ? 'text-momo'
                        : 'text-momo-text'
                    }`}
                  >
                    <span className="text-sm font-medium">{item.city}</span>
                    {item.province !== item.city && (
                      <span className="text-[11px] text-momo-sub">{item.province}</span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </SheetModal>
  )
}