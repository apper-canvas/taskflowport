import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-4 sm:p-6"
      >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo and Brand */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-neu-light dark:shadow-neu-dark flex items-center justify-center">
                  <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse-glow"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
                  Productivity Unleashed
                </p>
              </div>
            </motion.div>

            {/* Time Display */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-lg font-semibold text-surface-800 dark:text-surface-200">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-surface-600 dark:text-surface-400">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="relative w-14 h-8 bg-surface-200 dark:bg-surface-700 rounded-full p-1 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-6 h-6 bg-white dark:bg-surface-300 rounded-full shadow-md flex items-center justify-center"
                  animate={{
                    x: darkMode ? 24 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <AnimatePresence mode="wait">
                    {darkMode ? (
                      <motion.div
                        key="moon"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ApperIcon name="Moon" className="w-4 h-4 text-surface-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ApperIcon name="Sun" className="w-4 h-4 text-amber-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-800 dark:text-surface-200 mb-3">
            Transform Your Productivity
          </h2>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Experience the perfect blend of simplicity and power in task management
          </p>
        </motion.div>

        {/* Main Feature Component */}
        <MainFeature />

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { icon: "Target", label: "Focus Mode", value: "Active" },
            { icon: "Clock", label: "Time Saved", value: "2.5hrs" },
            { icon: "TrendingUp", label: "Productivity", value: "+15%" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-morphism rounded-2xl p-4 sm:p-6 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name={stat.icon} className="w-6 h-6 text-primary" />
              </div>
              <div className="text-lg sm:text-xl font-semibold text-surface-800 dark:text-surface-200">
                {stat.value}
              </div>
              <div className="text-sm text-surface-600 dark:text-surface-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

export default Home