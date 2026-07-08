# Backend Hardening Notes

Production must not trust client-side reward or purchase writes. The current app now routes sensitive production mutations through callable functions:

- `completeTaskWithBackend(taskId)` in `src/firebase/functions.js`
- `purchaseItemWithBackend(itemId)` in `src/firebase/functions.js`

Demo mode continues to mutate localStorage directly because it is intentionally single-browser and no-account.

## Protected Mutations

### Task Completion

Handled by `functions/index.js`:

- Requires authenticated user.
- Reads the task inside a Firestore transaction.
- Rejects missing/already-completed tasks.
- Uses server-side reward values.
- Updates task, user economy fields, XP/level, and event log atomically.

### Item Purchase

Handled by `functions/index.js`:

- Requires authenticated user.
- Reads canonical item from `shopItems/{itemId}`.
- Rejects duplicate inventory.
- Rejects insufficient coins.
- Deducts coins and creates inventory event atomically.

## Client Rules

The Firestore rules block direct client writes to:

- coins
- XP
- level
- inventory
- events
- completed task rewards

The client may still create/edit incomplete task details and profile preferences.

## Remaining Production Tasks

- Add unit tests for functions transactions.
- Add emulator tests for Firestore rules.
- Seed `shopItems` before enabling real production purchases.
- Add App Check when the public Firebase version is launched.

