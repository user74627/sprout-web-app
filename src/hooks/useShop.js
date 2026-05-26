import { useEffect, useState, useCallback } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { inventoryRef, purchaseItem as dbPurchaseItem } from '../firebase/db'
import { SHOP_ITEMS } from '../constants/shopItems'

export function useShop() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (!user) return

    const unsubscribe = onSnapshot(inventoryRef(user.uid), (snap) => {
      setInventory(snap.docs.map((d) => d.id))
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const buyItem = useCallback(
    async (item) => {
      if (!user || purchasing) return { success: false, error: 'Busy' }
      if (inventory.includes(item.id)) return { success: false, error: 'Already owned' }
      setPurchasing(true)
      try {
        await dbPurchaseItem(user.uid, item)
        return { success: true }
      } catch (err) {
        return { success: false, error: err.message }
      } finally {
        setPurchasing(false)
      }
    },
    [user, inventory, purchasing],
  )

  return { inventory, loading, purchasing, buyItem, SHOP_ITEMS }
}
