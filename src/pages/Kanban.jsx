import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import KanbanBoard from '../components/KanbanBoard'

function Kanban() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the quarterly project proposal and submit to management',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(),
      createdAt: new Date(),
      category: 'Work'
    },
    {
      id: '2', 
      title: 'Buy groceries',
      description: 'Weekly grocery shopping - milk, bread, vegetables',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      category: 'Personal'
    },
    {
      id: '3',
      title: 'Review quarterly reports',
      description: 'Analyze Q4 performance metrics and prepare summary',
      priority: 'high',
      status: 'completed',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      category: 'Work'
    },
    {
      id: '4',
      title: 'Schedule dentist appointment',
      description: 'Book routine dental checkup for next month',
      priority: 'low',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      category: 'Health'
    }
  ])
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    category: 'Work'
  })
  
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const priorities = {
    low: { color: 'bg-green-500', label: 'Low', icon: 'ArrowDown' },
    medium: { color: 'bg-yellow-500', label: 'Medium', icon: 'Minus' },
    high: { color: 'bg-red-500', label: 'High', icon: 'ArrowUp' }
  }

  const statuses = {
    todo: { color: 'bg-surface-400', label: 'To Do', icon: 'Circle' },
    'in-progress': { color: 'bg-blue-500', label: 'In Progress', icon: 'Clock' },
    completed: { color: 'bg-green-500', label: 'Completed', icon: 'CheckCircle' }
  }

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning']

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      status: 'todo',
      createdAt: new Date()
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      setTasks(prev => [...prev, task])
      toast.success('Task created successfully!')
    }

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      category: 'Work'
    })
    setShowForm(false)
  }

  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: format(task.dueDate, 'yyyy-MM-dd'),
      category: task.category
    })
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success('Task deleted successfully!')
    }
  }

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-800 dark:text-surface-200 mb-4">
          Kanban Board
        </h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Visualize your workflow and track task progress with our intuitive drag-and-drop interface.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-surface-800 dark:text-surface-200 mb-1">
            {tasks.filter(t => t.status === 'todo').length}
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">To Do</div>
        </div>
        
        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-surface-800 dark:text-surface-200 mb-1">
            {tasks.filter(t => t.status === 'in-progress').length}
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">In Progress</div>
        </div>
        
        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-surface-800 dark:text-surface-200 mb-1">
            {completedCount}
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">Completed</div>
        </div>
      </motion.div>

      {/* Add Task Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          Add New Task
        </motion.button>
      </motion.div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskEdit={handleEdit}
        onTaskDelete={handleDelete}
        priorities={priorities}
        statuses={statuses}
      />
    </div>
  )
}

export default Kanban