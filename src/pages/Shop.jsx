import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import ShopItem from '../components/ShopItem/ShopItem'
import { usePet } from '../hooks/usePet'
import { useShop } from '../hooks/useShop'

export default function Shop() {
  const { petData, toggleEquip } = usePet()
  const { inventory, purchasing, buyItem, SHOP_ITEMS } = useShop()
  const [toast, setToast] = useState(null)

  const coins    = petData?.coins ?? 0
  const equipped = petData?.equippedItems ?? []

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2200)
  }

  async function handleBuy(item) {
    const result = await buyItem(item)
    if (result.success) {
      showToast(`${item.emoji} ${item.name} added to your collection!`)
    } else {
      showToast(result.error === 'Not enough coins'
        ? `Need ${item.price - coins} more coins!`
        : result.error, 'error')
    }
  }

  return (
    <div className="page">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg
                        text-sm font-semibold max-w-[90vw] text-center ${
              toast.type === 'error'
                ? 'bg-rose-500 text-white'
                : 'bg-sprout-500 text-white'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="text-sm text-gray-500 mt-0.5">Dress up your pet!</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl shadow-card">
          <span className="text-lg">🪙</span>
          <span className="font-bold text-coin-600 text-lg">{coins}</span>
        </div>
      </div>

      {/* Equipped items */}
      {equipped.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currently Wearing</p>
          <div className="flex gap-2 flex-wrap">
            {equipped.map((itemId) => {
              const item = SHOP_ITEMS.find((i) => i.id === itemId)
              if (!item) return null
              return (
                <button
                  key={itemId}
                  onClick={() => toggleEquip(itemId)}
                  className="flex items-center gap-1.5 bg-sprout-50 border border-sprout-200 text-sprout-700
                             text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-sprout-100 transition-colors"
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="text-sprout-400">✕</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Shop grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {SHOP_ITEMS.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              owned={inventory.includes(item.id)}
              equipped={equipped.includes(item.id)}
              coins={coins}
              onBuy={handleBuy}
              onToggleEquip={toggleEquip}
              buying={purchasing}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Earn coins by completing tasks! 🪙
      </p>
    </div>
  )
}
