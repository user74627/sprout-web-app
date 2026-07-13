import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as demoStorage from '../services/demoStorage'

const DEMO_USER = {
  uid: 'demo-uid',
  displayName: 'Demo User',
  email: 'demo@sprout.app',
}

const DemoAuthContext = createContext(null)

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const state = await demoStorage.loadDemoState()
      // For demo mode, auto-login if no user exists
      setUser(DEMO_USER)
      setLoading(false)
    }
    init()
  }, [])

  const enterDemo = () => setUser(DEMO_USER)
  const leaveDemo = () => setUser(null)

  return (
    <DemoAuthContext.Provider value={{ user, loading, enterDemo, leaveDemo }}>
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  const ctx = useContext(DemoAuthContext)
  if (!ctx) throw new Error('useDemoAuth must be used within DemoAuthProvider')
  return ctx
}