import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import { SegmentedControl, Button } from '../components/ui'

const DEMO_STEPS = [
  { icon: '✅', title: 'Complete tasks', desc: 'Check off to-dos and earn health, coins, and XP.' },
  { icon: '🌱', title: 'Grow your pet', desc: 'Pip thrives when you stay consistent.' },
  { icon: '🛍️', title: 'Shop & equip', desc: 'Spend coins on accessories for your sprout.' },
]

export default function Auth() {
  const { enterDemo } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    if (mode === 'signup' && !form.name.trim()) return setError('Please enter your name.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      const { signUpWithEmail, signInWithEmail } = await import('../firebase/auth')
      if (mode === 'signup') {
        await signUpWithEmail(form.email.trim(), form.password, form.name.trim())
      } else {
        await signInWithEmail(form.email.trim(), form.password)
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? 'Incorrect email or password.'
        : err.code === 'auth/email-already-in-use'
        ? 'This email is already registered.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address.'
        : 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const BrandHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center mb-8"
    >
      <div className="w-20 h-20 bg-sprout-500 rounded-3xl flex items-center justify-center mb-4 shadow-soft">
        <span className="text-4xl" aria-hidden="true">🌱</span>
      </div>
      <h1 className="text-display text-ink">Sprout</h1>
      <p className="text-caption text-ink-secondary mt-1 text-center max-w-xs">
        Grow your goals, one task at a time.
      </p>
    </motion.div>
  )

  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center px-6 py-12">
        <BrandHeader />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full card shadow-soft"
        >
          <p className="text-body text-ink-secondary text-center mb-6">
            Try the live demo — no sign-up required. Everything saves in this browser.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {DEMO_STEPS.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3 p-3 rounded-2xl bg-cream-100">
                <span className="text-xl flex-shrink-0" aria-hidden="true">{step.icon}</span>
                <div>
                  <p className="text-label text-ink">
                    <span className="text-ink-muted mr-1.5">{i + 1}.</span>
                    {step.title}
                  </p>
                  <p className="text-caption text-ink-muted mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button size="md" className="w-full text-lg py-4" onClick={enterDemo}>
            Start Demo
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center px-6 py-12">
      <BrandHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full card shadow-soft"
      >
        <SegmentedControl
          options={[
            { id: 'login', label: 'Log In' },
            { id: 'signup', label: 'Sign Up' },
          ]}
          value={mode}
          onChange={(m) => { setMode(m); setError('') }}
          className="mb-6"
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <label className="block text-label text-ink-secondary mb-1">Your name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="What should we call you?"
                  className="input"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-label text-ink-secondary mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="input"
            />
          </div>

          <div>
            <label className="block text-label text-ink-secondary mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="input"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-danger-600 text-caption bg-danger-50 border border-danger-200 rounded-2xl px-4 py-2.5"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" className="w-full mt-2" loading={loading}>
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>
        </form>
      </motion.div>

      <p className="text-caption text-ink-muted text-center mt-6 px-4">
        Your pet Pip is waiting for you
      </p>
    </div>
  )
}
