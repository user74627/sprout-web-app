import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CoinIcon } from '../ui/CoinPill'
import Button from '../ui/Button'

export default function ShopItem({
  item,
  owned,
  equipped,
  coins,
  onBuy,
  onToggleEquip,
  buying,
  layout = 'default',
}) {
  const canAfford = coins >= item.price
  const isCompact = layout === 'compact'
  const shortfall = item.price - coins

  let cardClass = 'relative overflow-hidden border transition-all duration-200 '
  if (equipped) {
    cardClass += 'bg-sprout-50 border-sprout-300/60 shadow-sm '
  } else if (owned) {
    cardClass += 'bg-sprout-50/50 border-sprout-200/50 '
  } else if (!canAfford) {
    cardClass += 'bg-white/50 border-soil-200/30 opacity-75 '
  } else {
    cardClass += 'bg-white/70 border-soil-200/30 hover:-translate-y-0.5 hover:shadow-md '
  }

  cardClass += isCompact
    ? 'rounded-xl p-3 flex flex-row items-center gap-3 text-left'
    : 'rounded-xl p-4 flex flex-col items-center gap-2 text-center'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cardClass}
    >
      {equipped && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sprout-500 text-white flex items-center justify-center">
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        </span>
      )}

      <div className={`select-none leading-none ${isCompact ? 'text-3xl' : 'text-4xl'}`} aria-hidden="true">
        {item.emoji}
      </div>

      <div className={isCompact ? 'flex-1 min-w-0' : 'w-full'}>
        <p className="text-xs font-medium text-soil-400 uppercase tracking-wider mb-0.5">
          {item.category}
        </p>
        <p className={`font-semibold text-soil-800 ${isCompact ? 'text-sm' : 'text-sm'}`}>{item.name}</p>
        {!isCompact && (
          <p className="text-xs text-soil-400/80 mt-0.5 leading-snug">{item.description}</p>
        )}
        <div className={`flex items-center gap-1 font-semibold tabular mt-1
          ${owned ? 'text-soil-400 line-through' : canAfford ? 'text-coin-500' : 'text-soil-400'}`}>
          <CoinIcon size={isCompact ? 14 : 16} />
          <span>{item.price}</span>
        </div>
      </div>

      <div className={isCompact ? 'flex-shrink-0' : 'w-full'}>
        {equipped ? (
          <span className="text-xs font-semibold text-sprout-600 uppercase tracking-wide">Equipped</span>
        ) : owned ? (
          <Button
            size="sm"
            variant="secondary"
            className={isCompact ? '' : 'w-full'}
            onClick={() => onToggleEquip(item.id)}
          >
            Equip
          </Button>
        ) : canAfford ? (
          <Button
            size="sm"
            variant="primary"
            className={isCompact ? '' : 'w-full'}
            disabled={buying}
            onClick={() => onBuy(item)}
            loading={buying}
          >
            Buy
          </Button>
        ) : (
          <p className="text-xs text-soil-400 text-center">
            Need {shortfall} more
          </p>
        )}
      </div>
    </motion.div>
  )
}
