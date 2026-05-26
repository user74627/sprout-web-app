import { createContext, useContext, useEffect, useState } from 'react'
import { isDemoMode } from '../lib/isDemoMode'
import { DEMO_USER } from '../demo/demoUser'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      // Always in for the public demo link — data stays in this browser's localStorage
      setUser(DEMO_USER)
      setLoading(false)
      return
    }

    let unsubscribe
    ;(async () => {
      const { onAuthStateChanged } = await import('firebase/auth')
      const { auth } = await import('../firebase/config')
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      })
    })()

    return () => unsubscribe?.()
  }, [])

  const enterDemo = () => setUser(DEMO_USER)

  const leaveDemo = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode, enterDemo, leaveDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
