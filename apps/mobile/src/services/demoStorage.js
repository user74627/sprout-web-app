import AsyncStorage from '@react-native-async-storage/async-storage'

const DEPRECATED_KEY = '@sprout-mobile-demo-v1'

function createEmptyState(petName = 'Pip') {
  return {
    user: {
      uid: 'demo-uid',
      displayName: 'Demo User',
      email: 'demo@sprout.app',
    },
    pet: {
      petName,
      petHealth: 100,
      xp: 0,
      level: 1,
      coins: 0,
      coinsSpent: 0,
      totalCoinsEarned: 0,
      tasksCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      equippedItems: [],
      createdAt: new Date().toISOString(),
      lastUpdated: Date.now(),
    },
    tasks: {},
    inventory: {},
  }
}

export async function loadDemoState() {
  try {
    const raw = await AsyncStorage.getItem(DEPRECATED_KEY)
    if (!raw) return createEmptyState()
    return JSON.parse(raw)
  } catch {
    return createEmptyState()
  }
}

export async function saveDemoState(state) {
  await AsyncStorage.setItem(DEPRECATED_KEY, JSON.stringify(state))
}

// Task helpers
export async function getTasks() {
  const state = await loadDemoState()
  return Object.values(state.tasks || {})
}

export async function addTask(title, difficulty) {
  const state = await loadDemoState()
  const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  state.tasks[id] = {
    id,
    title,
    difficulty,
    completed: false,
    createdAt: Date.now(),
  }
  state.pet.lastUpdated = Date.now()
  await saveDemoState(state)
  return id
}

export async function completeTask(taskId) {
  const state = await loadDemoState()
  const task = state.tasks[taskId]
  if (!task || task.completed) return null

  const { getTaskReward } = await import('./core')
  const reward = getTaskReward(task.difficulty)

  task.completed = true
  task.completedAt = Date.now()
  task.rewardSnapshot = reward

  const pet = state.pet
  pet.petHealth = Math.min(100, (pet.petHealth || 0) + reward.health)
  pet.coins = (pet.coins || 0) + reward.coins
  pet.totalCoinsEarned = (pet.totalCoinsEarned || 0) + reward.coins
  pet.xp = (pet.xp || 0) + reward.xp
  pet.level = Math.floor((pet.xp || 0) / 100) + 1
  pet.tasksCompleted = (pet.tasksCompleted || 0) + 1
  pet.lastUpdated = Date.now()

  await saveDemoState(state)
  return reward
}

export async function deleteTask(taskId) {
  const state = await loadDemoState()
  delete state.tasks[taskId]
  state.pet.lastUpdated = Date.now()
  await saveDemoState(state)
}

// Shop helpers
export async function getShopItems() {
  return [
    { id: 'leaf-crown', name: 'Leaf Crown', price: 25, emoji: '👑', description: 'Fit for a sprout king', category: 'head' },
    { id: 'sun-hat', name: 'Sun Hat', price: 20, emoji: '🎩', description: 'A stylish sun hat', category: 'head' },
    { id: 'water-can', name: 'Watering Can', price: 30, emoji: '🪣', description: 'For daily care', category: 'toy' },
  ]
}

export async function getInventory() {
  const state = await loadDemoState()
  return Object.keys(state.inventory || {})
}

export async function purchaseItem(itemId, coins) {
  const items = await getShopItems()
  const item = items.find((i) => i.id === itemId)
  if (!item || coins < item.price) return { success: false, error: 'Not enough coins' }

  const state = await loadDemoState()
  if (state.inventory[itemId]) return { success: false, error: 'Already owned' }

  state.inventory[itemId] = {
    itemId,
    name: item.name,
    emoji: item.emoji,
    purchasedAt: Date.now(),
  }
  state.pet.coins = (state.pet.coins || 0) - item.price
  state.pet.coinsSpent = (state.pet.coinsSpent || 0) + item.price
  state.pet.lastUpdated = Date.now()

  await saveDemoState(state)
  return { success: true, item }
}

export async function toggleEquip(itemId, equippedItems) {
  const state = await loadDemoState()
  const hasItem = equippedItems.includes(itemId)
  state.pet.equippedItems = hasItem
    ? equippedItems.filter((id) => id !== itemId)
    : [...equippedItems, itemId]
  state.pet.lastUpdated = Date.now()
  await saveDemoState(state)
}

export async function resetDemo() {
  await AsyncStorage.removeItem(DEPRECATED_KEY)
}

// Pet helpers
export async function getPet() {
  const state = await loadDemoState()
  return state.pet
}

export async function updatePet(field, value) {
  const state = await loadDemoState()
  state.pet[field] = value
  state.pet.lastUpdated = Date.now()
  await saveDemoState(state)
}