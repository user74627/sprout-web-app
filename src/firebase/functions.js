import { httpsCallable, getFunctions } from 'firebase/functions'
import { app } from './config'

const functions = app ? getFunctions(app) : null

export async function completeTaskWithBackend(taskId) {
  const callable = httpsCallable(functions, 'completeTask')
  const result = await callable({ taskId })
  return result.data?.reward
}

export async function purchaseItemWithBackend(itemId) {
  const callable = httpsCallable(functions, 'purchaseItem')
  const result = await callable({ itemId })
  return result.data
}

