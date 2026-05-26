import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from './config'

// ── User document ────────────────────────────────────────────────────────────

export async function initUserDoc(uid, displayName) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: displayName || 'Sprout User',
      petName: 'Pip',
      petHealth: 100,
      coins: 0,
      totalCoinsEarned: 0,
      tasksCompleted: 0,
      equippedItems: [],
      lastUpdated: serverTimestamp(),
      createdAt: serverTimestamp(),
    })
  }
}

export async function getUserRef(uid) {
  return doc(db, 'users', uid)
}

// ── Pet / health ─────────────────────────────────────────────────────────────

export async function applyHealthDecay(uid, petHealth, lastUpdatedMs) {
  const now = Date.now()
  const hoursSince = (now - lastUpdatedMs) / 3_600_000
  const decay = Math.floor(hoursSince * 3) // 3 hp / hour
  if (decay <= 0) return petHealth

  const newHealth = Math.max(0, petHealth - decay)
  await updateDoc(doc(db, 'users', uid), {
    petHealth: newHealth,
    lastUpdated: serverTimestamp(),
  })
  return newHealth
}

// ── Tasks ────────────────────────────────────────────────────────────────────

const TASK_REWARDS = {
  easy:   { health: 10, coins: 5  },
  medium: { health: 20, coins: 15 },
  hard:   { health: 35, coins: 30 },
}

export function tasksRef(uid) {
  return collection(db, 'users', uid, 'tasks')
}

export async function addTask(uid, title, difficulty) {
  await addDoc(tasksRef(uid), {
    title,
    difficulty,
    completed: false,
    createdAt: serverTimestamp(),
  })
}

export async function completeTask(uid, taskId, difficulty) {
  const reward = TASK_REWARDS[difficulty] || TASK_REWARDS.medium
  const userRef = doc(db, 'users', uid)
  const taskRef = doc(db, 'users', uid, 'tasks', taskId)

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef)
    const data = userSnap.data()
    const newHealth = Math.min(100, (data.petHealth || 0) + reward.health)

    tx.update(taskRef, { completed: true, completedAt: serverTimestamp() })
    tx.update(userRef, {
      petHealth: newHealth,
      coins: (data.coins || 0) + reward.coins,
      totalCoinsEarned: (data.totalCoinsEarned || 0) + reward.coins,
      tasksCompleted: (data.tasksCompleted || 0) + 1,
      lastUpdated: serverTimestamp(),
    })
  })

  return reward
}

export async function deleteTask(uid, taskId) {
  await deleteDoc(doc(db, 'users', uid, 'tasks', taskId))
}

// ── Shop / inventory ─────────────────────────────────────────────────────────

export function inventoryRef(uid) {
  return collection(db, 'users', uid, 'inventory')
}

export async function purchaseItem(uid, item) {
  const userRef = doc(db, 'users', uid)
  const itemRef = doc(db, 'users', uid, 'inventory', item.id)

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef)
    const coins = userSnap.data()?.coins || 0
    if (coins < item.price) throw new Error('Not enough coins')

    tx.set(itemRef, { name: item.name, purchasedAt: serverTimestamp() })
    tx.update(userRef, { coins: coins - item.price })
  })
}

export async function equipItem(uid, itemId, equippedItems) {
  await updateDoc(doc(db, 'users', uid), {
    equippedItems: equippedItems.includes(itemId)
      ? equippedItems.filter((i) => i !== itemId)
      : [...equippedItems, itemId],
  })
}
