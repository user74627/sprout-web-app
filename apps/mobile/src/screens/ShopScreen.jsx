import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import * as demoStorage from '../services/demoStorage'

export default function ShopScreen() {
  const [items, setItems] = useState([])
  const [inventory, setInventory] = useState([])
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    const load = async () => {
      const [shopItems, inv, pet] = await Promise.all([
        demoStorage.getShopItems(),
        demoStorage.getInventory(),
        demoStorage.getPet(),
      ])
      setItems(shopItems)
      setInventory(inv)
      setCoins(pet.coins || 0)
    }
    load()
  }, [])

  const handleBuy = async (item) => {
    const result = await demoStorage.purchaseItem(item.id, coins)
    if (result.success) {
      setCoins(coins - item.price)
      setInventory([...inventory, item.id])
    }
  }

  const handleEquip = async (itemId) => {
    const pet = await demoStorage.getPet()
    await demoStorage.toggleEquip(itemId, pet.equippedItems || [])
  }

  return (
    <ScrollView className="flex-1 bg-cream-50 pt-12 px-6">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-lg font-bold text-ink">Shop</Text>
        <View className="flex-row items-center gap-1 bg-surface-elevated px-3 py-1.5 rounded-full">
          <Text className="text-lg">🪙</Text>
          <Text className="text-lg font-bold text-coin-600">{coins}</Text>
        </View>
      </ScrollView>

      <View className="flex-row flex-wrap gap-3">
        {items.map((item) => {
          const owned = inventory.includes(item.id)
          const canAfford = coins >= item.price
          return (
            <View key={item.id} className="w-[48%] bg-surface-elevated rounded-2xl p-4 items-center">
              <Text className="text-4xl mb-2">{item.emoji}</Text>
              <Text className="text-sm font-semibold text-ink text-center mb-1">
                {item.name}
              </Text>
              <Text className="text-xs text-ink-muted text-center mb-3">
                {item.description}
              </Text>

              <View className="flex-row items-center gap-1 mb-3">
                <Text>🪙</Text>
                <Text className="font-bold text-coin-600">{item.price}</Text>
              </View>

              {!owned ? (
                <TouchableOpacity
                  onPress={() => handleBuy(item)}
                  className={`px-4 py-2 rounded-xl ${
                    canAfford ? 'bg-sprout-500' : 'bg-cream-300'
                  }`}
                  disabled={!canAfford}
                >
                  <Text className={`font-semibold ${
                    canAfford ? 'text-white' : 'text-ink-muted'
                  }`}>
                    {canAfford ? 'Buy' : 'Need coins'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleEquip(item.id)} className="px-4 py-2 rounded-xl bg-xp-500">
                  <Text className="text-white font-semibold">Equip</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}