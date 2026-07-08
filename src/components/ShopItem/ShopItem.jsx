import { motion } from 'framer-motion'
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
}) {
  const canAfford = coins >= item.price

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card flex flex-col items-center gap-2 text-center relative overflow-hidden
        ${owned ? 'ring-2 ring-sprout-300 bg-sprout-50/30' : ''}
        ${equipped ? 'ring-2 ring-xp-400' : ''}`}
    >
      {owned && (
        <span className="absolute top-3 right-3 text-[10px] font-bold text-sprout-700 bg-sprout-100 px-2 py-0.5 rounded-full">
          {equipped ? 'ON' : 'OWNED'}
        </span>
      )}

      <div className="text-5xl leading-none mt-1 select-none" aria-hidden="true">{item.emoji}</div>

      <div>
        <p className="text-card-heading text-sm">{item.name}</p>
        <p className="text-caption text-ink-muted mt-0.5 leading-snug">{item.description}</p>
      </div>

      <div className="flex items-center gap-1 text-label font-bold text-coin-600 tabular">
        <CoinIcon size={16} />
        <span>{item.price}</span>
      </div>

      {owned ? (
        <Button
          size="sm"
          variant={equipped ? 'primary' : 'secondary'}
          className="w-full"
          onClick={() => onToggleEquip(item.id)}
        >
          {equipped ? 'Equipped' : 'Equip'}
        </Button>
      ) : (
        <Button
          size="sm"
          variant={canAfford ? 'primary' : 'secondary'}
          className={`w-full ${!canAfford ? 'opacity-60' : ''}`}
          disabled={!canAfford || buying}
          onClick={() => onBuy(item)}
          loading={buying}
        >
          {canAfford ? 'Buy' : 'Need coins'}
        </Button>
      )}
    </motion.div>
  )
}
