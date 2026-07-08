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

      {/* Pet preview */}
      <div className="card flex items-center gap-4 mb-4 py-4">
        <Pet health={health} equippedItems={equipped} size={64} />
        <div>
          <p className="text-card-heading">{petData?.petName ?? 'Pip'}</p>
          <p className="text-caption text-ink-muted mt-0.5">
            {equipped.length > 0
              ? `Wearing ${equipped.length} item${equipped.length > 1 ? 's' : ''}`
              : 'No accessories equipped yet'}
          </p>
        </div>
      </div>

      {equipped.length > 0 && (
        <div className="mb-4">
          <p className="text-caption font-bold text-ink-muted uppercase tracking-wider mb-2">
            Currently wearing
          </p>
          <div className="flex gap-2 flex-wrap">
            {equipped.map((itemId) => {
              const item = SHOP_ITEMS.find((i) => i.id === itemId)
              if (!item) return null
              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => toggleEquip(itemId)}
                  className="flex items-center gap-1.5 bg-sprout-50 border border-sprout-200 text-sprout-700
                             text-caption font-semibold px-3 py-1.5 rounded-full hover:bg-sprout-100 transition-colors"
                >
                  <span aria-hidden="true">{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="text-sprout-400" aria-hidden="true">×</span>
                </button>
              )
            })}
          </div>
        </div>
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
            {visibleItems.map((item) => (
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
      )}

      <p className="text-caption text-ink-muted text-center mt-6">
        Complete tasks to earn coins for your pet.
      </p>
    </div>
  )
}
