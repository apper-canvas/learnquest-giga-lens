import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleConnectionChange = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)
    return () => {
      window.removeEventListener('online', handleConnectionChange)
      window.removeEventListener('offline', handleConnectionChange)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-primary via-purple-500 to-secondary text-white py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <ApperIcon name="Sparkles" className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-fun text-shadow-lg">
                  LearnQuest
                </h1>
                <p className="text-sm sm:text-base text-white/90 font-medium">
                  Adventure Through Learning
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-3 sm:gap-4">
<Link 
                to="/dashboard"
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition-all duration-200"
              >
                <ApperIcon name="BarChart3" className="w-5 h-5 text-accent" />
                <span className="font-bold text-sm sm:text-base">Dashboard</span>
              </Link>
              <motion.div 
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
                <span className="font-bold text-sm sm:text-base">2,450 Points</span>
              </motion.div>
              
              <motion.div 
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <ApperIcon name="Star" className="w-5 h-5 text-accent" />
                <span className="font-bold text-sm sm:text-base">Level 12</span>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-4 right-1/4 text-accent/30"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ApperIcon name="BookOpen" className="w-6 h-6" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-4 left-1/3 text-accent/30"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <ApperIcon name="Calculator" className="w-6 h-6" />
        </motion.div>
      </motion.header>

      {/* Main Feature */}
      <MainFeature />

      {/* Footer */}
      <motion.footer 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-xl">
                  <ApperIcon name="Sparkles" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-fun">LearnQuest</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Making learning fun and engaging for children through interactive games and adventures.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <ApperIcon name="Users" className="w-5 h-5 text-secondary" />
                Community
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <ApperIcon name="MessageCircle" className="w-4 h-4" />
                  Parent Forum
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <ApperIcon name="HelpCircle" className="w-4 h-4" />
                  Help Center
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <ApperIcon name="Shield" className="w-4 h-4" />
                  Safety Guidelines
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <ApperIcon name="Heart" className="w-5 h-5 text-primary" />
                Support
              </h4>
              <div className="space-y-3">
                <motion.button 
                  className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-2 px-4 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                </motion.button>
                <motion.button 
                  className="w-full bg-gradient-to-r from-secondary to-secondary-light text-white py-2 px-4 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Feedback
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 LearnQuest. Designed with ❤️ for young learners everywhere.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home