import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import ShopItem from '../components/ShopItem/ShopItem'
import Pet from '../components/Pet/Pet'
import { usePet } from '../hooks/usePet'
import { useShop } from '../hooks/useShop'
import { PageHeader, CoinPill, SegmentedControl, Toast, EmptyState } from '../components/ui'

export default function Shop() {
  const { petData, toggleEquip } = usePet()
  const { inventory, purchasing, buyItem, SHOP_ITEMS } = useShop()
  const [toast, setToast] = useState(null)
  const [category, setCategory] = useState('all')

  const coins    = petData?.coins ?? 0
  const health   = petData?.petHealth ?? 100
  const equipped = petData?.equippedItems ?? []
  const categories = ['all', ...new Set(SHOP_ITEMS.map((item) => item.category))]

  const categoryOptions = categories.map((cat) => ({
    id: cat,
    label: cat === 'all' ? `All (${SHOP_ITEMS.length})` : `${cat} (${SHOP_ITEMS.filter((i) => i.category === cat).length})`,
  }))

  const visibleItems = category === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((item) => item.category === category)

  function showToast(msg, tone = 'success') {
    setToast({ msg, tone })
    setTimeout(() => setToast(null), 2200)
  }

  async function handleBuy(item) {
    const result = await buyItem(item)
    if (result.success) {
      showToast(<><span aria-hidden="true">{item.emoji}</span> {item.name} added!</>, 'reward')
    } else {
      showToast(
        result.error === 'Not enough coins'
          ? `Need ${item.price - coins} more coins`
          : result.error,
        'error',
      )
    }
  }

  return (
    <div className="page">
      <Toast show={!!toast} tone={toast?.tone}>
        {toast?.msg}
      </Toast>

      <PageHeader
        title="Shop"
        subtitle="Dress up your pet with earned coins"
        action={<CoinPill amount={coins} />}
      />

      <section className="card-flat mb-5 grid grid-cols-[auto_1fr] gap-4">
        <div className="relative">
          <div className="pet-glow pet-glow-content absolute inset-0 scale-150" aria-hidden="true" />
          <Pet health={health} equippedItems={equipped} size={72} />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-lg font-semibold text-soil-800">{petData?.petName ?? 'Pip'}</p>
          <p className="text-xs text-soil-400/80 mt-0.5">
            {equipped.length > 0
              ? `Wearing ${equipped.length} item${equipped.length > 1 ? 's' : ''}`
              : 'No accessories equipped yet'}
          </p>
          <p className="text-sm font-semibold text-coin-600 tabular mt-2">
            {coins} coins available
          </p>
        </div>
      </section>

      {equipped.length > 0 && (
        <section className="mb-5">
          <p className="text-section-label mb-2">Currently wearing</p>
          <div className="flex gap-2 flex-wrap">
            {equipped.map((itemId) => {
              const item = SHOP_ITEMS.find((i) => i.id === itemId)
              if (!item) return null
              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => toggleEquip(itemId)}
                  className="flex items-center gap-1.5 bg-sprout-50 border border-sprout-200/60 text-sprout-700
                             text-xs font-medium px-3 py-1.5 rounded-full hover:bg-sprout-100 transition-colors duration-150
                             focus-visible:ring-2 focus-visible:ring-sprout-400"
                >
                  <span aria-hidden="true">{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="text-sprout-400" aria-hidden="true">×</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <SegmentedControl
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        className="mb-4"
      />

      {visibleItems.length === 0 ? (
        <EmptyState
          title="No items in this category"
          message="Try another category or earn more coins."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {visibleItems.map((item, i) => (
              <ShopItem
                key={item.id}
                item={item}
                owned={inventory.includes(item.id)}
                equipped={equipped.includes(item.id)}
                coins={coins}
                onBuy={handleBuy}
                onToggleEquip={toggleEquip}
                buying={purchasing}
                layout={i % 3 === 0 ? 'compact' : 'default'}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="text-xs text-soil-400/70 text-center mt-6">
        Complete tasks to earn coins for your pet.
      </p>
    </div>
  )
}
