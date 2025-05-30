import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

import { toast } from 'react-toastify'
import ApperIcon from './components/ApperIcon'
import { useState, useEffect } from 'react'

// Offline Data Management
const OFFLINE_STORAGE_KEY = 'learnquest_offline_data'

const initializeOfflineData = () => {
  const defaultData = {
    userProgress: {
      score: 0,
      level: 1,
      achievements: [],
      completedQuizzes: [],
      streakRecord: 0
    },
    questionsCache: {
      math: [],
      reading: [],
      quiz: {}
    },
    lastSync: new Date().toISOString(),
    offlineActions: []
  }

  const existing = localStorage.getItem(OFFLINE_STORAGE_KEY)
  if (!existing) {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(defaultData))
  }
  return existing ? JSON.parse(existing) : defaultData
}

const saveOfflineData = (data) => {
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(data))
}
function App() {
const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineData, setOfflineData] = useState(() => initializeOfflineData())
  const [syncInProgress, setSyncInProgress] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('🌐 Back online! Syncing your progress...', {
        position: "top-center",
        autoClose: 3000,
      })
      syncOfflineData()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.info('📱 You\'re offline! Don\'t worry, you can keep learning!', {
        position: "top-center",
        autoClose: 4000,
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register service worker for PWA capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'))
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const syncOfflineData = async () => {
    if (!isOnline) return
    
    setSyncInProgress(true)
    try {
      // Simulate API sync - in real app this would sync with backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const data = { ...offlineData, lastSync: new Date().toISOString(), offlineActions: [] }
      saveOfflineData(data)
      setOfflineData(data)
      
      toast.success('✅ Progress synced successfully!', {
        position: "top-center",
        autoClose: 2000,
      })
    } catch (error) {
      toast.error('❌ Sync failed. Will retry later.', {
        position: "top-center",
        autoClose: 3000,
      })
    } finally {
      setSyncInProgress(false)
    }
  }

  const ConnectionStatus = () => (
    <div className="fixed top-4 left-4 z-50">
      {syncInProgress ? (
        <div className="sync-indicator">
          <ApperIcon name="RefreshCw" className="w-4 h-4 animate-spin" />
          Syncing...
        </div>
      ) : isOnline ? (
        <div className="online-indicator">
          <ApperIcon name="Wifi" className="w-4 h-4" />
          Online
        </div>
      ) : (
        <div className="offline-indicator">
          <ApperIcon name="WifiOff" className="w-4 h-4" />
          Offline Mode
        </div>
      )}
    </div>
  )
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
<ConnectionStatus />
        <Routes>
          <Route path="/" element={<Home />} />
<Route path="/dashboard" element={<Dashboard />} />
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
          className="z-50"
          toastClassName="bg-white border-l-4 border-primary shadow-lg rounded-lg"
          bodyClassName="text-gray-700 font-medium"
        />
      </div>
    </Router>
  )
}

export default App