import { motion } from 'framer-motion'

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
  const isOwned = owned
  const isEquipped = equipped

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card flex flex-col items-center gap-2 text-center relative
        ${isOwned ? 'ring-2 ring-sprout-300' : ''}`}
    >
      {isOwned && (
        <span className="absolute top-3 right-3 text-[10px] font-bold text-sprout-600 bg-sprout-100 px-1.5 py-0.5 rounded-full">
          OWNED
        </span>
      )}

      {/* Emoji */}
      <div className="text-5xl leading-none mt-1 select-none">{item.emoji}</div>

      {/* Info */}
      <div>
        <p className="font-semibold text-sm text-gray-800">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.description}</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-1 text-sm font-bold text-coin-600">
        <span>🪙</span>
        <span>{item.price}</span>
      </div>

      {/* Action button */}
      {isOwned ? (
        <button
          onClick={() => onToggleEquip(item.id)}
          className={`w-full btn text-sm py-2 ${
            isEquipped
              ? 'bg-sprout-500 text-white hover:bg-sprout-600'
              : 'btn-secondary'
          }`}
        >
          {isEquipped ? '✓ Equipped' : 'Equip'}
        </button>
      ) : (
        <button
          onClick={() => onBuy(item)}
          disabled={!canAfford || buying}
          className={`w-full btn text-sm py-2 ${
            canAfford ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {buying ? '...' : canAfford ? 'Buy' : 'Need more coins'}
        </button>
      )}
    </motion.div>
  )
}
