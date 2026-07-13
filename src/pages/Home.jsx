import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Flame, Coins } from 'lucide-react'
import Pet from '../components/Pet/Pet'
import TaskCard from '../components/TaskCard/TaskCard'
import { usePet, getPetState } from '../hooks/usePet'
import { useTasks } from '../hooks/useTasks'
import AddTaskModal from './AddTaskModal'
import ProgressRing from '../components/ProgressRing/ProgressRing'
import { getLevelProgress, getPetLevel, XP_PER_LEVEL } from '../core/pet'
import {
  PageHeader, CoinPill, KpiCard, EmptyState, Toast, RewardToastContent,
  Button, Badge, ProgressBar,
} from '../components/ui'

const STATE_MSG = {
  thriving: 'is absolutely thriving!',
  content:  'is doing well.',
  droopy:   'needs some attention...',
  sad:      'is feeling very sad. Complete some tasks!',
}

const HEALTH_BAR_VARIANT = {
  thriving: 'thriving',
  content:  'health',
  droopy:   'droopy',
  sad:      'sad',
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
      <div className="skeleton h-80 w-full mb-5" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
      <div className="skeleton h-20 w-full" />
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
  const xpRemaining = XP_PER_LEVEL - xpProgress

  if (petLoading) return <HomeSkeleton />

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title="Hey there!"
        subtitle={`Let's check on ${petName}.`}
        action={<CoinPill amount={coins} />}
      />

      {/* Pet hero — elevated tier */}
      <section
        className="card-elevated mb-5 pet-hero"
        aria-label="Pet status"
      >
        <div className={`pet-glow pet-glow-${state}`} aria-hidden="true" />
        <div className="pet-ground-shadow" aria-hidden="true" />

        {state === 'thriving' && (
          <>
            <span className="pet-sparkle" style={{ top: '18%', right: '22%', animationDelay: '0s' }} aria-hidden="true" />
            <span className="pet-sparkle" style={{ top: '28%', left: '20%', animationDelay: '0.8s' }} aria-hidden="true" />
            <span className="pet-sparkle" style={{ top: '12%', left: '42%', animationDelay: '1.4s' }} aria-hidden="true" />
          </>
        )}

        <div className="relative mb-4 z-10">
          <Pet health={health} equippedItems={equipped} size={168} />
        </div>

        <div className="text-center w-full z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-soil-800">{petName}</h2>
            <Badge variant={state}>{state}</Badge>
          </div>
          <p className="text-sm text-soil-600">
            {petName} {STATE_MSG[state]}
          </p>
        </div>

        <div className="w-full mt-5 space-y-4 z-10">
          <div>
            <div className="flex justify-between text-section-label mb-1.5">
              <span>Health</span>
              <span className="tabular normal-case tracking-normal text-soil-600">{health}/100</span>
            </div>
            <ProgressBar value={health} max={100} variant={HEALTH_BAR_VARIANT[state]} />
          </div>
          <div>
            <div className="flex justify-between text-section-label mb-1.5">
              <span>Level {level}</span>
              <span className="tabular normal-case tracking-normal text-soil-400">{xpProgress}/{XP_PER_LEVEL} XP</span>
            </div>
            <ProgressBar value={xpProgress} max={XP_PER_LEVEL} variant="xp" size="sm" />
          </div>
        </div>
      </section>

      {/* KPI row */}
      <section className="grid grid-cols-3 gap-3 mb-5" aria-label="Daily stats">
        <KpiCard className="col-span-1 items-center text-center py-3">
          <ProgressRing value={dailyProgress} size={56} label={`${completedToday}/${dailyTotal}`} sublabel="today" />
        </KpiCard>
        <KpiCard
          title="Streak"
          value={streak}
          unit="days"
          tone="streak"
          trend={streak > 0 ? 'up' : undefined}
          trendValue={streak > 0 ? 'active' : undefined}
        />
        <KpiCard
          title="XP to level"
          value={xpRemaining}
          unit="xp"
          tone="xp"
        />
      </section>

      {/* Daily summary — flat tier */}
      <section className="card-flat mb-5" aria-label="Daily summary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-section-label mb-1">Today</p>
            <p className="text-lg font-semibold text-soil-800 tabular">{completedToday} of {todaysTasks.length}</p>
            <p className="text-xs text-soil-400/80 mt-0.5">tasks completed</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-soil-600">
            <span className="flex items-center gap-1.5">
              <Flame size={16} className="text-streak-500" aria-hidden="true" />
              <span className="tabular font-semibold">{streak}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Coins size={16} className="text-coin-500" aria-hidden="true" />
              <span className="tabular font-semibold">{coins}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Next best task */}
      {nextTask && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="next-task-highlight mb-5"
          aria-label="Next recommended task"
        >
          <p className="text-section-label text-sprout-700 mb-2">Next best task</p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-soil-800 truncate">{nextTask.title}</p>
              <p className="text-xs text-soil-400/80 mt-0.5">
                Complete to feed {petName}
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
        </motion.section>
      )}

      <Toast show={Boolean(lastReward)} tone="reward">
        {lastReward && (
          <RewardToastContent
            health={lastReward.health}
            coins={lastReward.coins}
            xp={lastReward.xp}
          />
        )}
      </Toast>

      {/* Task list */}
      <section aria-label="Today's tasks">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-soil-800">Today&apos;s Tasks</h3>
            {completedToday > 0 && (
              <p className="text-xs text-sprout-600 font-medium mt-0.5">{completedToday} completed today</p>
            )}
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={16} aria-hidden="true" /> Add
          </Button>
        </div>

        {tasksLoading ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
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
          <div className="card-flat divide-y divide-soil-200/30 p-0 overflow-hidden">
            <AnimatePresence>
              {incompleteTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  variant="row"
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} />
      )}
    </motion.div>
  )
}
