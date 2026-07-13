import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import * as demoStorage from '../services/demoStorage'
import { getPetState, getPetLevel, getLevelProgress } from '../services/core'

export default function ProgressScreen() {
  const [pet, setPet] = useState(null)

  useEffect(() => {
    const load = async () => {
      const p = await demoStorage.getPet()
      setPet(p)
    }
    load()
  }, [])

  if (!pet) return null

  const state = getPetState(pet.petHealth || 0)
  const level = getPetLevel(pet.xp || 0)
  const xpProgress = getLevelProgress(pet.xp || 0)

  const stats = [
    { label: 'Level', value: level },
    { label: 'Tasks done', value: pet.tasksCompleted || 0 },
    { label: 'Streak', value: pet.currentStreak || 0 },
    { label: 'Coins earned', value: pet.totalCoinsEarned || 0 },
    { label: 'Coins spent', value: pet.coinsSpent || 0 },
  ]

  return (
    <ScrollView className="flex-1 bg-cream-50 pt-12 px-6">
      <Text className="text-lg font-bold text-ink mb-6">Progress</Text>

      <View className="bg-surface-elevated rounded-2xl p-5 mb-4 shadow-card">
        <View className="flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-2xl bg-sprout-100 items-center justify-center">
            <Text className="text-2xl">🌱</Text>
          </View>
          <View>
            <Text className="text-lg font-bold text-ink">{pet.petName || 'Pip'}</Text>
            <View className={`px-2 py-0.5 rounded-full mt-1 bg-${
              state === 'thriving' ? 'sprout-100' :
              state === 'content' ? 'xp-100' :
              state === 'droopy' ? 'streak-100' : 'cream-200'
            }`}>
              <Text className={`text-xs font-semibold capitalize text-${
                state === 'thriving' ? 'sprout-700' :
                state === 'content' ? 'xp-700' :
                state === 'droopy' ? 'streak-700' : 'ink-muted'
              }`}>
                {state}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {stats.map((s) => (
          <View key={s.label} className="w-[48%] bg-surface-elevated rounded-2xl p-4 items-center">
            <Text className="text-2xl font-bold text-ink">{s.value}</Text>
            <Text className="text-xs text-ink-muted mt-1">{s.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity className="bg-cream-100 rounded-2xl p-4 items-center mt-6">
        <Text className="text-ink font-semibold">Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}