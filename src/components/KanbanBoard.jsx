import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

function KanbanBoard({ tasks, onTaskUpdate, onTaskEdit, onTaskDelete, priorities, statuses }) {
  const [draggedTask, setDraggedTask] = useState(null)

  const columns = {
    'todo': {
      id: 'todo',
      title: 'To Do',
      icon: 'Circle',
      color: 'bg-surface-400',
      borderColor: 'border-surface-400'
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      icon: 'Clock',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500'
    },
    'completed': {
      id: 'completed',
      title: 'Completed',
      icon: 'CheckCircle',
      color: 'bg-green-500',
      borderColor: 'border-green-500'
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const getDueDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Overdue'
    return format(date, 'MMM dd')
  }

  const handleDragStart = (start) => {
    const task = tasks.find(t => t.id === start.draggableId)
    setDraggedTask(task)
  }

  const handleDragEnd = (result) => {
    setDraggedTask(null)
    
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId) {
      return
    }

    const newStatus = destination.droppableId
    onTaskUpdate(draggableId, { status: newStatus })
    toast.success(`Task moved to ${columns[newStatus].title}!`)
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className={`glass-morphism rounded-2xl p-4 border-t-4 ${column.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${column.color} rounded-xl flex items-center justify-center`}>
                      <ApperIcon name={column.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-800 dark:text-surface-200">
                        {column.title}
                      </h3>
                      <p className="text-sm text-surface-500">
                        {getTasksByStatus(column.id).length} tasks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] space-y-3 p-4 rounded-2xl transition-all duration-300 ${
                      snapshot.isDraggedOver
                        ? 'bg-primary/10 border-2 border-primary border-dashed'
                        : 'bg-transparent border-2 border-transparent'
                    }`}
                  >
                    <AnimatePresence>
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ delay: index * 0.1 }}
                              className={`glass-morphism rounded-xl p-4 border-l-4 cursor-grab active:cursor-grabbing transition-all duration-300 ${
                                snapshot.isDragging
                                  ? 'shadow-2xl scale-105 rotate-3'
                                  : 'shadow-card hover:shadow-lg'
                              } ${
                                task.status === 'completed' ? 'border-green-500' : 
                                isPast(task.dueDate) && task.status !== 'completed' ? 'border-red-500' :
                                priorities[task.priority].color.replace('bg-', 'border-')
                              }`}
                            >
                              {/* Task Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className={`font-medium text-sm mb-2 ${
                                    task.status === 'completed' 
                                      ? 'line-through text-surface-500' 
                                      : 'text-surface-800 dark:text-surface-200'
                                  }`}>
                                    {task.title}
                                  </h4>
                                  
                                  {task.description && (
                                    <p className="text-xs text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 ml-2">
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onTaskEdit(task)
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <ApperIcon name="Edit2" className="w-3.5 h-3.5" />
                                  </motion.button>

                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onTaskDelete(task.id)
                                    }}
                                    className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <ApperIcon name="Trash2" className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>
                              </div>

                              {/* Task Meta Information */}
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorities[task.priority].color} text-white`}>
                                    <ApperIcon name={priorities[task.priority].icon} className="w-3 h-3 mr-1" />
                                    {priorities[task.priority].label}
                                  </span>
                                  
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                                    {task.category}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    isPast(task.dueDate) && task.status !== 'completed' 
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                  }`}>
                                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                                    {getDueDateLabel(task.dueDate)}
                                  </span>

                                  <ApperIcon name="GripVertical" className="w-4 h-4 text-surface-400" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}

                    {/* Empty State */}
                    {getTasksByStatus(column.id).length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-3">
                          <ApperIcon name={column.icon} className="w-8 h-8 text-surface-400" />
                        </div>
                        <p className="text-sm text-surface-500 mb-1">No {column.title.toLowerCase()} tasks</p>
                        <p className="text-xs text-surface-400">
                          {column.id === 'todo' 
                            ? 'Create a new task or drag one here'
                            : 'Drag tasks here to update status'
                          }
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Drag Indicator */}
      {draggedTask && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 z-50 glass-morphism rounded-xl p-4 shadow-2xl max-w-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Move" className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                Moving "{draggedTask.title}"
              </p>
              <p className="text-xs text-surface-500">
                Drop in a column to update status
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default KanbanBoard