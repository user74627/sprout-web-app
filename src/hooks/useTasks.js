import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/isDemoMode'
import * as demo from '../demo/demoStore'
import { isTaskFromToday } from '../core/tasks'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastReward, setLastReward] = useState(null)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    if (isDemoMode) {
      const refresh = () => setTasks(demo.getTasks())
      refresh()
      setLoading(false)
      return demo.subscribe(refresh)
    }

    let unsubscribe
    ;(async () => {
      const { onSnapshot, query, orderBy } = await import('firebase/firestore')
      const { tasksRef } = await import('../firebase/db')

      const q = query(tasksRef(user.uid), orderBy('createdAt', 'desc'))
      unsubscribe = onSnapshot(q, (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      })
    })()

    return () => unsubscribe?.()
  }, [user])

  const addTask = useCallback(
    async (title, difficulty = 'medium') => {
      if (!user) return
      if (isDemoMode) {
        demo.addTask(title, difficulty)
        return
      }
      const { addTask: dbAddTask } = await import('../firebase/db')
      await dbAddTask(user.uid, title, difficulty)
    },
    [user],
  )

  const completeTask = useCallback(
    async (taskId, difficulty) => {
      if (!user) return
      const reward = isDemoMode
        ? demo.completeTask(taskId, difficulty)
        : await (async () => {
            const { completeTaskWithBackend } = await import('../firebase/functions')
            return completeTaskWithBackend(taskId)
          })()
      setLastReward(reward)
      setTimeout(() => setLastReward(null), 2500)
    },
    [user],
  )

  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) return
      if (isDemoMode) {
        demo.deleteTask(taskId)
        return
      }
      const { deleteTask: dbDeleteTask } = await import('../firebase/db')
      await dbDeleteTask(user.uid, taskId)
    },
    [user],
  )

  const todaysTasks = tasks.filter((t) => isTaskFromToday(t))

  return { tasks, todaysTasks, loading, lastReward, addTask, completeTask, deleteTask }
}
