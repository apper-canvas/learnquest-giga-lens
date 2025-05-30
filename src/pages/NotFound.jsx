import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-card border border-white/40"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-full">
              <ApperIcon name="MapPin" className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl sm:text-7xl font-bold font-fun text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            404
          </motion.h1>
          
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-fun"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oops! Adventure Not Found
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            It looks like this learning quest doesn't exist! Don't worry, there are plenty of other exciting adventures waiting for you.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/">
              <motion.button 
                className="game-button inline-flex items-center gap-3 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Home" className="w-6 h-6" />
                Return to LearnQuest
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 text-accent/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Star" className="w-8 h-8" />
            </motion.div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 text-secondary/20">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Sparkles" className="w-8 h-8" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound