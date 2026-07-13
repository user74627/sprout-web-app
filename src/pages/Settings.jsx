import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, RotateCcw, Pencil } from 'lucide-react'
import { usePet, getPetState } from '../hooks/usePet'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import { resetDemoData } from '../demo/demoStore'
import Pet from '../components/Pet/Pet'
import { getLevelProgress, getPetLevel } from '../core/pet'
import { PageHeader, KpiCard, Button, Badge, Input } from '../components/ui'

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
    <section className="card-flat mb-5" aria-label="Weekly activity">
      <h3 className="text-lg font-semibold text-soil-800 mb-4">This week</h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {bars.map(({ label, height, isToday }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-md transition-all duration-300 ${
                isToday ? 'bg-sprout-400' : 'bg-soil-200/70'
              }`}
              style={{ height: `${height}%` }}
              aria-hidden="true"
            />
            <span className={`text-[10px] font-semibold ${isToday ? 'text-sprout-600' : 'text-soil-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-soil-400/70 text-center mt-3">
        {tasksCompleted > 0
          ? `${tasksCompleted} task${tasksCompleted === 1 ? '' : 's'} completed all time`
          : 'Complete tasks to fill your week'}
      </p>
    </section>
  )
}

export default function Settings() {
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
        <div className="skeleton h-8 w-44 mb-6" />
        <div className="skeleton h-24 w-full mb-4" />
        <div className="skeleton h-32 w-full mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title="Settings"
        subtitle={memberSince ? `Member since ${memberSince}` : 'Your account'}
      />

      <section className="card-elevated mb-5 text-center py-5" aria-label="Progress summary">
        <p className="text-section-label mb-2">Tasks completed</p>
        <p className="text-4xl font-bold text-soil-800 tabular leading-none">{tasksCompleted}</p>
        <p className="text-sm text-soil-600 mt-2">
          Level {level} · {streak} day streak
        </p>
      </section>

      <WeeklyActivity tasksCompleted={tasksCompleted} />

      <section className="grid grid-cols-2 gap-3 mb-5" aria-label="Stats">
        <KpiCard title="Level" value={level} tone="sprout" />
        <KpiCard title="XP to next" value={getLevelProgress(xp)} unit="/100" tone="xp" />
        <KpiCard title="Day streak" value={streak} unit="days" tone="streak" trend={streak > 0 ? 'up' : undefined} trendValue={streak > 0 ? 'active' : undefined} />
        <KpiCard title="Coins" value={coins} tone="coin" />
      </section>

      <section className="card-flat mb-4">
        <h3 className="text-lg font-semibold text-soil-800 mb-4">Pet</h3>
        <div className="flex items-center gap-4">
          <Pet health={health} equippedItems={equipped} size={64} />
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={petNameInput}
                  onChange={(e) => setPetNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && savePetName()}
                  autoFocus
                  maxLength={20}
                  className="py-1.5 text-sm font-semibold"
                />
                <Button size="sm" variant="ghost" onClick={savePetName}>Save</Button>
                <button type="button" onClick={() => setEditingName(false)} className="text-soil-400 text-sm">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-soil-800">{petName}</p>
                <button
                  type="button"
                  onClick={startEditName}
                  className="text-soil-400 hover:text-soil-600 p-1 transition-colors duration-150
                             focus-visible:ring-2 focus-visible:ring-sprout-400 rounded"
                  aria-label="Rename pet"
                >
                  <Pencil size={14} aria-hidden="true" />
                </button>
              </div>
            )}
            <Badge variant={state} className="mt-1.5">{state}</Badge>
          </div>
        </div>
      </section>

      <section className="card-flat mb-4">
        <h3 className="text-lg font-semibold text-soil-800 mb-4">Account</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-sprout-100 flex items-center justify-center font-bold text-sprout-700 text-lg">
            {(user?.displayName ?? 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-soil-800 truncate">{user?.displayName ?? 'Sprout User'}</p>
            <p className="text-xs text-soil-400/80 truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="secondary" className="w-full" onClick={handleSignOut} loading={signingOut}>
          <LogOut size={16} aria-hidden="true" /> Sign out
        </Button>
      </section>

      {isDemoMode && (
        <Button variant="secondary" className="w-full" onClick={handleResetDemo}>
          <RotateCcw size={16} aria-hidden="true" /> Reset demo data
        </Button>
      )}
    </motion.div>
  )
}
