# Firebase Backend Setup

Sprout should support two modes:

- Demo mode: GitHub Pages, no auth, localStorage only.
- Production mode: Firebase Auth, Firestore, Cloud Functions, and notifications.

## Firebase Products

Enable these in the Firebase Console:

1. Authentication
   - Email/password for MVP.
   - Google Sign-In later.
2. Cloud Firestore
   - Native mode.
   - Region close to primary users.
3. Cloud Functions
   - Required for production-safe rewards and purchases.
4. Cloud Messaging
   - Used later for due-task and droopy-pet reminders.
5. Firebase Hosting
   - Optional production host; GitHub Pages can remain the no-login demo.

## Firestore Data Model

```text
users/{uid}
  displayName
  petName
  petHealth
  xp
  level
  coins
  coinsSpent
  totalCoinsEarned
  tasksCompleted
  currentStreak
  bestStreak
  equippedItems[]
  lastCompletedAt
  lastUpdated
  createdAt

users/{uid}/tasks/{taskId}
  title
  difficulty
  category
  notes
  dueDate
  recurrence
  completed
  completedAt
  rewardSnapshot
  createdAt

users/{uid}/inventory/{itemId}
  itemId
  name
  purchasedAt

users/{uid}/events/{eventId}
  type
  taskId
  itemId
  reward
  createdAt

shopItems/{itemId}
  name
  price
  category
  slot
  emoji
  description
  requiredLevel
  active
```

## Security Model

- Users may read their own `users/{uid}` subtree.
- Production clients should not directly update reward-sensitive fields like coins, XP, inventory, task completion count, or pet health.
- Cloud Functions own `completeTask` and `purchaseItem`.
- `shopItems` is public read-only.

## Functions

Callable functions:

- `completeTask({ taskId })`
  - Verifies auth.
  - Loads user and task.
  - Rejects missing/already-completed tasks.
  - Applies reward atomically.
  - Updates streak and event log.

- `purchaseItem({ itemId })`
  - Verifies auth.
  - Loads item from `shopItems`.
  - Rejects duplicate purchase or insufficient coins.
  - Deducts coins and writes inventory atomically.

Scheduled functions:

- `applyPetDecay`
  - Runs periodically.
  - Updates stale pet health based on `lastUpdated`.

- `sendTaskReminders`
  - Later feature.
  - Sends FCM reminders for due tasks and droopy pets.

## Local Development

Use Firebase emulators before production:

```bash
firebase emulators:start
```

Recommended emulator ports are defined in `firebase.json`.

