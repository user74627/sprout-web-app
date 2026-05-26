import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTasks } from '../hooks/useTasks'

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   icon: '🌱', desc: '+10 HP, +5 coins',  color: 'border-blue-300 bg-blue-50 text-blue-700'   },
  { id: 'medium', label: 'Medium', icon: '⚡', desc: '+20 HP, +15 coins', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { id: 'hard',   label: 'Hard',   icon: '🔥', desc: '+35 HP, +30 coins', color: 'border-rose-300 bg-rose-50 text-rose-700'   },
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-md bg-white rounded-t-4xl px-5 pt-5 pb-8 z-10 shadow-2xl"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <h3 className="text-xl font-bold text-gray-900 mb-5">New Task</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What do you need to do?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Study for 30 minutes…"
              autoFocus
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm
                         focus:ring-2 focus:ring-sprout-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-150 ${
                    difficulty === d.id ? d.color : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="text-xl">{d.icon}</span>
                  <span className="text-xs font-bold">{d.label}</span>
                  <span className="text-[10px] opacity-75">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || saving}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${
              !title.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : '+ Add Task'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
