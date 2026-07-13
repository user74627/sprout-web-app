import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { useDemoAuth } from '../contexts/DemoAuthContext'
import { ActivityIndicator, View } from 'react-native'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const TAB_ICONS = {
  Home: '🏠',
  Tasks: '✅',
  Shop: '🛍️',
  Progress: '📊',
}

export default function RootNavigator() {
  const { user, loading } = useDemoAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream-50">
        <ActivityIndicator color="#22c55e" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <span className={`text-xl ${focused ? 'text-sprout-600' : 'text-ink-muted'}`}>
            {TAB_ICONS[route.name]}
          </span>
        ),
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#fffdf9',
          borderTopColor: '#eee9de',
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  )
}

// Auth screen placeholder
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={AuthScreen} />
    </Stack.Navigator>
  )
}

// Placeholder screens
function HomeScreen() {
  return null
}
function TasksScreen() {
  return null
}
function ShopScreen() {
  return null
}
function ProgressScreen() {
  return null
}
function AuthScreen() {
  return null
}