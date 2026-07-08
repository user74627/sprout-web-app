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
import { getTaskReward } from '../core/rewards'
import { applyHealthReward, getPetLevel } from '../core/pet'
import { toggleEquippedItem } from '../core/shop'

// ── User document ────────────────────────────────────────────────────────────

export async function initUserDoc(uid, displayName) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: displayName || 'Sprout User',
      petName: 'Pip',
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
  const reward = getTaskReward(difficulty)
  const userRef = doc(db, 'users', uid)
  const taskRef = doc(db, 'users', uid, 'tasks', taskId)

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef)
    const taskSnap = await tx.get(taskRef)
    const data = userSnap.data()
    const task = taskSnap.data()
    if (!task || task.completed) return

    const xp = (data.xp || 0) + reward.xp
    const newHealth = applyHealthReward(data.petHealth || 0, reward.health)

    tx.update(taskRef, { completed: true, completedAt: serverTimestamp() })
    tx.update(userRef, {
      petHealth: newHealth,
      coins: (data.coins || 0) + reward.coins,
      totalCoinsEarned: (data.totalCoinsEarned || 0) + reward.coins,
      xp,
      level: getPetLevel(xp),
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
    const itemSnap = await tx.get(itemRef)
    if (itemSnap.exists()) throw new Error('Already owned')

    const userData = userSnap.data() || {}
    const coins = userData.coins || 0
    if (coins < item.price) throw new Error('Not enough coins')

    tx.set(itemRef, { name: item.name, purchasedAt: serverTimestamp() })
    tx.update(userRef, {
      coins: coins - item.price,
      coinsSpent: (userData.coinsSpent || 0) + item.price,
    })
  })
}

export async function equipItem(uid, itemId, equippedItems) {
  await updateDoc(doc(db, 'users', uid), {
    equippedItems: toggleEquippedItem(equippedItems, itemId),
  })
}
