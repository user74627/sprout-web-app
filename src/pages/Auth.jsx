import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signUpWithEmail, signInWithEmail } from '../firebase/auth'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sprout-50 to-cream-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-10"
      >
        <div className="w-20 h-20 bg-sprout-500 rounded-3xl flex items-center justify-center mb-4 shadow-soft">
          <span className="text-4xl">🌱</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Sprout</h1>
        <p className="text-gray-500 mt-1 text-center text-sm">
          Grow your goals, one task at a time.
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full card shadow-soft"
      >
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             focus:ring-2 focus:ring-sprout-400 focus:border-transparent transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                         focus:ring-2 focus:ring-sprout-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                         focus:ring-2 focus:ring-sprout-400 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </motion.div>

      <p className="text-xs text-gray-400 text-center mt-6 px-4">
        Your pet Pip is waiting for you 🌱
      </p>
    </div>
  )
}
