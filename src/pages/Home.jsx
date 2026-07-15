import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, CheckCircle2, Coins, Heart, Plus, Star } from 'lucide-react'
import { usePet, getPetState } from '../hooks/usePet'
import { useTasks } from '../hooks/useTasks'
import { getLevelProgress, getPetLevel, XP_PER_LEVEL } from '../core/pet'
import { getTaskReward } from '../core/rewards'
import AddTaskModal from './AddTaskModal'
import Habitat from '../components/Habitat/Habitat'
import GardenStatus from '../components/GardenStatus/GardenStatus'
import GardenProgress from '../components/GardenProgress/GardenProgress'
import RewardBurst from '../components/RewardBurst/RewardBurst'

const DIFFICULTY = {
  easy: { label: 'Easy', className: 'garden-difficulty-easy' },
  medium: { label: 'Medium', className: 'garden-difficulty-medium' },
  hard: { label: 'Hard', className: 'garden-difficulty-hard' },
}

function HomeSkeleton() {
  return (
    <div className="garden-page editorial-page">
      <div className="garden-v0-skeleton garden-v0-skeleton-title" />
      <div className="editorial-home-grid">
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
    <motion.div layout className="garden-task-row editorial-task-row">
      <button type="button" className="garden-complete-button" onClick={handleComplete} disabled={completing} aria-label={`Complete task: ${task.title}`}>
        <Check size={16} strokeWidth={2.6} aria-hidden="true" />
        <RewardBurst reward={reward} show={showReward} />
      </button>
      <div className="garden-task-copy">
        <strong>{task.title}</strong>
        <div className="garden-task-meta">
          <span className={`garden-difficulty ${difficulty.className}`}>{difficulty.label}</span>
          <span><Coins size={13} />{reward.coins}</span>
          <span><Star size={13} />{reward.xp} XP</span>
          <span><Heart size={13} />{reward.health} health</span>
        </div>
      </div>
    </motion.div>
  )
}

function RewardToast({ reward }) {
  return (
    <AnimatePresence>
      {reward && (
        <motion.div className="garden-reward-toast editorial-reward-toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>Task complete</span>
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
  const remaining = incompleteTasks.length
  const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  return (
    <motion.main className="garden-page editorial-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
      <header className="editorial-page-header">
        <div>
          <p>{dateLabel}</p>
          <h1>{petName}&apos;s garden</h1>
        </div>
        <div className="editorial-header-summary">
          <strong>{remaining}</strong>
          <span>{remaining === 1 ? 'task remaining' : 'tasks remaining'}</span>
        </div>
      </header>

      <div className="editorial-home-grid">
        <aside className="editorial-garden-column">
          <Habitat health={health} equippedItems={equippedItems} petName={petName} state={state} />
          <GardenStatus health={health} level={level} streak={streak} coins={coins} />
        </aside>

        <section className="editorial-workspace" aria-label="Today">
          <header className="editorial-today-header">
            <div>
              <p>Today</p>
              <h2>{completedToday} of {todaysTasks.length} complete</h2>
            </div>
            <GardenProgress completed={completedToday} total={todaysTasks.length} size={72} />
          </header>

          <div className="editorial-xp-row">
            <div><span>Level {level}</span><small>{xpProgress} / {XP_PER_LEVEL} XP</small></div>
            <div className="garden-xp-track" aria-label={`${xpProgress} of ${XP_PER_LEVEL} experience points`}>
              <motion.span initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 0.55 }} />
            </div>
          </div>

          <section className="editorial-next-section" aria-label="Next task">
            <div className="editorial-section-label">Next task</div>
            {nextTask ? (
              <div className="editorial-next-row">
                <div>
                  <h2>{nextTask.title}</h2>
                  <p>{DIFFICULTY[nextTask.difficulty]?.label ?? 'Medium'} · {getTaskReward(nextTask.difficulty).coins} coins · {getTaskReward(nextTask.difficulty).xp} XP</p>
                </div>
                <button type="button" onClick={() => completeTask(nextTask.id, nextTask.difficulty)}><Check size={17} /> Complete</button>
              </div>
            ) : (
              <div className="editorial-all-done">
                <CheckCircle2 size={21} aria-hidden="true" />
                <div><strong>All done for today</strong><p>Add another task when you are ready.</p></div>
              </div>
            )}
          </section>

          <section className="editorial-tasks-section" aria-label="Today's tasks">
            <div className="editorial-tasks-header">
              <h2>Tasks</h2>
              <button type="button" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add task</button>
            </div>
            {tasksLoading ? (
              <div className="garden-task-list"><div className="garden-v0-skeleton garden-v0-skeleton-row" /><div className="garden-v0-skeleton garden-v0-skeleton-row" /></div>
            ) : incompleteTasks.length > 0 ? (
              <div className="garden-task-list editorial-task-list">
                <AnimatePresence mode="popLayout">
                  {incompleteTasks.slice(0, 6).map((task) => <GardenTaskRow key={task.id} task={task} onComplete={completeTask} />)}
                </AnimatePresence>
              </div>
            ) : (
              <div className="editorial-empty-row">
                <span>No remaining tasks</span>
                <button type="button" onClick={() => setShowAddModal(true)}>Add one <ArrowRight size={16} /></button>
              </div>
            )}
          </section>
        </section>
      </div>

      <button type="button" className="garden-fab editorial-fab" onClick={() => setShowAddModal(true)} aria-label="Add task"><Plus size={22} /></button>
      <RewardToast reward={lastReward} />
      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </motion.main>
  )
}
