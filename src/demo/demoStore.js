import { applyHealthDecay, getPetLevel } from '../core/pet'
import { completeTaskState } from '../core/tasks'
import { purchaseItemState, toggleEquippedItem } from '../core/shop'

const STORAGE_KEY = 'sprout-demo-v1'

const listeners = new Set()

function ts(iso) {
  const date = new Date(iso)
  return {
    toDate: () => date,
    toMillis: () => date.getTime(),
  }
}

function defaultState() {
  const now = Date.now()
  const hourAgo = now - 3_600_000
  const todayMorning = new Date()
  todayMorning.setHours(9, 0, 0, 0)

  return {
    user: {
      displayName: 'Demo User',
      petName: 'Pip',
      petHealth: 68,
      xp: 135,
      level: 2,
      coins: 85,
      coinsSpent: 35,
      totalCoinsEarned: 120,
      tasksCompleted: 4,
      currentStreak: 2,
      bestStreak: 3,
      equippedItems: [],
      lastUpdated: hourAgo,
      createdAt: now - 7 * 86_400_000,
    },
    tasks: [
      {
        id: 't1',
        title: 'Morning stretch',
        difficulty: 'easy',
        completed: false,
        createdAt: todayMorning.toISOString(),
      },
      {
        id: 't2',
        title: 'Finish homework chapter',
        difficulty: 'medium',
        completed: false,
        createdAt: new Date(now - 1_800_000).toISOString(),
      },
      {
        id: 't3',
        title: 'Deep work session (90 min)',
        difficulty: 'hard',
        completed: false,
        createdAt: new Date(now - 600_000).toISOString(),
      },
      {
        id: 't4',
        title: 'Drink water',
        difficulty: 'easy',
        completed: true,
        createdAt: new Date(todayMorning.getTime() - 3_600_000).toISOString(),
        completedAt: todayMorning.toISOString(),
      },
    ],
    inventory: [],
  }
}

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw)
  } catch {
    return defaultState()
  }
}

function saveRaw(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((fn) => fn())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetDemoData() {
  saveRaw(defaultState())
}

export function getUserDoc() {
  const state = loadRaw()
  const { user } = applyHealthDecay(state.user)
  if (user.lastUpdated !== state.user.lastUpdated) {
    state.user = user
    saveRaw(state)
  }
  return {
    ...user,
    createdAt: ts(user.createdAt),
    lastUpdated: ts(user.lastUpdated),
  }
}

export function updateUserDoc(patch) {
  const state = loadRaw()
  state.user = { ...state.user, ...patch, lastUpdated: Date.now() }
  saveRaw(state)
}

export function getTasks() {
  return loadRaw().tasks
    .map((t) => ({
      ...t,
      createdAt: t.createdAt ? ts(t.createdAt) : ts(new Date().toISOString()),
      completedAt: t.completedAt ? ts(t.completedAt) : undefined,
    }))
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
}

export function addTask(title, difficulty) {
  const state = loadRaw()
  const task = {
    id: `t-${Date.now()}`,
    title,
    difficulty,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  state.tasks.unshift(task)
  saveRaw(state)
}

export function completeTask(taskId, difficulty) {
  const state = loadRaw()
  const task = state.tasks.find((t) => t.id === taskId)
  const result = completeTaskState({ task: { ...task, difficulty }, user: state.user })
  if (result.alreadyCompleted) return result.reward

  Object.assign(task, {
    ...result.task,
    completedAt: new Date(result.task.completedAt).toISOString(),
  })
  state.user = {
    ...result.user,
    level: getPetLevel(result.user.xp),
  }
  saveRaw(state)
  return result.reward
}

export function deleteTask(taskId) {
  const state = loadRaw()
  state.tasks = state.tasks.filter((t) => t.id !== taskId)
  saveRaw(state)
}

export function getInventory() {
  return loadRaw().inventory
}

export function purchaseItem(item) {
  const state = loadRaw()
  const result = purchaseItemState({
    user: state.user,
    inventory: state.inventory,
    item,
  })
  state.inventory = result.inventory
  state.user = result.user
  saveRaw(state)
}

export function equipItem(itemId, equippedItems) {
  updateUserDoc({ equippedItems: toggleEquippedItem(equippedItems, itemId) })
}
