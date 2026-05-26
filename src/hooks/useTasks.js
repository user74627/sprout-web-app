import { useEffect, useState, useCallback } from 'react'
import { onSnapshot, query, orderBy } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import {
  tasksRef,
  addTask as dbAddTask,
  completeTask as dbCompleteTask,
  deleteTask as dbDeleteTask,
} from '../firebase/db'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastReward, setLastReward] = useState(null)

  useEffect(() => {
    if (!user) return

    const q = query(tasksRef(user.uid), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const addTask = useCallback(
    async (title, difficulty = 'medium') => {
      if (!user) return
      await dbAddTask(user.uid, title, difficulty)
    },
    [user],
  )

  const completeTask = useCallback(
    async (taskId, difficulty) => {
      if (!user) return
      const reward = await dbCompleteTask(user.uid, taskId, difficulty)
      setLastReward(reward)
      setTimeout(() => setLastReward(null), 2500)
    },
    [user],
  )

  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) return
      await dbDeleteTask(user.uid, taskId)
    },
    [user],
  )

  const todaysTasks = tasks.filter((t) => {
    if (!t.createdAt) return true
    const created = t.createdAt.toDate?.() ?? new Date(t.createdAt)
    const today = new Date()
    return (
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    )
  })

  return { tasks, todaysTasks, loading, lastReward, addTask, completeTask, deleteTask }
}
