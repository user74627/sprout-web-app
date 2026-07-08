import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

const stats = [
  { label: 'Pet mood', value: 'Content' },
  { label: 'Today', value: '1/4 tasks' },
  { label: 'Coins', value: '85' },
]

export default function MobileApp() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Sprout mobile foundation</Text>
        <Text style={styles.title}>Grow your goals from your phone</Text>
        <Text style={styles.copy}>
          This Expo shell is ready for the shared core rules, AsyncStorage demo mode,
          Firebase auth, and native reminders.
        </Text>

        <View style={styles.petCard}>
          <Text style={styles.pet}>🌱</Text>
          <Text style={styles.petName}>Pip</Text>
          <Text style={styles.petCopy}>Complete tasks to feed your pet and earn coins.</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf8f2',
  },
  container: {
    padding: 24,
  },
  eyebrow: {
    color: '#16a34a',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  copy: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  petCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginTop: 24,
  },
  pet: {
    fontSize: 72,
  },
  petName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginTop: 8,
  },
  petCopy: {
    color: '#6b7280',
    marginTop: 6,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 14,
  },
  statValue: {
    fontWeight: '900',
    color: '#111827',
    fontSize: 18,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 4,
  },
})

