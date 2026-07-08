export function canAffordItem(coins, item) {
  return (Number(coins) || 0) >= (Number(item?.price) || 0)
}

export function purchaseItemState({ user, inventory = [], item }) {
  if (!item) throw new Error('Missing item')
  if (inventory.includes(item.id)) throw new Error('Already owned')
  if (!canAffordItem(user?.coins, item)) throw new Error('Not enough coins')

  return {
    inventory: [...inventory, item.id],
    user: {
      ...user,
      coins: (user?.coins || 0) - item.price,
      coinsSpent: (user?.coinsSpent || 0) + item.price,
    },
  }
}

export function toggleEquippedItem(equippedItems = [], itemId) {
  return equippedItems.includes(itemId)
    ? equippedItems.filter((id) => id !== itemId)
    : [...equippedItems, itemId]
}

export function isItemUnlocked(item, user = {}) {
  const requiredLevel = item?.requiredLevel || 1
  const userLevel = user?.level || 1
  return userLevel >= requiredLevel
}

