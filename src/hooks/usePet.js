import { useEffect, useState, useCallback } from 'react'
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { initUserDoc, applyHealthDecay, equipItem as dbEquipItem } from '../firebase/db'
import { useAuth } from '../contexts/AuthContext'

export function getPetState(health) {
  if (health >= 75) return 'thriving'
  if (health >= 45) return 'content'
  if (health >= 20) return 'droopy'
  return 'sad'
}

export function usePet() {
  const { user } = useAuth()
  const [petData, setPetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [decayApplied, setDecayApplied] = useState(false)

  useEffect(() => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)

    const unsubscribe = onSnapshot(userRef, async (snap) => {
      if (!snap.exists()) {
        await initUserDoc(user.uid, user.displayName)
        return
      }

      const data = snap.data()

      // Apply health decay once per session (avoid re-triggering on own writes)
      if (!decayApplied) {
        const lastMs = data.lastUpdated?.toMillis?.() ?? Date.now()
        const hoursSince = (Date.now() - lastMs) / 3_600_000
        const decay = Math.floor(hoursSince * 3)
        if (decay > 0) {
          setDecayApplied(true)
          const newHealth = Math.max(0, (data.petHealth ?? 100) - decay)
          await updateDoc(userRef, {
            petHealth: newHealth,
            lastUpdated: serverTimestamp(),
          })
          return // onSnapshot fires again with fresh data
        }
      }

      setPetData(data)
      setLoading(false)
    })

    return unsubscribe
  }, [user, decayApplied])

  const toggleEquip = useCallback(
    async (itemId) => {
      if (!user || !petData) return
      await dbEquipItem(user.uid, itemId, petData.equippedItems ?? [])
    },
    [user, petData],
  )

  const updatePetName = useCallback(
    async (name) => {
      if (!user) return
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
