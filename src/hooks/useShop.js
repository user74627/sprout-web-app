import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import { SHOP_ITEMS } from '../constants/shopItems'
import * as demo from '../demo/demoStore'

export function useShop() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (!user) {
      setInventory([])
      setLoading(false)
      return
    }

    if (isDemoMode) {
      const refresh = () => setInventory(demo.getInventory())
      refresh()
      setLoading(false)
      return demo.subscribe(refresh)
    }

    let unsubscribe
    ;(async () => {
      const { onSnapshot } = await import('firebase/firestore')
      const { inventoryRef } = await import('../firebase/db')

      unsubscribe = onSnapshot(inventoryRef(user.uid), (snap) => {
        setInventory(snap.docs.map((d) => d.id))
        setLoading(false)
      })
    })()

    return () => unsubscribe?.()
  }, [user])

  const buyItem = useCallback(
    async (item) => {
      if (!user || purchasing) return { success: false, error: 'Busy' }
      if (inventory.includes(item.id)) return { success: false, error: 'Already owned' }
      setPurchasing(true)
      try {
        if (isDemoMode) {
          demo.purchaseItem(item)
        } else {
          const { purchaseItem: dbPurchaseItem } = await import('../firebase/db')
          await dbPurchaseItem(user.uid, item)
        }
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
