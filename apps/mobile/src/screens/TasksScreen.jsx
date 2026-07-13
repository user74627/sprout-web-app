import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native'
import * as demoStorage from '../services/demoStorage'
import { getTaskReward, isTaskFromToday } from '../services/core'

const DIFFICULTY_LABELS = {
  easy: { label: 'Easy', emoji: '🌱', color: 'bg-easy-100 text-easy-700' },
  medium: { label: 'Medium', emoji: '⚡', color: 'bg-coin-100 text-coin-700' },
  hard: { label: 'Hard', emoji: '🔥', color: 'bg-hard-100 text-hard-700' },
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('medium')

  const loadTasks = async () => {
    const t = await demoStorage.getTasks()
    setTasks(t)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleAddTask = async () => {
    if (!title.trim()) return
    await demoStorage.addTask(title.trim(), difficulty)
    setTitle('')
    setModalVisible(false)
    loadTasks()
  }

  const handleComplete = async (taskId, taskDifficulty) => {
    await demoStorage.completeTask(taskId)
    loadTasks()
  }

  const handleDelete = async (taskId) => {
    await demoStorage.deleteTask(taskId)
    loadTasks()
  }

  const todayTasks = tasks.filter((t) => !t.completed && isTaskFromToday(t))

  return (
    <View className="flex-1 bg-cream-50">
      <ScrollView className="flex-1 pt-12 px-6">
        <Text className="text-lg font-bold text-ink mb-4">Tasks</Text>

        {todayTasks.length === 0 && (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">📝</Text>
            <Text className="text-ink-muted text-center">
              No active tasks today. Add one to feed your pet!
            </Text>
          </View>
        )}

        {todayTasks.map((task) => (
          <View key={task.id} className="flex-row items-center bg-surface-elevated rounded-2xl p-4 mb-3 shadow-card">
            <TouchableOpacity
              onPress={() => handleComplete(task.id, task.difficulty)}
              className="w-6 h-6 rounded-full border-2 border-sprout-500 mr-3 items-center justify-center"
            >
              <View className="w-3 h-3 rounded-full bg-sprout-500" />
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="text-ink font-medium">{task.title}</Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View className={`px-2 py-0.5 rounded-full ${DIFFICULTY_LABELS[task.difficulty].color}`}>
                  <Text className="text-xs font-semibold">
                    {DIFFICULTY_LABELS[task.difficulty].label}
                  </Text>
                </View>
                {!task.completed && (
                  <Text className="text-xs text-xp-600">
                    +{getTaskReward(task.difficulty).coins} coins
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={() => handleDelete(task.id)}>
              <Text className="text-ink-muted">✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-20 right-6 bg-sprout-500 rounded-full w-14 h-14 items-center justify-center shadow-card"
      >
        <Text className="text-3xl text-white">+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-4xl px-6 pt-6 pb-8">
            <View className="w-12 h-1 bg-ink-muted/30 rounded-full self-center mb-6" />

            <Text className="text-xl font-bold text-ink mb-4">New Task</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              className="bg-cream-100 rounded-2xl px-4 py-3 mb-4 text-ink"
              autoFocus
            />

            <View className="flex-row gap-2 mb-6">
              {Object.entries(DIFFICULTY_LABELS).map(([key, info]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setDifficulty(key)}
                  className={`flex-1 items-center py-3 rounded-2xl border-2 ${
                    difficulty === key ? info.color + ' border-current' : 'border-ink-muted/20'
                  }`}
                >
                  <Text className="text-lg">{info.emoji}</Text>
                  <Text className="text-xs font-bold mt-1">{info.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-cream-200 rounded-2xl py-3 items-center"
              >
                <Text className="text-ink font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddTask}
                className="flex-1 bg-sprout-500 rounded-2xl py-3 items-center"
                disabled={!title.trim()}
              >
                <Text className="text-white font-semibold">Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}