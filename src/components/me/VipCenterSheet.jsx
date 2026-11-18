import { SheetModal } from './SheetModal'
import { VipCenterPanel } from './VipCenterPanel'

export function VipCenterSheet({
  open,
  onClose,
  totalRecharge,
  coinBalance,
  rechargeHistory,
  onPurchase,
}) {
  return (
    <SheetModal open={open} title="会员中心" onClose={onClose} tall>
      <VipCenterPanel
        totalRecharge={totalRecharge}
        coinBalance={coinBalance}
        rechargeHistory={rechargeHistory}
        onPurchase={onPurchase}
      />
    </SheetModal>
  )
}