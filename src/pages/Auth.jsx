import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Sprout, ShoppingBag } from 'lucide-react'
import { SegmentedControl, Button, Input } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'

const DEMO_STEPS = [
  { Icon: CheckSquare, title: 'Complete tasks', desc: 'Check off to-dos and earn health, coins, and XP.' },
  { Icon: Sprout, title: 'Grow your pet', desc: 'Pip thrives when you stay consistent.' },
  { Icon: ShoppingBag, title: 'Shop & equip', desc: 'Spend coins on accessories for your sprout.' },
]

function GoogleButton({ loading, setLoading, setError }) {
  async function handleGoogle() {
    setLoading(true)
    try {
      const { signInWithGoogle } = await import('../firebase/auth')
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-white border border-soil-200/60 rounded-lg py-3 font-semibold text-soil-800 hover:bg-soil-50 transition-colors duration-150 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-sprout-400"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.76 1.23 9.26 3.24l6.85-6.85C35.2 2.4 30.01.5 24 .5 16.2 0 9.42 3.58 5.27 9.08l7.93 6.2c2.2-1.99 5.15-3.63 9.55-3.63z"/>
        <path fill="#4285F4" d="M46.11 24.5c0-1.77-.15-3.49-.42-5.14H24v9.7h12.5c-.67 2.23-2.09 4.16-4.1 5.36l6.53 5.06c3.86-3.56 6.11-8.77 6.11-14.98z"/>
        <path fill="#FBBC05" d="M9.5 34.58c-2.13-2.13-3.75-4.86-4.69-8.02l-6.85 5.37C2.62 31.18 6.05 34 12 34l7.93-6.2z"/>
        <path fill="#34A853" d="M15.9 24.6c-.26-1.66-.26-3.37 0-5.04l-7.93-6.2c-2.77 2.6-4.62 6.3-4.62 10.3 0 3.9 1.79 7.5 4.5 9.8l6.85-5.36c.63-1.65 1.95-2.97 3.59-3.7z"/>
      </svg>
      Continue with Google
    </button>
  )
}

export default function Auth() {
  const { enterDemo } = useAuth()
  const [mode, setMode] = useState('login')
  const [showDemo, setShowDemo] = useState(isDemoMode)
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
      <div className="w-20 h-20 bg-sprout-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
        <Sprout size={40} className="text-white" strokeWidth={2} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-soil-800">Sprout</h1>
      <p className="text-sm text-soil-600 mt-1 text-center max-w-xs">
        Grow your goals, one task at a time.
      </p>
    </motion.div>
  )

  if (showDemo) {
    return (
      <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center px-6 py-12">
        <BrandHeader />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full card"
        >
          <p className="text-sm text-soil-600 text-center mb-6">
            Try the live demo — no sign-up required. Everything saves in this browser.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {DEMO_STEPS.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3 p-3 rounded-lg bg-soil-100">
                <div className="w-8 h-8 rounded-lg bg-sprout-100 flex items-center justify-center flex-shrink-0">
                  <step.Icon size={16} className="text-sprout-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-soil-800">
                    <span className="text-soil-400 mr-1.5">{i + 1}.</span>
                    {step.title}
                  </p>
                  <p className="text-xs text-soil-400/80 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button size="md" className="w-full py-4" onClick={enterDemo}>
            Start Demo
          </Button>

          <button
            type="button"
            onClick={() => setShowDemo(false)}
            className="w-full mt-3 text-sm text-soil-400 hover:text-soil-600 transition-colors duration-150"
          >
            Or sign in with an existing account
          </button>
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
        className="w-full card"
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
                <Input
                  label="Your name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="What should we call you?"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="At least 6 characters"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-danger-600 text-caption bg-danger-50 border border-danger-200 rounded-xl px-4 py-2.5"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" className="w-full mt-2" loading={loading}>
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-line-subtle" />
            <span className="text-xs text-soil-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-line-subtle" />
          </div>

          <GoogleButton loading={loading} setLoading={setLoading} setError={setError} />
        </form>
      </motion.div>

      <p className="text-xs text-soil-400/70 text-center mt-6 px-4">
        Your pet Pip is waiting for you
      </p>
    </div>
  )
}
