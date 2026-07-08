import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'

initializeApp()

const db = getFirestore()

const TASK_REWARDS = {
  easy: { health: 10, coins: 5, xp: 8 },
  medium: { health: 20, coins: 15, xp: 18 },
  hard: { health: 35, coins: 30, xp: 35 },
}

const MAX_HEALTH = 100
const DECAY_PER_HOUR = 3
const XP_PER_LEVEL = 100

function requireUid(request) {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', 'You must be signed in.')
  return uid
}

function getReward(difficulty) {
  return TASK_REWARDS[difficulty] || TASK_REWARDS.medium
}

function getLevel(xp = 0) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

function clampHealth(health) {
  return Math.max(0, Math.min(MAX_HEALTH, health))
}

export const completeTask = onCall(async (request) => {
  const uid = requireUid(request)
  const taskId = request.data?.taskId
  if (!taskId) throw new HttpsError('invalid-argument', 'taskId is required.')

  const userRef = db.doc(`users/${uid}`)
  const taskRef = db.doc(`users/${uid}/tasks/${taskId}`)
  const eventRef = userRef.collection('events').doc()

  return db.runTransaction(async (tx) => {
    const [userSnap, taskSnap] = await Promise.all([tx.get(userRef), tx.get(taskRef)])
    if (!userSnap.exists) throw new HttpsError('not-found', 'User not found.')
    if (!taskSnap.exists) throw new HttpsError('not-found', 'Task not found.')

    const user = userSnap.data()
    const task = taskSnap.data()
    if (task.completed) throw new HttpsError('failed-precondition', 'Task already completed.')

    const reward = getReward(task.difficulty)
    const xp = (user.xp || 0) + reward.xp
    const now = FieldValue.serverTimestamp()

    tx.update(taskRef, {
      completed: true,
      completedAt: now,
      rewardSnapshot: reward,
    })

    tx.update(userRef, {
      petHealth: clampHealth((user.petHealth || 0) + reward.health),
      coins: (user.coins || 0) + reward.coins,
      totalCoinsEarned: (user.totalCoinsEarned || 0) + reward.coins,
      xp,
      level: getLevel(xp),
      tasksCompleted: (user.tasksCompleted || 0) + 1,
      lastCompletedAt: now,
      lastUpdated: now,
    })

    tx.set(eventRef, {
      type: 'task_completed',
      taskId,
      reward,
      createdAt: now,
    })

    return { reward, xp, level: getLevel(xp) }
  })
})

export const purchaseItem = onCall(async (request) => {
  const uid = requireUid(request)
  const itemId = request.data?.itemId
  if (!itemId) throw new HttpsError('invalid-argument', 'itemId is required.')

  const userRef = db.doc(`users/${uid}`)
  const itemRef = db.doc(`shopItems/${itemId}`)
  const inventoryRef = db.doc(`users/${uid}/inventory/${itemId}`)
  const eventRef = userRef.collection('events').doc()

  return db.runTransaction(async (tx) => {
    const [userSnap, itemSnap, inventorySnap] = await Promise.all([
      tx.get(userRef),
      tx.get(itemRef),
      tx.get(inventoryRef),
    ])

    if (!userSnap.exists) throw new HttpsError('not-found', 'User not found.')
    if (!itemSnap.exists) throw new HttpsError('not-found', 'Shop item not found.')
    if (inventorySnap.exists) throw new HttpsError('already-exists', 'Item already owned.')

    const user = userSnap.data()
    const item = itemSnap.data()
    if ((user.coins || 0) < item.price) {
      throw new HttpsError('failed-precondition', 'Not enough coins.')
    }

    const now = FieldValue.serverTimestamp()
    tx.update(userRef, {
      coins: (user.coins || 0) - item.price,
      coinsSpent: (user.coinsSpent || 0) + item.price,
    })
    tx.set(inventoryRef, {
      itemId,
      name: item.name,
      purchasedAt: now,
    })
    tx.set(eventRef, {
      type: 'item_purchased',
      itemId,
      price: item.price,
      createdAt: now,
    })

    return { itemId, coinsRemaining: (user.coins || 0) - item.price }
  })
})

export const applyPetDecay = onSchedule('every 60 minutes', async () => {
  const cutoff = Timestamp.fromMillis(Date.now() - 60 * 60 * 1000)
  const staleUsers = await db.collection('users').where('lastUpdated', '<=', cutoff).limit(200).get()
  const batch = db.batch()

  staleUsers.forEach((snap) => {
    const user = snap.data()
    const lastUpdatedMs = user.lastUpdated?.toMillis?.() || Date.now()
    const elapsedHours = Math.max(0, (Date.now() - lastUpdatedMs) / 3_600_000)
    const decay = Math.floor(elapsedHours * DECAY_PER_HOUR)
    if (decay <= 0) return

    batch.update(snap.ref, {
      petHealth: clampHealth((user.petHealth || MAX_HEALTH) - decay),
      lastUpdated: FieldValue.serverTimestamp(),
    })
  })

  await batch.commit()
})

