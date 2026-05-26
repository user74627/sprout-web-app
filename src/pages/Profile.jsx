import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePet, getPetState } from '../hooks/usePet'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import { resetDemoData } from '../demo/demoStore'
import Pet from '../components/Pet/Pet'

const STATE_LABEL = {
  thriving: { label: 'Thriving', color: 'text-sprout-600', bg: 'bg-sprout-50' },
  content:  { label: 'Content',  color: 'text-green-600',  bg: 'bg-green-50'  },
  droopy:   { label: 'Droopy',   color: 'text-yellow-600', bg: 'bg-yellow-50' },
  sad:      { label: 'Sad',      color: 'text-gray-500',   bg: 'bg-gray-100'  },
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
  const state    = getPetState(health)
  const petName  = petData?.petName ?? 'Pip'
  const stateInfo = STATE_LABEL[state]

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

  const stats = [
    { label: 'Tasks Completed', value: petData?.tasksCompleted ?? 0, icon: '✅' },
    { label: 'Coins Earned',    value: petData?.totalCoinsEarned ?? 0, icon: '🪙' },
    { label: 'Current Coins',   value: coins,  icon: '💰' },
    { label: 'Pet Health',      value: `${health}/100`, icon: '❤️' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sprout-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

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
          <p className="font-bold text-gray-900 truncate">{user?.displayName ?? 'Sprout User'}</p>
          <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          {memberSince && (
            <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
          )}
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
                className="flex-1 px-3 py-1.5 border border-sprout-300 rounded-xl text-sm font-bold
                           focus:ring-2 focus:ring-sprout-400 focus:border-transparent"
              />
              <button onClick={savePetName} className="text-sprout-600 font-semibold text-sm">Save</button>
              <button onClick={() => setEditingName(false)} className="text-gray-400 text-sm">✕</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 text-lg">{petName}</p>
              <button
                onClick={startEditName}
                className="text-xs text-gray-400 hover:text-gray-600"
                aria-label="Rename pet"
              >
                ✏️
              </button>
            </div>
          )}
          <span className={`badge mt-1 ${stateInfo.bg} ${stateInfo.color}`}>
            {stateInfo.label}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-4"
      >
        <h3 className="font-bold text-gray-800 mb-4">Your Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-3"
        >
          <button
            type="button"
            onClick={handleResetDemo}
            className="w-full card flex items-center justify-center gap-2 text-amber-700
                       hover:bg-amber-50 active:scale-[0.98] transition-all font-semibold"
          >
            ↺ Reset demo data
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full card flex items-center justify-center gap-2 text-rose-500
                     hover:bg-rose-50 active:scale-[0.98] transition-all font-semibold"
        >
          {signingOut
            ? <span className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
            : '↩ Sign Out'}
        </button>
      </motion.div>
    </div>
  )
}
