import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
import Kanban from './pages/Kanban'
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary/5 to-secondary/5 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
        toastClassName="bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-card"
      />
    </div>
  )
}

export default App
                  <Link
                    to="/kanban"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <ApperIcon name="Columns" className="w-5 h-5" />
                    <span className="font-medium">Kanban</span>
                  </Link>
                  
                <Route path="/kanban" element={<Kanban />} />