import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useDemoAuth } from '../contexts/DemoAuthContext'

export default function AuthScreen() {
  const { enterDemo } = useDemoAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleDemo = () => enterDemo()

  return (
    <View className="flex-1 bg-cream-50 items-center justify-center px-6">
      <View className="w-20 h-20 bg-sprout-500 rounded-3xl items-center justify-center mb-6">
        <Text className="text-4xl">🌱</Text>
      </View>

      <Text className="text-3xl font-bold text-ink mb-2">Sprout</Text>
      <Text className="text-sm text-ink-muted mb-8 text-center">
        Grow your goals, one task at a time.
      </Text>

      <View className="w-full gap-4 mb-8">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="bg-white rounded-2xl px-4 py-3 border border-ink-muted/20"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-white rounded-2xl px-4 py-3 border border-ink-muted/20"
        />
      </View>

      <TouchableOpacity className="w-full bg-sprout-500 rounded-2xl py-4 items-center mb-4" onPress={() => Alert.alert('Not yet', 'Production auth coming soon')}>
        <Text className="text-white font-semibold text-lg">Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-full bg-cream-200 rounded-2xl py-4 items-center" onPress={handleDemo}>
        <Text className="text-ink font-semibold">Try Demo</Text>
      </TouchableOpacity>

      <Text className="text-xs text-ink-muted text-center mt-6 px-4">
        Your pet Pip is waiting for you
      </Text>
    </View>
  )
}