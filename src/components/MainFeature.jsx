import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameMode, setGameMode] = useState('math') // 'math' or 'reading'
  const [difficulty, setDifficulty] = useState(1)
  const [hearts, setHearts] = useState(3)
  const [showCelebration, setShowCelebration] = useState(false)

  const mathQuestions = [
    {
      id: 1,
      question: "What is 5 + 3?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      type: "addition",
      points: 10
    },
    {
      id: 2,
      question: "What is 12 - 4?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      type: "subtraction",
      points: 10
    },
    {
      id: 3,
      question: "What is 3 × 4?",
      options: ["10", "11", "12", "13"],
      correct: 2,
      type: "multiplication",
      points: 15
    },
    {
      id: 4,
      question: "What is 16 ÷ 2?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      type: "division",
      points: 15
    }
  ]

  const readingQuestions = [
    {
      id: 1,
      question: "Which word rhymes with 'cat'?",
      options: ["dog", "hat", "sun", "tree"],
      correct: 1,
      type: "rhyming",
      points: 10
    },
    {
      id: 2,
      question: "What sound does 'B' make?",
      options: ["Buh", "Duh", "Guh", "Tuh"],
      correct: 0,
      type: "phonics",
      points: 10
    },
    {
      id: 3,
      question: "Complete the word: 'Sun___'",
      options: ["shine", "moon", "dark", "cold"],
      correct: 0,
      type: "vocabulary",
      points: 15
    },
    {
      id: 4,
      question: "Which is a complete sentence?",
      options: ["The dog", "Runs fast", "The dog runs.", "Fast dog"],
      correct: 2,
      type: "grammar",
      points: 15
    }
  ]

  const questions = gameMode === 'math' ? mathQuestions : readingQuestions

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correct
    setShowResult(true)

    if (isCorrect) {
      const points = questions[currentQuestion].points
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      
      if (streak >= 2) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
      
      toast.success(`Awesome! +${points} points! 🌟`, {
        position: "top-center",
        autoClose: 2000,
      })
    } else {
      setStreak(0)
      setHearts(prev => Math.max(0, prev - 1))
      toast.error("Oops! Try again next time! 💪", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // Game completed
        toast.success(`Game Complete! Final Score: ${score}! 🎉`, {
          position: "top-center",
          autoClose: 3000,
        })
        resetGame()
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setStreak(0)
    setHearts(3)
  }

  const switchMode = (mode) => {
    setGameMode(mode)
    resetGame()
    toast.info(`Switched to ${mode === 'math' ? 'Math' : 'Reading'} Quest! 📚`, {
      position: "top-center",
      autoClose: 2000,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Game Mode Selector */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
      >
        <motion.button
          onClick={() => switchMode('math')}
          className={`px-6 py-3 rounded-2xl font-bold font-fun text-lg flex items-center gap-3 transition-all duration-300 ${
            gameMode === 'math' 
              ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-game' 
              : 'bg-white/80 text-gray-700 hover:bg-primary/10 border-2 border-primary/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Calculator" className="w-6 h-6" />
          Math Quest
        </motion.button>
        
        <motion.button
          onClick={() => switchMode('reading')}
          className={`px-6 py-3 rounded-2xl font-bold font-fun text-lg flex items-center gap-3 transition-all duration-300 ${
            gameMode === 'reading' 
              ? 'bg-gradient-to-r from-secondary to-secondary-light text-white shadow-game' 
              : 'bg-white/80 text-gray-700 hover:bg-secondary/10 border-2 border-secondary/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="BookOpen" className="w-6 h-6" />
          Reading Quest
        </motion.button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="game-card p-4 sm:p-6 mb-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
              <span className="font-bold text-gray-600 text-sm sm:text-base">Score</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary font-fun">{score}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-600 text-sm sm:text-base">Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-fun">{streak}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="Heart" className="w-5 h-5 text-red-500" />
              <span className="font-bold text-gray-600 text-sm sm:text-base">Hearts</span>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <ApperIcon 
                  key={i} 
                  name="Heart" 
                  className={`w-6 h-6 ${i < hearts ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="Target" className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-gray-600 text-sm sm:text-base">Progress</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Game Area */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="game-card p-6 sm:p-8 lg:p-12 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

        {/* Question */}
        <motion.div 
          key={currentQuestion}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${
              gameMode === 'math' 
                ? 'bg-gradient-to-br from-primary/20 to-primary-light/20' 
                : 'bg-gradient-to-br from-secondary/20 to-secondary-light/20'
            }`}>
              <ApperIcon 
                name={gameMode === 'math' ? 'Calculator' : 'BookOpen'} 
                className={`w-8 h-8 ${gameMode === 'math' ? 'text-primary' : 'text-secondary'}`} 
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-600 font-fun">
              {gameMode === 'math' ? 'Math Challenge' : 'Reading Challenge'}
            </h2>
          </div>
          
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-fun leading-tight">
            {questions[currentQuestion].question}
          </h3>
        </motion.div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`question-option text-left font-medium text-lg sm:text-xl p-4 sm:p-6 ${
                selectedAnswer === index ? 'selected' : ''
              } ${
                showResult && index === questions[currentQuestion].correct ? 'correct' : ''
              } ${
                showResult && selectedAnswer === index && index !== questions[currentQuestion].correct ? 'incorrect' : ''
              }`}
              disabled={showResult}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                  selectedAnswer === index 
                    ? 'bg-primary text-white border-primary' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-fun">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <motion.button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || showResult}
            className={`game-button text-xl px-8 py-4 ${
              selectedAnswer === null || showResult 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg'
            }`}
            whileHover={selectedAnswer !== null && !showResult ? { scale: 1.05 } : {}}
            whileTap={selectedAnswer !== null && !showResult ? { scale: 0.95 } : {}}
          >
            {showResult ? 'Next Question...' : 'Submit Answer'}
          </motion.button>
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl"
              >
                🌟
              </motion.div>
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="absolute text-center"
              >
                <div className="text-4xl font-bold text-white font-fun mb-2">
                  Streak Bonus!
                </div>
                <div className="text-xl text-white/90">
                  +50 Points! 🎉
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Character Animation */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: streak > 0 ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl ${
            streak > 2 
              ? 'bg-gradient-to-br from-accent to-yellow-400 shadow-achievement' 
              : streak > 0 
                ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-soft'
                : 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-soft'
          }`}
        >
          {streak > 2 ? '🤩' : streak > 0 ? '😊' : '🙂'}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MainFeature