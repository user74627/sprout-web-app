import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import { useDemoAuth } from '../contexts/DemoAuthContext'

export default function AuthScreen() {
  const { enterDemo } = useDemoAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleDemo = () => enterDemo()

  // Google Sign-In (stub - needs expo-auth-session and Firebase setup)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  })

  const handleGoogle = async () => {
    if (!request) {
      Alert.alert('Setup', 'Google Sign-In needs client ID in app.config.js')
      return
    }
    const result = await promptAsync()
    if (result?.type === 'success') {
      // TODO: Firebase backend sign-in
      Alert.alert('Success', `Welcome! ${result.authentication?.accessToken ? 'Token received' : 'No token'}`)
    }
  }

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

      <View className="flex-row items-center w-full gap-4 mb-6">
        <View className="flex-1 h-px bg-line-subtle" />
        <Text className="text-xs text-ink-muted font-semibold">OR</Text>
        <View className="flex-1 h-px bg-line-subtle" />
      </View>

      <TouchableOpacity
        className="w-full flex-row items-center justify-center gap-2 bg-white border border-line-subtle rounded-2xl py-3"
        onPress={handleGoogle}
        disabled={!request}
      >
        {!request ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="text-lg">G</Text>
        )}
        <Text className="font-semibold text-ink">Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-full rounded-2xl py-4 items-center mt-4" onPress={handleDemo}>
        <Text className="text-ink font-semibold">Try Demo</Text>
      </TouchableOpacity>

      <Text className="text-xs text-ink-muted text-center mt-6 px-4">
        Your pet Pip is waiting for you
      </Text>
    </View>
  )
}