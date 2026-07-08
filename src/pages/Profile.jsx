import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePet, getPetState } from '../hooks/usePet'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import { resetDemoData } from '../demo/demoStore'
import Pet from '../components/Pet/Pet'
import { getLevelProgress, getPetLevel } from '../core/pet'
import { PageHeader, StatCard, Button } from '../components/ui'

const STATE_LABEL = {
  thriving: { label: 'Thriving', color: 'text-sprout-600', bg: 'bg-sprout-50' },
  content:  { label: 'Content',  color: 'text-xp-600',     bg: 'bg-xp-100'    },
  droopy:   { label: 'Droopy',   color: 'text-streak-500', bg: 'bg-streak-100' },
  sad:      { label: 'Sad',      color: 'text-ink-muted',  bg: 'bg-cream-200'  },
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function WeeklyActivity({ tasksCompleted = 0 }) {
  const today = new Date().getDay()
  const mondayOffset = today === 0 ? 6 : today - 1
  const bars = DAY_LABELS.map((label, i) => {
    const isToday = i === mondayOffset
    const height = isToday
      ? Math.min(100, 30 + (tasksCompleted % 5) * 14)
      : Math.max(12, 20 + ((i * 17 + tasksCompleted) % 60))
    return { label, height, isToday }
  })

  return (
    <div className="card mb-4">
      <h3 className="text-card-heading mb-4">This week</h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {bars.map(({ label, height, isToday }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-lg transition-all ${
                isToday ? 'bg-sprout-500' : 'bg-cream-300'
              }`}
              style={{ height: `${height}%` }}
              aria-hidden="true"
            />
            <span className={`text-[10px] font-semibold ${isToday ? 'text-sprout-600' : 'text-ink-muted'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-caption text-ink-muted text-center mt-3">
        {tasksCompleted > 0
          ? `${tasksCompleted} task${tasksCompleted === 1 ? '' : 's'} completed all time`
          : 'Complete tasks to fill your week'}
      </p>
    </div>
  )
}

export default function Profile() {
  const { user, leaveDemo } = useAuth()
  const { petData, loading, updatePetName } = usePet()
  const [editingName, setEditingName] = useState(false)
  const [petNameInput, setPetNameInput] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const health   = petData?.petHealth ?? 100
  const coins    = petData?.coins ?? 0
  const equipped = petData?.equippedItems ?? []
  const xp       = petData?.xp ?? 0
  const level    = petData?.level ?? getPetLevel(xp)
  const state    = getPetState(health)
  const petName  = petData?.petName ?? 'Pip'
  const stateInfo = STATE_LABEL[state]
  const tasksCompleted = petData?.tasksCompleted ?? 0
  const streak = petData?.currentStreak ?? 0

  async function handleSignOut() {
    setSigningOut(true)
    try {
      if (isDemoMode) {
        leaveDemo()
      } else {
        const { signOutUser } = await import('../firebase/auth')
        await signOutUser()
      }
    } finally {
      setSigningOut(false)
    }
  }

  function handleResetDemo() {
    resetDemoData()
    window.location.reload()
  }

  async function savePetName() {
    const trimmed = petNameInput.trim()
    if (trimmed && trimmed !== petName) await updatePetName(trimmed)
    setEditingName(false)
  }

  function startEditName() {
    setPetNameInput(petName)
    setEditingName(true)
  }

  const createdDate = petData?.createdAt?.toDate?.()
  const memberSince = createdDate
    ? createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton h-8 w-40 mb-6" />
        <div className="skeleton h-24 w-full mb-4" />
        <div className="skeleton h-32 w-full mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <PageHeader
        title="Progress"
        subtitle={memberSince ? `Member since ${memberSince}` : 'Your journey with Pip'}
      />

      {/* User card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center gap-4 mb-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-sprout-100 flex items-center justify-center
                        text-2xl font-bold text-sprout-700 flex-shrink-0">
          {(user?.displayName ?? 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-card-heading truncate">{user?.displayName ?? 'Sprout User'}</p>
          <p className="text-caption text-ink-muted truncate">{user?.email}</p>
        </div>
      </motion.div>

      {/* Pet card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card flex items-center gap-4 mb-4"
      >
        <Pet health={health} equippedItems={equipped} size={70} />
        <div className="flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={petNameInput}
                onChange={(e) => setPetNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && savePetName()}
                autoFocus
                maxLength={20}
                className="input flex-1 py-1.5 text-label font-bold"
              />
              <Button size="sm" variant="ghost" onClick={savePetName}>Save</Button>
              <button type="button" onClick={() => setEditingName(false)} className="text-ink-muted text-sm">×</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-title text-lg">{petName}</p>
              <button
                type="button"
                onClick={startEditName}
                className="text-caption text-ink-muted hover:text-ink-secondary"
                aria-label="Rename pet"
              >
                Edit
              </button>
            </div>
          )}
          <span className={`badge mt-1 ${stateInfo.bg} ${stateInfo.color}`}>
            {stateInfo.label}
          </span>
        </div>
      </motion.div>

      <WeeklyActivity tasksCompleted={tasksCompleted} />

      {/* Key stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 mb-4"
      >
        <StatCard value={level} label="Level" tone="sprout" />
        <StatCard value={`${getLevelProgress(xp)}/100`} label="XP to next" tone="xp" />
        <StatCard value={tasksCompleted} label="Tasks done" />
        <StatCard value={streak} label="Day streak" tone="streak" />
        <StatCard value={petData?.totalCoinsEarned ?? 0} label="Coins earned" tone="coin" />
        <StatCard value={coins} label="Coins now" tone="coin" />
        <StatCard value={`${health}/100`} label="Pet health" tone="sprout" />
        <StatCard value={petData?.coinsSpent ?? 0} label="Coins spent" />
      </motion.div>

      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-3"
        >
          <Button variant="secondary" className="w-full" onClick={handleResetDemo}>
            Reset demo data
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Button variant="danger" className="w-full" onClick={handleSignOut} loading={signingOut}>
          Sign out
        </Button>
      </motion.div>
    </div>
  )
}
