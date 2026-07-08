import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TaskCard from '../components/TaskCard/TaskCard'
import { useTasks } from '../hooks/useTasks'
import AddTaskModal from './AddTaskModal'
import { isTaskFromToday } from '../core/tasks'
import { PageHeader, SegmentedControl, EmptyState, Button } from '../components/ui'

const FILTERS = ['Today', 'Active', 'Hard', 'Completed', 'All']

export default function TaskList() {
  const { tasks, loading, completeTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = tasks.filter((t) => {
    if (filter === 'Today')     return isTaskFromToday(t)
    if (filter === 'Active')    return !t.completed
    if (filter === 'Hard')      return t.difficulty === 'hard'
    if (filter === 'Completed') return t.completed
    return true
  })

  const activeCount    = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) =>  t.completed).length
  const todayCount     = tasks.filter((t) => isTaskFromToday(t)).length

  return (
    <div className="page">
      <PageHeader
        title="Tasks"
        subtitle={`${todayCount} today · ${activeCount} active · ${completedCount} completed`}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <span className="text-lg leading-none" aria-hidden="true">+</span> Add
          </Button>
        }
      />

      <SegmentedControl
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        className="mb-5"
      />

      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={filter === 'Completed' ? 'No completed tasks yet.' : 'No tasks here.'}
          message={
            filter === 'Completed'
              ? 'Finish a task and it will show up here.'
              : 'Add a task to start feeding your sprout.'
          }
          action={
            filter !== 'Completed' && (
              <Button size="sm" variant="secondary" onClick={() => setShowAddModal(true)}>
                Add a task
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                showDate
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}
