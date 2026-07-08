import { getTaskReward } from './rewards'
import { applyHealthReward } from './pet'

export function createTask({ title, difficulty = 'medium', category = 'General', dueDate = null, notes = '' }) {
  return {
    title: title.trim(),
    difficulty,
    category,
    dueDate,
    notes,
    completed: false,
  }
}

export function completeTaskState({ task, user, now = Date.now() }) {
  if (!task || task.completed) {
    return {
      task,
      user,
      reward: getTaskReward(task?.difficulty),
      alreadyCompleted: true,
    }
  }

  const reward = getTaskReward(task.difficulty)

  return {
    reward,
    alreadyCompleted: false,
    task: {
      ...task,
      completed: true,
      completedAt: now,
    },
    user: {
      ...user,
      petHealth: applyHealthReward(user?.petHealth ?? 0, reward.health),
      coins: (user?.coins || 0) + reward.coins,
      totalCoinsEarned: (user?.totalCoinsEarned || 0) + reward.coins,
      xp: (user?.xp || 0) + reward.xp,
      tasksCompleted: (user?.tasksCompleted || 0) + 1,
      lastUpdated: now,
    },
  }
}

export function isTaskFromToday(task, now = new Date()) {
  if (!task?.createdAt) return true
  const created = task.createdAt.toDate?.() ?? new Date(task.createdAt)
  return (
    created.getDate() === now.getDate() &&
    created.getMonth() === now.getMonth() &&
    created.getFullYear() === now.getFullYear()
  )
}

