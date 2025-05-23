import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

function MainFeature() {
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
  const [filter, setFilter] = useState('all')
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
    setTasks(prev => prev.filter(t => t.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ))
    toast.success(`Task marked as ${statuses[newStatus].label.toLowerCase()}!`)
  }

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(t => t.status === 'completed')
      case 'pending':
        return tasks.filter(t => t.status !== 'completed')
      case 'overdue':
        return tasks.filter(t => isPast(t.dueDate) && t.status !== 'completed')
      default:
        return tasks
    }
  }

  const getDueDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Overdue'
    return format(date, 'MMM dd')
  }

  const filteredTasks = getFilteredTasks()
  const completedCount = tasks.filter(t => t.status === 'completed').length
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Dashboard */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="glass-morphism rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="ListTodo" className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-surface-800 dark:text-surface-200">
              {tasks.length}
            </span>
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">Total Tasks</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-2xl font-bold text-surface-800 dark:text-surface-200">
              {completedCount}
            </span>
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">Completed</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-2xl font-bold text-surface-800 dark:text-surface-200">
              {tasks.filter(t => t.status === 'in-progress').length}
            </span>
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">In Progress</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 sm:p-6">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                {Math.round(progressPercentage)}%
              </span>
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent" />
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">Progress</div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism rounded-2xl p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'pending', 'completed', 'overdue'].map((filterType) => (
              <motion.button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => {
              setShowForm(!showForm)
              setEditingTask(null)
              setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: format(new Date(), 'yyyy-MM-dd'),
                category: 'Work'
              })
            }}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-morphism rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Task description (optional)..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={editingTask ? "Save" : "Plus"} className="w-5 h-5" />
                  {editingTask ? 'Update Task' : 'Create Task'}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTask(null)
                  }}
                  className="bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-6 py-3 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-morphism rounded-2xl p-4 sm:p-6 border-l-4 ${
                task.status === 'completed' ? 'border-green-500' : 
                isPast(task.dueDate) && task.status !== 'completed' ? 'border-red-500' :
                priorities[task.priority].color.replace('bg-', 'border-')
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorities[task.priority].color} text-white`}>
                      <ApperIcon name={priorities[task.priority].icon} className="w-3 h-3 mr-1" />
                      {priorities[task.priority].label}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                      {task.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isPast(task.dueDate) && task.status !== 'completed' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                      {getDueDateLabel(task.dueDate)}
                    </span>
                  </div>

                  <h3 className={`text-lg font-semibold ${
                    task.status === 'completed' 
                      ? 'line-through text-surface-500' 
                      : 'text-surface-800 dark:text-surface-200'
                  }`}>
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p className="text-surface-600 dark:text-surface-400 text-sm">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <ApperIcon name={statuses[task.status].icon} className="w-4 h-4" />
                    <span>{statuses[task.status].label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <motion.button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ApperIcon name="Inbox" className="w-12 h-12 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400 mb-2">
              No tasks found
            </h3>
            <p className="text-surface-500 dark:text-surface-500">
              {filter === 'all' ? 'Create your first task to get started!' : `No ${filter} tasks at the moment.`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature