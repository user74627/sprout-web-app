import { motion } from 'framer-motion'
import { useState } from 'react'
import { getTaskReward } from '../../core/rewards'

const DIFFICULTY_STYLES = {
  easy:   { badge: 'badge-easy',   label: 'Easy',   rail: 'bg-easy-600' },
  medium: { badge: 'badge-medium', label: 'Medium', rail: 'bg-coin-500' },
  hard:   { badge: 'badge-hard',   label: 'Hard',   rail: 'bg-hard-600' },
}

export default function TaskCard({ task, onComplete, onDelete, showDate = false }) {
  const [deleting, setDeleting] = useState(false)
  const [completing, setCompleting] = useState(false)

  const diff = DIFFICULTY_STYLES[task.difficulty] ?? DIFFICULTY_STYLES.medium
  const reward = getTaskReward(task.difficulty)

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
      className={`card relative overflow-hidden flex items-start gap-3 pl-6 transition-opacity
        ${task.completed ? 'opacity-60 bg-cream-100' : ''}`}
    >
      {/* Difficulty rail */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.completed ? 'bg-line-strong' : diff.rail}`}
      />

      {/* Checkbox */}
      <button
        onClick={handleComplete}
        disabled={task.completed || completing}
        aria-label="Complete task"
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${task.completed
            ? 'bg-sprout-500 border-sprout-500 text-white'
            : 'border-line-strong hover:border-sprout-400'
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
        <p className={`text-body font-medium leading-snug ${task.completed ? 'line-through text-ink-muted' : 'text-ink'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={diff.badge}>{diff.label}</span>
          {!task.completed && (
            <span className="chip-reward">
              +{reward.health}hp · +{reward.coins} coins · +{reward.xp}xp
            </span>
          )}
          {showDate && dateStr && (
            <span className="text-caption text-ink-muted">{dateStr}</span>
          )}
        </div>
      </div>

      {/* Delete */}
      {!task.completed && (
        <button
          onClick={handleDelete}
          aria-label="Delete task"
          className="flex-shrink-0 text-ink-muted/50 hover:text-danger-500 transition-colors p-1 -mr-1 rounded-lg"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
      )}
    </motion.div>
  )
}
