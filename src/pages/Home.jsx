import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Coins, Heart, Leaf, Plus, Sparkles, Star } from 'lucide-react'
import { usePet, getPetState } from '../hooks/usePet'
import { useTasks } from '../hooks/useTasks'
import { getLevelProgress, getPetLevel, XP_PER_LEVEL } from '../core/pet'
import { getTaskReward } from '../core/rewards'
import AddTaskModal from './AddTaskModal'
import Habitat from '../components/Habitat/Habitat'
import GardenStatus from '../components/GardenStatus/GardenStatus'
import GardenProgress from '../components/GardenProgress/GardenProgress'
import RewardBurst from '../components/RewardBurst/RewardBurst'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'

const DIFFICULTY = {
  easy: { label: 'Easy', className: 'garden-difficulty-easy' },
  medium: { label: 'Medium', className: 'garden-difficulty-medium' },
  hard: { label: 'Hard', className: 'garden-difficulty-hard' },
}

function HomeSkeleton() {
  return (
    <div className="garden-page">
      <div className="garden-v0-skeleton garden-v0-skeleton-title" />
      <div className="garden-dashboard-grid">
        <div className="garden-v0-skeleton garden-v0-skeleton-habitat" />
        <div className="garden-v0-skeleton garden-v0-skeleton-panel" />
      </div>
    </div>
  )
}

function GardenTaskRow({ task, onComplete }) {
  const [showReward, setShowReward] = useState(false)
  const [completing, setCompleting] = useState(false)
  const reward = getTaskReward(task.difficulty)
  const difficulty = DIFFICULTY[task.difficulty] ?? DIFFICULTY.medium

  async function handleComplete() {
    if (completing) return
    setCompleting(true)
    setShowReward(true)
    await onComplete(task.id, task.difficulty)
    setTimeout(() => setShowReward(false), 1050)
    setCompleting(false)
  }

  return (
    <motion.div layout className="garden-task-row">
      <button type="button" className="garden-complete-button" onClick={handleComplete} disabled={completing} aria-label={`Complete task: ${task.title}`}>
        <Check size={17} strokeWidth={3} aria-hidden="true" />
        <RewardBurst reward={reward} show={showReward} />
      </button>
      <div className="garden-task-copy">
        <strong>{task.title}</strong>
        <div className="garden-task-meta">
          <span className={`garden-difficulty ${difficulty.className}`}>{difficulty.label}</span>
          <span><Coins size={12} />+{reward.coins}</span>
          <span><Star size={12} />+{reward.xp}</span>
          <span><Heart size={12} />+{reward.health}</span>
        </div>
      </div>
    </motion.div>
  )
}

function RewardToast({ reward }) {
  return (
    <AnimatePresence>
      {reward && (
        <motion.div className="garden-reward-toast" role="status" initial={{ opacity: 0, y: 18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }} transition={{ type: 'spring', stiffness: 360, damping: 25 }}>
          <Sparkles size={18} aria-hidden="true" />
          <span>Garden nourished</span>
          <strong>+{reward.coins} coins · +{reward.xp} XP</strong>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Home() {
  const { petData, loading: petLoading } = usePet()
  const { todaysTasks, loading: tasksLoading, completeTask, lastReward } = useTasks()
  const [showAddModal, setShowAddModal] = useState(false)

  if (petLoading) return <HomeSkeleton />

  const health = petData?.petHealth ?? 100
  const coins = petData?.coins ?? 0
  const petName = petData?.petName ?? 'Pip'
  const equippedItems = petData?.equippedItems ?? []
  const xp = petData?.xp ?? 0
  const level = petData?.level ?? getPetLevel(xp)
  const streak = petData?.currentStreak ?? 0
  const state = getPetState(health)
  const xpProgress = getLevelProgress(xp)
  const incompleteTasks = todaysTasks.filter((task) => !task.completed)
  const completedToday = todaysTasks.filter((task) => task.completed).length
  const nextTask = incompleteTasks[0]

  return (
    <motion.main className="garden-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
      <header className="garden-page-header">
        <div>
          <span className="garden-eyebrow"><Leaf size={13} aria-hidden="true" /> Your living routine</span>
          <h1>{petName}&apos;s Garden</h1>
          <p>One small win at a time. Your companion is growing with you.</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="garden-dashboard-grid">
        <div className="garden-hero-column">
          <Habitat health={health} equippedItems={equippedItems} petName={petName} state={state} />
          <GardenStatus health={health} level={level} streak={streak} coins={coins} />
        </div>

        <div className="garden-focus-column">
          <section className="garden-daily-card">
            <div className="garden-daily-topline">
              <GardenProgress completed={completedToday} total={todaysTasks.length} />
              <div className="garden-daily-copy">
                <span className="garden-eyebrow">Today&apos;s rhythm</span>
                <h2>{completedToday === todaysTasks.length && todaysTasks.length > 0 ? 'A perfect little day' : 'Keep the garden moving'}</h2>
                <p>{completedToday} of {todaysTasks.length} tasks complete</p>
              </div>
            </div>
            <div className="garden-xp-block">
              <div><span>Level {level}</span><small>{xpProgress}/{XP_PER_LEVEL} XP</small></div>
              <div className="garden-xp-track" aria-label={`${xpProgress} of ${XP_PER_LEVEL} experience points`}>
                <motion.span initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </section>

          {nextTask ? (
            <section className="garden-next-task" aria-label="Next recommended task">
              <div className="garden-next-task-heading">
                <span><Sparkles size={15} /> Next best task</span>
                <span className="garden-reward-pill"><Coins size={13} /> +{getTaskReward(nextTask.difficulty).coins}</span>
              </div>
              <h2>{nextTask.title}</h2>
              <p>Finish this to nurture {petName} and keep your momentum alive.</p>
              <button type="button" onClick={() => completeTask(nextTask.id, nextTask.difficulty)}><Check size={18} strokeWidth={3} /> Complete &amp; nurture</button>
            </section>
          ) : (
            <section className="garden-next-task garden-next-task-done">
              <Leaf size={24} aria-hidden="true" />
              <div><h2>Everything is tended</h2><p>{petName} is enjoying the calm. Add another task whenever you&apos;re ready.</p></div>
            </section>
          )}

          <section className="garden-tasks-section" aria-label="Today's tasks">
            <div className="garden-section-header">
              <div><span className="garden-eyebrow">Your next steps</span><h2>Today&apos;s tasks</h2></div>
              <button type="button" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add task</button>
            </div>
            {tasksLoading ? (
              <div className="garden-task-list"><div className="garden-v0-skeleton garden-v0-skeleton-row" /><div className="garden-v0-skeleton garden-v0-skeleton-row" /></div>
            ) : incompleteTasks.length > 0 ? (
              <div className="garden-task-list">
                <AnimatePresence mode="popLayout">
                  {incompleteTasks.slice(0, 5).map((task) => <GardenTaskRow key={task.id} task={task} onComplete={completeTask} />)}
                </AnimatePresence>
              </div>
            ) : (
              <div className="garden-empty-tasks">
                <span><Leaf size={22} /></span>
                <div><strong>All clear for today</strong><p>Add a new task to plant your next intention.</p></div>
                <button type="button" onClick={() => setShowAddModal(true)}><ArrowRight size={17} /></button>
              </div>
            )}
          </section>
        </div>
      </div>

      <button type="button" className="garden-fab" onClick={() => setShowAddModal(true)} aria-label="Add task"><Plus size={22} /></button>
      <RewardToast reward={lastReward} />
      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </motion.main>
  )
}
