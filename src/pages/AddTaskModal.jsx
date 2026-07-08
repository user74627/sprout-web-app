import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTasks } from '../hooks/useTasks'
import { getRewardPreview } from '../core/rewards'
import Button from '../components/ui/Button'

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   icon: '🌱', active: 'border-easy-600 bg-easy-100 text-easy-700' },
  { id: 'medium', label: 'Medium', icon: '⚡', active: 'border-coin-500 bg-coin-100 text-coin-700' },
  { id: 'hard',   label: 'Hard',   icon: '🔥', active: 'border-hard-600 bg-hard-100 text-hard-700' },
]

export default function AddTaskModal({ onClose }) {
  const { addTask } = useTasks()
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || saving) return
    setSaving(true)
    await addTask(title.trim(), difficulty)
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-md bg-surface-elevated rounded-t-4xl px-5 pt-5 pb-8 z-10 shadow-lift"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <div className="w-10 h-1 bg-line-strong rounded-full mx-auto mb-5" />

        <h3 className="text-title text-ink mb-5">New Task</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-label text-ink-secondary mb-1.5">
              What do you need to do?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Study for 30 minutes…"
              autoFocus
              className="input"
            />
          </div>

          <div>
            <label className="block text-label text-ink-secondary mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-150 ${
                    difficulty === d.id ? d.active : 'border-line-subtle bg-cream-50 text-ink-muted'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">{d.icon}</span>
                  <span className="text-caption font-bold">{d.label}</span>
                  <span className="text-[10px] opacity-75 tabular">{getRewardPreview(d.id)}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!title.trim()}
            loading={saving}
          >
            Add Task
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
