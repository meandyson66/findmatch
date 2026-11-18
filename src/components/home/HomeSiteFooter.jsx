import { Phone } from 'lucide-react'
import { useState } from 'react'
import { FOOTER_FILINGS, FOOTER_LINKS, HAPPINESS_HOTLINE } from '../../data/siteFooter'
import { SheetModal } from '../me/SheetModal'

export function HomeSiteFooter() {
  const [sheet, setSheet] = useState(null)
  const active = FOOTER_LINKS.find((l) => l.id === sheet)

  return (
    <>
      <footer className="border-t border-white/40 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
        <a
          href={`tel:${HAPPINESS_HOTLINE.tel}`}
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-momo-text"
        >
          <Phone className="h-3.5 w-3.5 text-momo" strokeWidth={2} />
          <span>
            {HAPPINESS_HOTLINE.label}：
            <span className="text-momo-dark">{HAPPINESS_HOTLINE.display}</span>
          </span>
        </a>
        <nav
          className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px]"
          aria-label="平台信息"
        >
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.id} className="inline-flex items-center gap-2">
              {i > 0 && (
                <span className="text-momo-sub/40" aria-hidden>
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => setSheet(link.id)}
                className="text-momo-sub active:text-momo-dark"
              >
                {link.label}
              </button>
            </span>
          ))}
        </nav>
        <div className="mt-4 space-y-1 border-t border-white/30 pt-3 text-center text-[9px] leading-relaxed text-momo-sub/90">
          <p>{FOOTER_FILINGS.copyright}</p>
          <p>{FOOTER_FILINGS.license}</p>
          {FOOTER_FILINGS.icp?.url ? (
            <a
              href={FOOTER_FILINGS.icp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-momo-sub/90 underline-offset-2 active:text-momo-dark"
            >
              {FOOTER_FILINGS.icp.text}
            </a>
          ) : (
            <p>{FOOTER_FILINGS.icp?.text}</p>
          )}
        </div>
      </footer>

      <SheetModal open={Boolean(active)} title={active?.title ?? ''} onClose={() => setSheet(null)}>
        <div className="space-y-3 px-4 py-4 text-[13px] leading-relaxed text-momo-text">
          {(active?.body ?? []).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </SheetModal>
    </>
  )
}