import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Pet from '../components/Pet/Pet'
import TaskCard from '../components/TaskCard/TaskCard'
import { usePet, getPetState } from '../hooks/usePet'
import { useTasks } from '../hooks/useTasks'
import AddTaskModal from './AddTaskModal'

const STATE_EMOJI = { thriving: '✨', content: '😊', droopy: '😕', sad: '😢' }
const STATE_BG    = {
  thriving: 'from-sprout-50 to-green-50',
  content:  'from-green-50 to-emerald-50',
  droopy:   'from-yellow-50 to-amber-50',
  sad:      'from-gray-100 to-slate-100',
}
const STATE_MSG = {
  thriving: 'Pip is absolutely thriving!',
  content:  'Pip is doing well.',
  droopy:   'Pip needs some attention...',
  sad:      'Pip is feeling very sad. Complete some tasks!',
}
const HEALTH_BAR_COLOR = {
  thriving: 'bg-sprout-500',
  content:  'bg-green-400',
  droopy:   'bg-amber-400',
  sad:      'bg-rose-400',
}

export default function Home() {
  const { petData, loading: petLoading } = usePet()
  const { todaysTasks, loading: tasksLoading, completeTask, deleteTask, lastReward } = useTasks()
  const [showAddModal, setShowAddModal] = useState(false)

  const health    = petData?.petHealth ?? 100
  const coins     = petData?.coins ?? 0
  const state     = getPetState(health)
  const petName   = petData?.petName ?? 'Pip'
  const equipped  = petData?.equippedItems ?? []

  const incompleteTasks = todaysTasks.filter((t) => !t.completed)
  const completedToday  = todaysTasks.filter((t) => t.completed).length

  if (petLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sprout-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className={`page bg-gradient-to-b ${STATE_BG[state]} min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hey there! 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Let's check on {petName}.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-card">
          <span className="text-lg">🪙</span>
          <span className="font-bold text-coin-600 text-lg">{coins}</span>
        </div>
      </div>

      {/* Pet display */}
      <motion.div
        className="card flex flex-col items-center py-8 mb-5 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Pet health={health} equippedItems={equipped} size={180} />

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl">{STATE_EMOJI[state]}</span>
            <h2 className="text-xl font-bold text-gray-900">{petName}</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">{STATE_MSG[state]}</p>
        </div>

        {/* Health bar */}
        <div className="w-full mt-5 px-2">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
            <span>Health</span>
            <span>{health}/100</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${HEALTH_BAR_COLOR[state]}`}
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Reward toast */}
      <AnimatePresence>
        {lastReward && (
          <motion.div
            key="reward"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-sprout-500 text-white
                       px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-semibold text-sm"
          >
            <span>🎉</span>
            <span>+{lastReward.health} HP · +{lastReward.coins} coins!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's tasks */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800">Today's Tasks</h3>
          {completedToday > 0 && (
            <p className="text-xs text-sprout-600 font-medium">{completedToday} completed today!</p>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5"
        >
          <span className="text-lg leading-none">+</span> Add Task
        </button>
      </div>

      {tasksLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-sprout-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : incompleteTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-10"
        >
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-semibold text-gray-700">All done for today!</p>
          <p className="text-sm text-gray-400 mt-1">Add more tasks to keep {petName} thriving.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {incompleteTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
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
