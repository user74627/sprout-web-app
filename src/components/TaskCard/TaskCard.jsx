import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { getTaskReward } from '../../core/rewards'
import { Badge } from '../ui'

const DIFFICULTY_STYLES = {
  easy:   { variant: 'easy',   label: 'Easy',   rail: 'bg-sprout-500' },
  medium: { variant: 'medium', label: 'Medium', rail: 'bg-medium-500' },
  hard:   { variant: 'hard',   label: 'Hard',   rail: 'bg-hard-500' },
}

function CompleteButton({ completed, completing, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={completed || completing}
      aria-label="Complete task"
      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sprout-400 focus-visible:ring-offset-1
        ${completed
          ? 'bg-sprout-500 border-sprout-500 text-white'
          : 'border-soil-200 hover:border-sprout-400 hover:bg-sprout-50'
        }`}
    >
      <AnimatePresence>
        {completed && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 16, stiffness: 400, duration: 0.3 }}
          >
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function TaskCard({ task, onComplete, onDelete, showDate = false, variant = 'card' }) {
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

  const isRow = variant === 'row'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: isRow ? 4 : 8 }}
      animate={{ opacity: deleting ? 0 : 1, y: 0, scale: deleting ? 0.98 : 1 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className={
        isRow
          ? `list-row list-row-interactive relative overflow-hidden
             ${task.completed ? 'opacity-50 bg-soil-50/40' : 'bg-white/60'}`
          : `card card-interactive relative overflow-hidden flex items-start gap-3 pl-5
             ${task.completed ? 'opacity-50 bg-soil-50/40' : ''}`
      }
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${task.completed ? 'bg-soil-200' : diff.rail}`}
      />

      <CompleteButton
        completed={task.completed}
        completing={completing}
        onClick={handleComplete}
      />

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${task.completed ? 'line-through text-soil-400' : 'font-medium text-soil-800'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant={diff.variant}>{diff.label}</Badge>
          {!task.completed && (
            <span className="chip-reward">
              +{reward.health} HP · +{reward.coins} 🪙 · +{reward.xp} XP
            </span>
          )}
          {showDate && dateStr && (
            <span className="text-xs text-soil-400/70">{dateStr}</span>
          )}
        </div>
      </div>

      {!task.completed && (
        <button
          onClick={handleDelete}
          aria-label="Delete task"
          className="flex-shrink-0 text-soil-400 hover:text-danger-500 transition-colors duration-150 p-1 rounded-lg
                     focus-visible:ring-2 focus-visible:ring-sprout-400"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      )}
    </motion.div>
  )
}
