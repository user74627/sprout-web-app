import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '../components/TaskCard/TaskCard'
import { useTasks } from '../hooks/useTasks'
import AddTaskModal from './AddTaskModal'

const FILTERS = ['All', 'Active', 'Completed']

export default function TaskList() {
  const { tasks, loading, completeTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = tasks.filter((t) => {
    if (filter === 'Active')    return !t.completed
    if (filter === 'Completed') return t.completed
    return true
  })

  const activeCount    = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) =>  t.completed).length

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeCount} active · {completedCount} completed
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-4 text-sm flex items-center gap-1.5"
        >
          <span className="text-lg leading-none">+</span> Add
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-3 border-sprout-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <div className="text-4xl mb-3">
            {filter === 'Completed' ? '🎉' : '📋'}
          </div>
          <p className="font-semibold text-gray-700">
            {filter === 'Completed' ? 'No completed tasks yet.' : 'No tasks here.'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== 'Completed' && 'Tap + Add to get started.'}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                showDate
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}
