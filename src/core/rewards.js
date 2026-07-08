export const TASK_REWARDS = {
  easy: {
    health: 10,
    coins: 5,
    xp: 8,
  },
  medium: {
    health: 20,
    coins: 15,
    xp: 18,
  },
  hard: {
    health: 35,
    coins: 30,
    xp: 35,
  },
}

export function getTaskReward(difficulty = 'medium') {
  return TASK_REWARDS[difficulty] || TASK_REWARDS.medium
}

export function getRewardPreview(difficulty = 'medium') {
  const reward = getTaskReward(difficulty)
  return `+${reward.health}hp · +${reward.coins} coins · +${reward.xp}xp`
}

