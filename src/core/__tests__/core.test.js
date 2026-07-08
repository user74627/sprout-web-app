import { describe, expect, it } from 'vitest'
import { getTaskReward } from '../rewards'
import { applyHealthDecay, getPetLevel, getPetState } from '../pet'
import { completeTaskState } from '../tasks'
import { purchaseItemState, toggleEquippedItem } from '../shop'

describe('reward rules', () => {
  it('returns hard rewards with health, coins, and xp', () => {
    expect(getTaskReward('hard')).toEqual({ health: 35, coins: 30, xp: 35 })
  })

  it('falls back to medium rewards', () => {
    expect(getTaskReward('unknown')).toEqual({ health: 20, coins: 15, xp: 18 })
  })
})

describe('pet rules', () => {
  it('maps health to visible pet state', () => {
    expect(getPetState(80)).toBe('thriving')
    expect(getPetState(50)).toBe('content')
    expect(getPetState(25)).toBe('droopy')
    expect(getPetState(5)).toBe('sad')
  })

  it('decays health by elapsed hours', () => {
    const now = 10 * 3_600_000
    const result = applyHealthDecay({ petHealth: 50, lastUpdated: 8 * 3_600_000 }, now)
    expect(result.decay).toBe(6)
    expect(result.user.petHealth).toBe(44)
  })

  it('calculates pet level from xp', () => {
    expect(getPetLevel(0)).toBe(1)
    expect(getPetLevel(100)).toBe(2)
    expect(getPetLevel(250)).toBe(3)
  })
})

describe('task completion rules', () => {
  it('grants reward and marks task complete once', () => {
    const result = completeTaskState({
      task: { id: 't1', difficulty: 'easy', completed: false },
      user: { petHealth: 90, coins: 0, xp: 0, totalCoinsEarned: 0, tasksCompleted: 0 },
      now: 123,
    })

    expect(result.alreadyCompleted).toBe(false)
    expect(result.task.completed).toBe(true)
    expect(result.user.petHealth).toBe(100)
    expect(result.user.coins).toBe(5)
    expect(result.user.xp).toBe(8)
  })

  it('does not mutate already completed tasks', () => {
    const result = completeTaskState({
      task: { id: 't1', difficulty: 'easy', completed: true },
      user: { coins: 0 },
    })

    expect(result.alreadyCompleted).toBe(true)
    expect(result.user.coins).toBe(0)
  })
})

describe('shop rules', () => {
  it('purchases an item when affordable', () => {
    const result = purchaseItemState({
      user: { coins: 100, coinsSpent: 0 },
      inventory: [],
      item: { id: 'hat', price: 75 },
    })

    expect(result.user.coins).toBe(25)
    expect(result.user.coinsSpent).toBe(75)
    expect(result.inventory).toEqual(['hat'])
  })

  it('rejects duplicates and insufficient coins', () => {
    expect(() => purchaseItemState({
      user: { coins: 100 },
      inventory: ['hat'],
      item: { id: 'hat', price: 75 },
    })).toThrow('Already owned')

    expect(() => purchaseItemState({
      user: { coins: 10 },
      inventory: [],
      item: { id: 'hat', price: 75 },
    })).toThrow('Not enough coins')
  })

  it('toggles equipped items', () => {
    expect(toggleEquippedItem([], 'hat')).toEqual(['hat'])
    expect(toggleEquippedItem(['hat'], 'hat')).toEqual([])
  })
})

