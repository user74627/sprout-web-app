import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprout, Zap, Flame } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { getRewardPreview } from '../core/rewards'
import { Button, Input } from '../components/ui'

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   Icon: Sprout, active: 'border-sprout-500 bg-sprout-50 text-sprout-700' },
  { id: 'medium', label: 'Medium', Icon: Zap,    active: 'border-medium-500 bg-medium-100 text-medium-700' },
  { id: 'hard',   label: 'Hard',   Icon: Flame,  active: 'border-hard-500 bg-hard-100 text-hard-700' },
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
        className="absolute inset-0 bg-soil-800/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-8 z-10 shadow-lg border border-soil-200/50"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <div className="w-10 h-1 bg-soil-200 rounded-full mx-auto mb-5" />

        <h3 className="text-lg font-semibold text-soil-800 mb-5">New Task</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="What do you need to do?"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Study for 30 minutes…"
            autoFocus
          />

          <div>
            <label className="block text-section-label mb-2 normal-case">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-150
                    focus-visible:ring-2 focus-visible:ring-sprout-400 ${
                    difficulty === d.id ? d.active : 'border-soil-200/60 bg-soil-50 text-soil-400'
                  }`}
                >
                  <d.Icon size={20} aria-hidden="true" />
                  <span className="text-xs font-semibold">{d.label}</span>
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
