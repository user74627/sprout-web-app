import { NavigationContainer } from '@react-navigation/native'
import { DemoAuthProvider, useDemoAuth } from './src/contexts/DemoAuthContext'
import RootNavigator from './src/navigation/RootNavigator'
import { StatusBar } from 'expo-status-bar'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { Alert } from 'react-native'

export default function App() {
  return (
    <DemoAuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <NotificationHandler />
        <RootNavigator />
      </NavigationContainer>
    </DemoAuthProvider>
  )
}

function NotificationHandler() {
  const { user } = useDemoAuth()

  useEffect(() => {
    const init = async () => {
      if (!user) return

      const { granted } = await Notifications.requestPermissionsAsync()
      if (!granted) {
        Alert.alert('Notifications', 'Enable notifications to get daily reminders.')
        return
      }

      const token = await Notifications.getExpoPushTokenAsync()
      // In production: store token in Firebase under users/{uid}/devices/
      // await storeDeviceToken(user.uid, token.data)
    }
    init()
  }, [user])

  return null
}