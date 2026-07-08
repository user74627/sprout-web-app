import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import * as demo from '../demo/demoStore'
export { getPetState } from '../core/pet'
import { getPetState, calculateHealthDecay } from '../core/pet'

export function usePet() {
  const { user } = useAuth()
  const [petData, setPetData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPetData(null)
      setLoading(false)
      return
    }

    if (isDemoMode) {
      const refresh = () => setPetData(demo.getUserDoc())
      refresh()
      setLoading(false)
      return demo.subscribe(refresh)
    }

    let unsubscribe
    ;(async () => {
      const { doc, onSnapshot, updateDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../firebase/config')
      const { initUserDoc } = await import('../firebase/db')

      let decayApplied = false
      const userRef = doc(db, 'users', user.uid)

      unsubscribe = onSnapshot(userRef, async (snap) => {
        if (!snap.exists()) {
          await initUserDoc(user.uid, user.displayName)
          return
        }

        const data = snap.data()

        if (!decayApplied) {
          const lastMs = data.lastUpdated?.toMillis?.() ?? Date.now()
          const decay = calculateHealthDecay(lastMs)
          if (decay > 0) {
            decayApplied = true
            const newHealth = Math.max(0, (data.petHealth ?? 100) - decay)
            await updateDoc(userRef, {
              petHealth: newHealth,
              lastUpdated: serverTimestamp(),
            })
            return
          }
        }

        setPetData(data)
        setLoading(false)
      })
    })()

    return () => unsubscribe?.()
  }, [user])

  const toggleEquip = useCallback(
    async (itemId) => {
      if (!user || !petData) return
      if (isDemoMode) {
        demo.equipItem(itemId, petData.equippedItems ?? [])
        return
      }
      const { equipItem } = await import('../firebase/db')
      await equipItem(user.uid, itemId, petData.equippedItems ?? [])
    },
    [user, petData],
  )

  const updatePetName = useCallback(
    async (name) => {
      if (!user) return
      if (isDemoMode) {
        demo.updateUserDoc({ petName: name })
        return
      }
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../firebase/config')
      await updateDoc(doc(db, 'users', user.uid), { petName: name })
    },
    [user],
  )

  return {
    petData,
    loading,
    petState: petData ? getPetState(petData.petHealth ?? 0) : 'content',
    toggleEquip,
    updatePetName,
  }
}
