import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const DIFFICULTY_STYLES = {
  easy:   { badge: 'badge-easy',   label: 'Easy',   icon: '🌱' },
  medium: { badge: 'badge-medium', label: 'Medium', icon: '⚡' },
  hard:   { badge: 'badge-hard',   label: 'Hard',   icon: '🔥' },
}

const REWARDS = {
  easy:   { health: 10, coins: 5  },
  medium: { health: 20, coins: 15 },
  hard:   { health: 35, coins: 30 },
}

export default function TaskCard({ task, onComplete, onDelete, showDate = false }) {
  const [deleting, setDeleting] = useState(false)
  const [completing, setCompleting] = useState(false)

  const diff = DIFFICULTY_STYLES[task.difficulty] ?? DIFFICULTY_STYLES.medium
  const reward = REWARDS[task.difficulty] ?? REWARDS.medium

  async function handleComplete() {
    if (task.completed || completing) return
    setCompleting(true)
    await onComplete(task.id, task.difficulty)
    setCompleting(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await onDelete(task.id)
  }

  const createdDate = task.createdAt?.toDate?.()
  const dateStr = createdDate
    ? createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: deleting ? 0 : 1, y: 0, scale: deleting ? 0.96 : 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`card flex items-start gap-3 transition-opacity ${task.completed ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        disabled={task.completed || completing}
        aria-label="Complete task"
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${task.completed
            ? 'bg-sprout-500 border-sprout-500 text-white'
            : 'border-gray-300 hover:border-sprout-400'
          } ${completing ? 'animate-pulse' : ''}`}
      >
        {task.completed && (
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,6 5,9 10,3" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium leading-snug ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={diff.badge}>
            {diff.icon} {diff.label}
          </span>
          {!task.completed && (
            <span className="text-xs text-coin-600 font-semibold">
              +{reward.health}hp · +{reward.coins} coins
            </span>
          )}
          {showDate && dateStr && (
            <span className="text-xs text-gray-400">{dateStr}</span>
          )}
        </div>
      </div>

      {/* Delete */}
      {!task.completed && (
        <button
          onClick={handleDelete}
          aria-label="Delete task"
          className="flex-shrink-0 text-gray-300 hover:text-rose-400 transition-colors p-1 -mr-1 rounded-lg"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
      )}
    </motion.div>
  )
}
