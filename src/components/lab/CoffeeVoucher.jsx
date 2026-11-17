import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { COFFEE_VOUCHER } from '../../data/mockData'

function drawQr(canvas, text) {
  const ctx = canvas.getContext('2d')
  const size = 120
  canvas.width = size
  canvas.height = size
  ctx.fillStyle = '#F4EFE6'
  ctx.fillRect(0, 0, size, size)
  const cells = 12
  const cell = size / cells
  let seed = 0
  for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i)
  ctx.fillStyle = '#121110'
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const v = (x * 7 + y * 13 + seed) % 5
      if (v > 1 || (x < 3 && y < 3) || (x > 8 && y < 3) || (x < 3 && y > 8)) {
        ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2)
      }
    }
  }
}

export function CoffeeVoucher() {
  const [flipped, setFlipped] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) drawQr(canvasRef.current, COFFEE_VOUCHER.code)
  }, [flipped])

  return (
    <button type="button" onClick={() => setFlipped((f) => !f)} className="w-full perspective-[800px]">
      <motion.div
        className="relative min-h-[200px] w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-xl border border-amber/50 bg-gradient-to-br from-amber/20 to-walnut p-4 text-left backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-xs text-amber">一键奔现</p>
          <h3 className="mt-1 text-base text-parchment">精品咖啡双人核销券</h3>
          <p className="mt-2 text-[11px] text-warm-gray">点击翻转查看二维码与门店</p>
          <motion.div
            className="mt-3 inline-block rounded-full border border-amber/40 px-3 py-1 text-[10px] text-amber"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            轻触翻转
          </motion.div>
        </div>
        <div
          className="absolute inset-0 rounded-xl border border-border-warm bg-charcoal p-4 text-left"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <canvas ref={canvasRef} className="mx-auto rounded-md" />
          <p className="mt-3 text-sm text-parchment">{COFFEE_VOUCHER.shop}</p>
          <p className="text-[11px] text-warm-gray">{COFFEE_VOUCHER.address}</p>
          <p className="text-[11px] text-warm-gray">营业 {COFFEE_VOUCHER.hours}</p>
          <p className="mt-1 font-mono text-[10px] text-ice-blue">{COFFEE_VOUCHER.code}</p>
        </div>
      </motion.div>
    </button>
  )
}