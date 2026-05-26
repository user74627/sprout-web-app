import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Auth from './pages/Auth'
import Home from './pages/Home'
import TaskList from './pages/TaskList'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import Navbar from './components/Navbar/Navbar'
import DemoBanner from './components/DemoBanner/DemoBanner'

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-100">
      <div className="w-10 h-10 border-4 border-sprout-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />

  return (
    <HashRouter>
      <div className="max-w-md mx-auto min-h-screen relative">
        <DemoBanner />
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/" replace /> : <Auth />}
          />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {user && <Navbar />}
      </div>
    </HashRouter>
  )
}
