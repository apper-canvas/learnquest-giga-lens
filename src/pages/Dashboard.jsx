import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const Dashboard = () => {
  const [milestones, setMilestones] = useState([])
  const [achievements, setAchievements] = useState([])
  const [weeklyProgress, setWeeklyProgress] = useState([])
  const [skillProgress, setSkillProgress] = useState({})
  const [currentUser, setCurrentUser] = useState('Alex') // Demo user
  const [viewMode, setViewMode] = useState('overview') // 'overview', 'achievements', 'progress'
  const [selectedTimeframe, setSelectedTimeframe] = useState('week') // 'week', 'month', 'all'

  // Mock milestone data - in real app this would come from localStorage or API
  const mockMilestones = [
    {
      id: 1,
      title: 'Math Whiz',
      description: 'Complete 10 math quizzes',
      category: 'Math',
      progress: 8,
      total: 10,
      unlocked: false,
      icon: 'Calculator',
      color: 'from-blue-400 to-blue-600',
      points: 100
    },
    {
      id: 2,
      title: 'Reading Champion',
      description: 'Complete 5 reading comprehension quizzes',
      category: 'Reading',
      progress: 5,
      total: 5,
      unlocked: true,
      unlockedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: 'BookOpen',
      color: 'from-green-400 to-green-600',
      points: 75
    },
    {
      id: 3,
      title: 'Streak Master',
      description: 'Achieve a 5-question streak',
      category: 'General',
      progress: 3,
      total: 5,
      unlocked: false,
      icon: 'Zap',
      color: 'from-orange-400 to-orange-600',
      points: 50
    },
    {
      id: 4,
      title: 'Quiz Explorer',
      description: 'Try all quiz topics',
      category: 'General',
      progress: 4,
      total: 5,
      unlocked: false,
      icon: 'Brain',
      color: 'from-purple-400 to-purple-600',
      points: 125
    },
    {
      id: 5,
      title: 'Perfect Score',
      description: 'Get 100% on any quiz',
      category: 'General',
      progress: 1,
      total: 1,
      unlocked: true,
      unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: 'Trophy',
      color: 'from-yellow-400 to-yellow-600',
      points: 200
    },
    {
      id: 6,
      title: 'Mini-Game Master',
      description: 'Complete 15 mini-games',
      category: 'Games',
      progress: 12,
      total: 15,
      unlocked: false,
      icon: 'Gamepad2',
      color: 'from-pink-400 to-pink-600',
      points: 150
    }
  ]

  const mockWeeklyData = [
    { day: 'Mon', quizzes: 2, games: 3, points: 45 },
    { day: 'Tue', quizzes: 1, games: 2, points: 30 },
    { day: 'Wed', quizzes: 3, games: 1, points: 55 },
    { day: 'Thu', quizzes: 0, games: 4, points: 25 },
    { day: 'Fri', quizzes: 2, games: 2, points: 40 },
    { day: 'Sat', quizzes: 4, games: 3, points: 75 },
    { day: 'Sun', quizzes: 1, games: 1, points: 20 }
  ]

  const mockSkillData = {
    'Basic Math': { current: 85, target: 100, color: '#3B82F6' },
    'Advanced Math': { current: 60, target: 100, color: '#8B5CF6' },
    'Phonics': { current: 90, target: 100, color: '#10B981' },
    'Vocabulary': { current: 75, target: 100, color: '#F59E0B' },
    'Reading': { current: 95, target: 100, color: '#EF4444' }
  }

  useEffect(() => {
    // Load milestone data (in real app, this would be from localStorage or API)
    setMilestones(mockMilestones)
    setWeeklyProgress(mockWeeklyData)
    setSkillProgress(mockSkillData)
    
    // Load achievements (unlocked milestones)
    const unlockedMilestones = mockMilestones.filter(m => m.unlocked)
    setAchievements(unlockedMilestones)

    toast.success('Welcome to your Learning Dashboard! 📊', {
      position: "top-center",
      autoClose: 3000,
    })
  }, [])

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)
  const totalQuizzes = weeklyProgress.reduce((sum, day) => sum + day.quizzes, 0)
  const totalGames = weeklyProgress.reduce((sum, day) => sum + day.games, 0)
  const weeklyPoints = weeklyProgress.reduce((sum, day) => sum + day.points, 0)

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#FF6B9D', '#4ECDC4', '#FFD93D'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    xaxis: {
      categories: weeklyProgress.map(d => d.day),
      position: 'bottom',
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontFamily: 'Fredoka, sans-serif'
        }
      }
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: false
      }
    },
    grid: { show: false },
    legend: {
      position: 'bottom',
      fontFamily: 'Fredoka, sans-serif'
    }
  }

  const chartSeries = [
    {
      name: 'Quizzes',
      data: weeklyProgress.map(d => d.quizzes)
    },
    {
      name: 'Mini-Games',
      data: weeklyProgress.map(d => d.games)
    },
    {
      name: 'Points (÷10)',
      data: weeklyProgress.map(d => Math.round(d.points / 10))
    }
  ]

  const skillChartOptions = {
    chart: {
      type: 'radialBar',
      height: 350
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          }
        }
      }
    },
    colors: Object.values(mockSkillData).map(skill => skill.color),
    labels: Object.keys(mockSkillData),
    legend: {
      show: true,
      floating: true,
      fontSize: '12px',
      position: 'left',
      offsetX: 50,
      offsetY: 10,
      labels: {
        useSeriesColors: true,
      },
      fontFamily: 'Fredoka, sans-serif'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }]
  }

  const skillChartSeries = Object.values(mockSkillData).map(skill => skill.current)

  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-xl">
              <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700 font-fun">{totalPoints}</div>
              <div className="text-blue-600 text-sm font-medium">Total Points</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700 font-fun">{totalQuizzes}</div>
              <div className="text-green-600 text-sm font-medium">Quizzes This Week</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-xl">
              <ApperIcon name="Gamepad2" className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700 font-fun">{totalGames}</div>
              <div className="text-purple-600 text-sm font-medium">Games This Week</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <ApperIcon name="Star" className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700 font-fun">{achievements.length}</div>
              <div className="text-orange-600 text-sm font-medium">Achievements</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="game-card p-6"
      >
        <h3 className="text-xl font-bold font-fun mb-4 flex items-center gap-2">
          <ApperIcon name="BarChart3" className="w-5 h-5 text-primary" />
          Weekly Activity
        </h3>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </motion.div>

      {/* Skill Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="game-card p-6"
      >
        <h3 className="text-xl font-bold font-fun mb-4 flex items-center gap-2">
          <ApperIcon name="Target" className="w-5 h-5 text-secondary" />
          Skill Mastery
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart options={skillChartOptions} series={skillChartSeries} type="radialBar" height={350} />
          <div className="space-y-4">
            {Object.entries(mockSkillData).map(([skill, data], index) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{skill}</span>
                  <span className="text-sm text-gray-500">{data.current}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.current}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="progress-fill"
                    style={{ backgroundColor: data.color }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )

  const AchievementsSection = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold font-fun mb-2">🏆 Your Achievements</h2>
        <p className="text-gray-600">Celebrate your learning milestones!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${achievement.color} rounded-2xl p-6 text-white relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ApperIcon name={achievement.icon} className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-fun">+{achievement.points}</div>
                  <div className="text-xs opacity-90">points</div>
                </div>
              </div>
              <h3 className="text-xl font-bold font-fun mb-2">{achievement.title}</h3>
              <p className="text-white/90 text-sm mb-3">{achievement.description}</p>
              <div className="text-xs opacity-75">
                Unlocked {format(achievement.unlockedDate, 'MMM dd, yyyy')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {achievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold font-fun mb-2">No achievements yet!</h3>
          <p className="text-gray-600 mb-6">Complete quizzes and games to unlock your first achievement.</p>
          <Link to="/" className="game-button inline-flex items-center gap-2">
            <ApperIcon name="Play" className="w-5 h-5" />
            Start Learning
          </Link>
        </motion.div>
      )}
    </div>
  )

  const ProgressSection = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold font-fun mb-2">📈 Learning Progress</h2>
        <p className="text-gray-600">Track your journey to mastery!</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`game-card p-6 ${milestone.unlocked ? 'ring-2 ring-green-400' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-br ${milestone.color} rounded-xl flex-shrink-0`}>
                <ApperIcon name={milestone.icon} className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold font-fun flex items-center gap-2">
                      {milestone.title}
                      {milestone.unlocked && <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />}
                    </h3>
                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">{milestone.points} pts</div>
                    <div className="text-xs text-gray-400">{milestone.category}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{milestone.progress} / {milestone.total}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(milestone.progress / milestone.total) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`progress-fill ${milestone.unlocked ? 'bg-green-500' : ''}`}
                    ></motion.div>
                  </div>
                  {milestone.unlocked && (
                    <div className="text-xs text-green-600 font-medium">
                      ✨ Completed {format(milestone.unlockedDate, 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-white/40 sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                <span className="font-medium">Back to Learning</span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold font-fun text-gray-800">Learning Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {currentUser}! 👋</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'overview' 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Overview
              </motion.button>
              <motion.button
                onClick={() => setViewMode('achievements')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'achievements' 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Achievements
              </motion.button>
              <motion.button
                onClick={() => setViewMode('progress')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'progress' 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Progress
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewSection />
            </motion.div>
          )}
          
          {viewMode === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementsSection />
            </motion.div>
          )}
          
          {viewMode === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-20"
      >
        <Link
          to="/"
          className="bg-gradient-to-r from-primary to-primary-light text-white p-4 rounded-full shadow-game hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="Play" className="w-6 h-6" />
          <span className="hidden sm:inline font-medium">Continue Learning</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default Dashboard