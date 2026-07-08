import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Pet from '../components/Pet/Pet'
import TaskCard from '../components/TaskCard/TaskCard'
import { usePet, getPetState } from '../hooks/usePet'
import { useTasks } from '../hooks/useTasks'
import AddTaskModal from './AddTaskModal'
import ProgressRing from '../components/ProgressRing/ProgressRing'
import { getLevelProgress, getPetLevel, XP_PER_LEVEL } from '../core/pet'
import { PageHeader, CoinPill, StatCard, EmptyState, Toast, Button } from '../components/ui'

const STATE_BG = {
  thriving: 'from-sprout-50 to-surface-canvas',
  content:  'from-sprout-50/70 to-surface-canvas',
  droopy:   'from-coin-100/50 to-surface-canvas',
  sad:      'from-cream-200 to-surface-canvas',
}
const STATE_MSG = {
  thriving: 'is absolutely thriving!',
  content:  'is doing well.',
  droopy:   'needs some attention...',
  sad:      'is feeling very sad. Complete some tasks!',
}
const STATE_CHIP = {
  thriving: 'bg-sprout-100 text-sprout-700',
  content:  'bg-sprout-100 text-sprout-700',
  droopy:   'bg-coin-100 text-coin-700',
  sad:      'bg-cream-200 text-ink-secondary',
}
const HEALTH_BAR_COLOR = {
  thriving: 'bg-sprout-500',
  content:  'bg-sprout-400',
  droopy:   'bg-coin-500',
  sad:      'bg-danger-500',
}

function HomeSkeleton() {
  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="skeleton h-7 w-36" />
          <div className="skeleton h-4 w-28" />
        </div>
        <div className="skeleton h-9 w-20 rounded-full" />
      </div>
      <div className="skeleton h-72 w-full mb-4 rounded-3xl" />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="skeleton h-24 rounded-3xl" />
        <div className="skeleton h-24 rounded-3xl" />
        <div className="skeleton h-24 rounded-3xl" />
      </div>
      <div className="skeleton h-20 w-full rounded-3xl" />
    </div>
  )
}

export default function Home() {
  const { petData, loading: petLoading } = usePet()
  const { tasks, todaysTasks, loading: tasksLoading, completeTask, deleteTask, lastReward } = useTasks()
  const [showAddModal, setShowAddModal] = useState(false)

  const health    = petData?.petHealth ?? 100
  const coins     = petData?.coins ?? 0
  const state     = getPetState(health)
  const petName   = petData?.petName ?? 'Pip'
  const equipped  = petData?.equippedItems ?? []
  const xp        = petData?.xp ?? 0
  const level     = petData?.level ?? getPetLevel(xp)
  const xpProgress = getLevelProgress(xp)
  const streak    = petData?.currentStreak ?? 0

  const incompleteTasks = todaysTasks.filter((t) => !t.completed)
  const completedToday  = todaysTasks.filter((t) => t.completed).length
  const dailyTotal = Math.max(1, todaysTasks.length)
  const dailyProgress = Math.round((completedToday / dailyTotal) * 100)
  const nextTask = incompleteTasks[0]

  if (petLoading) return <HomeSkeleton />

  return (
    <div className={`page bg-gradient-to-b ${STATE_BG[state]}`}>
      <PageHeader
        title="Hey there!"
        subtitle={`Let's check on ${petName}.`}
        action={<CoinPill amount={coins} />}
      />

      {/* Pet hero */}
      <motion.div
        className="card flex flex-col items-center py-8 mb-4 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Organic blob behind the pet keeps the hero on-brand */}
        <svg
          className="absolute top-4 left-1/2 -translate-x-1/2 opacity-60"
          width="220" height="200" viewBox="0 0 220 200" aria-hidden="true"
        >
          <path
            d="M110 8 C160 4 204 40 208 92 C212 144 176 186 118 192 C60 198 14 162 10 108 C6 54 60 12 110 8 Z"
            fill="#dcfce7"
          />
        </svg>

        <div className="relative">
          <Pet health={health} equippedItems={equipped} size={180} />
        </div>

        <div className="mt-4 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-card-heading text-xl">{petName}</h2>
            <span className={`badge ${STATE_CHIP[state]} capitalize`}>{state}</span>
          </div>
          <p className="text-caption text-ink-secondary mt-1">
            {petName} {STATE_MSG[state]}
          </p>
        </div>

        {/* Health bar */}
        <div className="w-full mt-5 px-2 relative">
          <div className="flex justify-between text-caption font-semibold text-ink-secondary mb-1.5">
            <span>Health</span>
            <span className="tabular">{health}/100</span>
          </div>
          <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${HEALTH_BAR_COLOR[state]}`}
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Level / XP bar */}
          <div className="flex justify-between text-caption font-semibold text-ink-secondary mb-1.5 mt-4">
            <span>Level {level}</span>
            <span className="tabular">{xpProgress}/{XP_PER_LEVEL} xp</span>
          </div>
          <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-xp-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((xpProgress / XP_PER_LEVEL) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Unified stat row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard>
          <ProgressRing value={dailyProgress} size={64} label={`${completedToday}/${dailyTotal}`} sublabel="today" />
        </StatCard>
        <StatCard value={streak} label="day streak" tone="streak" />
        <StatCard value={XP_PER_LEVEL - xpProgress} label="xp to level" tone="xp" />
      </div>

      {/* Next best task */}
      {nextTask && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-5 border-sprout-200 bg-sprout-50/60"
        >
          <p className="text-caption font-bold uppercase tracking-wider text-sprout-700 mb-1">Next best task</p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-card-heading truncate">{nextTask.title}</p>
              <p className="text-caption text-ink-muted mt-0.5">
                {tasks.length} total tasks · complete this to feed {petName}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => completeTask(nextTask.id, nextTask.difficulty)}
              className="flex-shrink-0"
            >
              Finish
            </Button>
          </div>
        </motion.div>
      )}

      {/* Reward toast */}
      <Toast show={Boolean(lastReward)} tone="reward">
        <span aria-hidden="true">🎉</span>
        {lastReward && (
          <span className="tabular">
            +{lastReward.health} HP · +{lastReward.coins} coins · +{lastReward.xp} XP!
          </span>
        )}
      </Toast>

      {/* Today's tasks */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-card-heading">Today's Tasks</h3>
          {completedToday > 0 && (
            <p className="text-caption text-sprout-600 font-medium">{completedToday} completed today!</p>
          )}
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <span className="text-lg leading-none" aria-hidden="true">+</span> Add Task
        </Button>
      </div>

      {tasksLoading ? (
        <div className="flex flex-col gap-3">
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      ) : incompleteTasks.length === 0 ? (
        <EmptyState
          title="All done for today!"
          message={`Add more tasks to keep ${petName} thriving.`}
          action={
            <Button size="sm" variant="secondary" onClick={() => setShowAddModal(true)}>
              Add a task
            </Button>
          }
        />
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
