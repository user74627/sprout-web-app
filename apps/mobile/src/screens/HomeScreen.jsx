import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useDemoAuth } from '../contexts/DemoAuthContext'
import * as demoStorage from '../services/demoStorage'
import { getPetState, getPetLevel, getLevelProgress } from '../services/core'

export default function HomeScreen() {
  const { user } = useDemoAuth()
  const [pet, setPet] = useState(null)

  useEffect(() => {
    const load = async () => {
      const petData = await demoStorage.getPet()
      setPet(petData)
    }
    load()
  }, [])

  if (!pet) return null

  const state = getPetState(pet.petHealth || 0)
  const level = getPetLevel(pet.xp || 0)
  const progress = getLevelProgress(pet.xp || 0)

  return (
    <ScrollView className="flex-1 bg-cream-50">
      <View className="pt-12 px-6 pb-6">
        <Text className="text-lg font-bold text-ink mb-2">Home</Text>
        <Text className="text-sm text-ink-muted mb-6">
          {user?.displayName ?? 'Sprout User'}
        </Text>

        <View className="bg-surface-elevated rounded-3xl p-6 items-center mb-4 shadow-card">
          <Text className="text-6xl mb-3">🌱</Text>
          <Text className="text-xl font-bold text-ink">{pet.petName || 'Pip'}</Text>
          <View className={`px-3 py-1 rounded-full mt-2 ${
            state === 'thriving' ? 'bg-sprout-100' :
            state === 'content' ? 'bg-xp-100' :
            state === 'droopy' ? 'bg-streak-100' : 'bg-cream-200'
          }`}>
            <Text className={`text-sm font-semibold capitalize ${
              state === 'thriving' ? 'text-sprout-700' :
              state === 'content' ? 'text-xp-700' :
              state === 'droopy' ? 'text-streak-700' : 'text-ink-muted'
            }`}>
              {state}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-surface-elevated rounded-2xl p-4 items-center">
            <Text className="text-2xl font-bold text-sprout-600">{level}</Text>
            <Text className="text-xs text-ink-muted mt-1">Level</Text>
          </View>
          <View className="flex-1 bg-surface-elevated rounded-2xl p-4 items-center">
            <Text className="text-2xl font-bold text-coin-600">{pet.coins || 0}</Text>
            <Text className="text-xs text-ink-muted mt-1">Coins</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface-elevated rounded-2xl p-4 items-center">
            <Text className="text-2xl font-bold text-xp-600">{progress}</Text>
            <Text className="text-xs text-ink-muted mt-1">XP</Text>
          </View>
          <View className="flex-1 bg-surface-elevated rounded-2xl p-4 items-center">
            <Text className="text-2xl font-bold text-streak-600">{pet.currentStreak || 0}</Text>
            <Text className="text-xs text-ink-muted mt-1">Streak</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}