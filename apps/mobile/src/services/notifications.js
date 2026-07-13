import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import * as Device from 'expo-device'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export async function requestPermissionsAsync() {
  if (!Device.isDevice) {
    return { granted: false, reason: 'Must use physical device' }
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return { granted: false, reason: 'Permission denied' }
  }

  return { granted: true }
}

export async function getExpoPushToken() {
  const { granted } = await requestPermissionsAsync()
  if (!granted) return null

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId ?? Constants.manifest?.extra?.eas?.projectId,
  })

  return expoPushToken.data
}

export async function scheduleDailyReminder(hour = 9, minute = 0) {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sprout reminder',
      body: 'Complete a task to feed your pet!',
      sound: 'default',
      data: { type: 'daily-reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  })

  return identifier
}

export function addNotificationListener(callback) {
  return Notifications.addNotificationReceivedListener(callback)
}

export function addResponseListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback)
}