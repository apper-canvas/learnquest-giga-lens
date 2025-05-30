import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

// Offline Data Management
const OFFLINE_STORAGE_KEY = 'learnquest_offline_data'
const PROGRESS_STORAGE_KEY = 'learnquest_progress'

const getOfflineData = () => {
  const stored = localStorage.getItem(OFFLINE_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

const saveOfflineProgress = (progressData) => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...progressData,
    lastUpdated: new Date().toISOString()
  }))
}

const getOfflineProgress = () => {
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : {
    score: 0,
    streak: 0,
    hearts: 3,
    currentQuestion: 0,
    completedQuizzes: [],
    achievements: [],
    lastUpdated: new Date().toISOString()
  }
}
const MainFeature = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
const [gameMode, setGameMode] = useState('math') // 'math', 'reading', 'quiz', or 'stories'
  const [difficulty, setDifficulty] = useState(1)
  const [hearts, setHearts] = useState(3)
  const [showCelebration, setShowCelebration] = useState(false)
const [showMiniGameLauncher, setShowMiniGameLauncher] = useState(false)
  const [currentMiniGame, setCurrentMiniGame] = useState(null)
const [quizMode, setQuizMode] = useState(false)
  const [currentQuizTopic, setCurrentQuizTopic] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [showQuizResults, setShowQuizResults] = useState(false)

const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineMode, setOfflineMode] = useState(false)
// Story mode states
  const [storyMode, setStoryMode] = useState(false)
  const [currentStory, setCurrentStory] = useState(null)
  const [storyProgress, setStoryProgress] = useState({
    currentChapter: 0,
    choices: [],
    questionsAnswered: 0,
    comprehensionScore: 0
  })
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showStoryResult, setShowStoryResult] = useState(false)
  const [storyResults, setStoryResults] = useState(null)
  const [showStoryResults, setShowStoryResults] = useState(false)

  // Load offline progress on component mount
  useEffect(() => {
    const offlineProgress = getOfflineProgress()
    if (offlineProgress) {
      setScore(offlineProgress.score || 0)
      setStreak(offlineProgress.streak || 0)
      setHearts(offlineProgress.hearts || 3)
      setCurrentQuestion(offlineProgress.currentQuestion || 0)
    }

    const handleConnectionChange = () => {
      const online = navigator.onLine
      setIsOnline(online)
      if (!online) {
        setOfflineMode(true)
        toast.info('📱 Offline mode activated! Your progress will be saved locally.', {
          position: "top-center",
          autoClose: 3000,
        })
      } else if (offlineMode) {
        toast.success('🌐 Back online! Your offline progress has been preserved.', {
          position: "top-center",
          autoClose: 3000,
        })
        setOfflineMode(false)
      }
    }

    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)

    return () => {
      window.removeEventListener('online', handleConnectionChange)
      window.removeEventListener('offline', handleConnectionChange)
    }
  }, [offlineMode])

  // Save progress whenever key state changes
  useEffect(() => {
    const progressData = {
      score,
      streak,
      hearts,
      currentQuestion,
      gameMode,
      quizMode,
      currentQuizTopic: currentQuizTopic?.id || null
    }
    saveOfflineProgress(progressData)
  }, [score, streak, hearts, currentQuestion, gameMode, quizMode, currentQuizTopic])
// Static question data
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

  // Quiz question banks organized by skill areas
  const quizQuestions = {
    basicMath: [
      {
        id: 1,
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        type: "addition",
        points: 10,
        skill: "Basic Addition"
      },
      {
        id: 2,
        question: "What is 7 - 2?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        type: "subtraction",
        points: 10,
        skill: "Basic Subtraction"
      },
      {
        id: 3,
        question: "What is 4 + 4?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        type: "addition",
        points: 10,
        skill: "Basic Addition"
      },
      {
        id: 4,
        question: "What is 10 - 3?",
        options: ["6", "7", "8", "9"],
        correct: 1,
        type: "subtraction",
        points: 10,
        skill: "Basic Subtraction"
      },
      {
        id: 5,
        question: "What is 6 + 1?",
        options: ["6", "7", "8", "9"],
        correct: 1,
        type: "addition",
        points: 10,
        skill: "Basic Addition"
      }
    ],
    advancedMath: [
      {
        id: 1,
        question: "What is 6 × 7?",
        options: ["40", "41", "42", "43"],
        correct: 2,
        type: "multiplication",
        points: 15,
        skill: "Multiplication"
      },
      {
        id: 2,
        question: "What is 24 ÷ 6?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        type: "division",
        points: 15,
        skill: "Division"
      },
      {
        id: 3,
        question: "What is 1/2 + 1/4?",
        options: ["1/4", "2/6", "3/4", "1/6"],
        correct: 2,
        type: "fractions",
        points: 20,
        skill: "Fractions"
      },
      {
        id: 4,
        question: "What is 9 × 8?",
        options: ["70", "71", "72", "73"],
        correct: 2,
        type: "multiplication",
        points: 15,
        skill: "Multiplication"
      },
      {
        id: 5,
        question: "What is 45 ÷ 5?",
        options: ["8", "9", "10", "11"],
        correct: 1,
        type: "division",
        points: 15,
        skill: "Division"
      }
    ],
    phonics: [
      {
        id: 1,
        question: "What sound does 'CH' make?",
        options: ["K sound", "Ch sound", "S sound", "T sound"],
        correct: 1,
        type: "phonics",
        points: 10,
        skill: "Letter Sounds"
      },
      {
        id: 2,
        question: "Which word starts with the 'TH' sound?",
        options: ["Cat", "That", "Sun", "Dog"],
        correct: 1,
        type: "phonics",
        points: 10,
        skill: "Letter Sounds"
      },
      {
        id: 3,
        question: "What sound does 'PH' make?",
        options: ["P sound", "F sound", "H sound", "Ph sound"],
        correct: 1,
        type: "phonics",
        points: 10,
        skill: "Letter Sounds"
      },
      {
        id: 4,
        question: "Which letters make the 'ck' sound?",
        options: ["C and K", "S and H", "T and H", "C and H"],
        correct: 0,
        type: "phonics",
        points: 10,
        skill: "Letter Combinations"
      },
      {
        id: 5,
        question: "What sound does 'QU' make?",
        options: ["K sound", "Kw sound", "Q sound", "W sound"],
        correct: 1,
        type: "phonics",
        points: 10,
        skill: "Letter Sounds"
      }
    ],
    vocabulary: [
      {
        id: 1,
        question: "What does 'enormous' mean?",
        options: ["Very small", "Very big", "Very fast", "Very slow"],
        correct: 1,
        type: "vocabulary",
        points: 15,
        skill: "Word Meanings"
      },
      {
        id: 2,
        question: "Which word means the same as 'happy'?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correct: 1,
        type: "vocabulary",
        points: 15,
        skill: "Synonyms"
      },
      {
        id: 3,
        question: "What does 'cautious' mean?",
        options: ["Careless", "Careful", "Quick", "Loud"],
        correct: 1,
        type: "vocabulary",
        points: 15,
        skill: "Word Meanings"
      },
      {
        id: 4,
        question: "Which word is opposite of 'dark'?",
        options: ["Black", "Night", "Bright", "Shadow"],
        correct: 2,
        type: "vocabulary",
        points: 15,
        skill: "Antonyms"
      },
      {
        id: 5,
        question: "What does 'magnificent' mean?",
        options: ["Terrible", "Wonderful", "Small", "Quiet"],
        correct: 1,
        type: "vocabulary",
        points: 15,
        skill: "Word Meanings"
      }
    ],
    reading: [
      {
        id: 1,
        question: "In the story 'The Three Bears', who ate the porridge?",
        options: ["Goldilocks", "The bears", "The wolf", "The hunter"],
        correct: 0,
        type: "comprehension",
        points: 15,
        skill: "Story Details"
      },
      {
        id: 2,
        question: "What is the main idea of a story about friendship?",
        options: ["Animals", "Being kind to others", "School", "Food"],
        correct: 1,
        type: "comprehension",
        points: 15,
        skill: "Main Ideas"
      },
      {
        id: 3,
        question: "If a character feels scared, they might...",
        options: ["Laugh loudly", "Hide or run", "Dance", "Eat more"],
        correct: 1,
        type: "comprehension",
        points: 15,
        skill: "Character Feelings"
      },
      {
        id: 4,
        question: "What comes first in a story?",
        options: ["The end", "The middle", "The beginning", "The pictures"],
        correct: 2,
        type: "comprehension",
        points: 15,
        skill: "Story Structure"
      },
      {
        id: 5,
        question: "Why do we read stories?",
        options: ["To learn and have fun", "To sleep", "To eat", "To run"],
        correct: 0,
        type: "comprehension",
        points: 15,
        skill: "Reading Purpose"
      }
    ]
  }

  const quizTopics = [
    {
      id: 'basicMath',
      name: 'Basic Math',
      description: 'Addition and Subtraction',
      icon: 'Plus',
      color: 'from-blue-400 to-blue-600',
      questions: quizQuestions.basicMath
    },
    {
      id: 'advancedMath',
      name: 'Advanced Math',
      description: 'Multiplication, Division & Fractions',
      icon: 'Calculator',
      color: 'from-purple-400 to-purple-600',
      questions: quizQuestions.advancedMath
    },
    {
      id: 'phonics',
      name: 'Phonics',
      description: 'Letter Sounds & Combinations',
      icon: 'Volume2',
      color: 'from-green-400 to-green-600',
      questions: quizQuestions.phonics
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      description: 'Word Meanings & Usage',
      icon: 'BookOpen',
      color: 'from-orange-400 to-orange-600',
      questions: quizQuestions.vocabulary
    },
    {
      id: 'reading',
      name: 'Reading',
      description: 'Comprehension & Stories',
      icon: 'Book',
      color: 'from-pink-400 to-pink-600',
      questions: quizQuestions.reading
    }
  ]

  // Mini-game definitions
  const miniGames = [
    {
      id: 'memory',
      name: 'Memory Cards',
      icon: 'Brain',
      description: 'Match the pairs!',
      color: 'from-purple-400 to-purple-600',
      points: 25
    },
    {
      id: 'speed-math',
      name: 'Speed Math',
      icon: 'Zap',
      description: 'Quick calculations!',
      color: 'from-orange-400 to-orange-600',
      points: 30
    },
    {
      id: 'pattern',
      name: 'Pattern Match',
      icon: 'Grid3x3',
      description: 'Follow the sequence!',
      color: 'from-green-400 to-green-600',
      points: 35
    },
    {
      id: 'word-scramble',
      name: 'Word Scramble',
      icon: 'Shuffle',
      description: 'Unscramble words!',
      color: 'from-blue-400 to-blue-600',
      points: 30
    },
    {
      id: 'color-match',
      name: 'Color Match',
      icon: 'Palette',
      description: 'Match the colors!',
      color: 'from-pink-400 to-pink-600',
      points: 25
    }
  ]

  // Helper functions
  const getCurrentQuizQuestions = () => {
    return currentQuizTopic ? currentQuizTopic.questions : []
  }

  // Quiz management functions
  const startQuiz = (topicId) => {
    const topic = quizTopics.find(t => t.id === topicId)
    if (topic) {
      setCurrentQuizTopic(topic)
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setScore(0)
      setStreak(0)
      setHearts(3)
      setQuizMode(true)
      setShowQuizResults(false)
      toast.info(`Starting ${topic.name} Quiz! 📚`, {
        position: "top-center",
        autoClose: 2000,
      })
    }
  }

  const handleQuizComplete = () => {
    const quizQuestions = getCurrentQuizQuestions()
    const totalQuestions = quizQuestions.length
    const accuracy = Math.round((score / (totalQuestions * 15)) * 100) // Assuming average 15 points per question
    
    const results = {
      topic: currentQuizTopic.name,
      totalQuestions,
      correctAnswers: Math.floor(score / 15), // Approximate correct answers
      accuracy,
      totalScore: score,
      skills: [...new Set(quizQuestions.map(q => q.skill))],
      timeSpent: Date.now() // Simple timestamp for now
    }
    
    setQuizResults(results)
    setShowQuizResults(true)
    setQuizMode(false)
    
    // Achievement toasts based on performance
    if (accuracy >= 90) {
      toast.success(`🏆 Perfect! You mastered ${currentQuizTopic.name}!`, {
        position: "top-center",
        autoClose: 3000,
      })
    } else if (accuracy >= 70) {
      toast.success(`🌟 Great job! ${accuracy}% accuracy in ${currentQuizTopic.name}!`, {
        position: "top-center",
        autoClose: 3000,
      })
    } else {
      toast.info(`📚 Keep practicing ${currentQuizTopic.name}! You're improving!`, {
        position: "top-center",
        autoClose: 3000,
      })
    }
  }

  const exitQuiz = () => {
    setQuizMode(false)
    setCurrentQuizTopic(null)
    setShowQuizResults(false)
    setGameMode('math')
    resetGame()
  }

  // Reactive questions based on current mode and state
  const questions = useMemo(() => {
    if (quizMode) {
      return getCurrentQuizQuestions()
    }
    return gameMode === 'math' ? mathQuestions : readingQuestions
  }, [quizMode, currentQuizTopic, gameMode])
// Interactive Stories Data
  const interactiveStories = [
    {
      id: 'forest-adventure',
      title: 'The Magical Forest Adventure',
      description: 'Help Luna find her way through an enchanted forest',
      difficulty: 'Beginner',
      icon: 'TreePine',
      color: 'from-green-400 to-green-600',
      estimatedTime: '10-15 min',
      chapters: [
        {
          id: 0,
          title: 'The Lost Path',
          content: "Luna was walking through the forest when she realized she was lost. The tall trees seemed to whisper secrets, and magical creatures peeked from behind the bushes.",
          character: "Luna",
          dialogue: "Oh no! I don't recognize this part of the forest. Which way should I go?",
          choices: [
            { 
              id: 'left', 
              text: 'Follow the sparkling stream to the left',
              consequence: 'Luna discovers a friendly water fairy who offers help'
            },
            { 
              id: 'right', 
              text: 'Take the rocky path to the right',
              consequence: 'Luna meets a wise old owl who knows the forest well'
            },
            { 
              id: 'straight', 
              text: 'Continue straight through the thick bushes',
              consequence: 'Luna finds a hidden clearing with magical flowers'
            }
          ],
          question: {
            text: "How do you think Luna is feeling right now?",
            options: ["Excited and curious", "Worried and scared", "Angry and frustrated", "Sleepy and tired"],
            correct: 1,
            explanation: "Luna is lost in an unfamiliar place, which would naturally make someone feel worried and scared."
          }
        },
        {
          id: 1,
          title: 'A Helpful Friend',
          content: "Based on her choice, Luna encounters a magical creature willing to help her find her way home.",
          character: "Helper",
          dialogue: "Don't worry, little one! I know these woods like the back of my hand. But first, can you answer my riddle?",
          choices: [
            { 
              id: 'accept', 
              text: 'Accept the challenge eagerly',
              consequence: 'The helper is impressed by Luna\'s bravery'
            },
            { 
              id: 'hesitate', 
              text: 'Ask for a hint first',
              consequence: 'The helper appreciates Luna\'s thoughtfulness'
            },
            { 
              id: 'decline', 
              text: 'Politely ask for directions instead',
              consequence: 'The helper respects Luna\'s honesty'
            }
          ],
          question: {
            text: "What does 'like the back of my hand' mean?",
            options: ["Something is very familiar", "Something looks like a hand", "Something is behind you", "Something is very small"],
            correct: 0,
            explanation: "This phrase means knowing something very well, just like you know your own hand."
          }
        },
        {
          id: 2,
          title: 'The Way Home',
          content: "With the magical creature's help, Luna learns an important lesson about forest safety and finds her way back to the familiar path.",
          character: "Luna",
          dialogue: "Thank you so much! I'll never forget to bring a map next time I explore the forest.",
          choices: [
            { 
              id: 'grateful', 
              text: 'Thank the helper and promise to be more careful',
              consequence: 'Luna gains wisdom and confidence'
            },
            { 
              id: 'excited', 
              text: 'Ask the helper about more forest adventures',
              consequence: 'Luna discovers there are more stories to explore'
            }
          ],
          question: {
            text: "What is the main lesson Luna learned?",
            options: ["Always bring a map when exploring", "Forest creatures are scary", "It's fun to get lost", "Never go outside"],
            correct: 0,
            explanation: "Luna learned the importance of being prepared with a map when exploring new places."
          }
        }
      ]
    },
    {
      id: 'space-mystery',
      title: 'The Space Station Mystery',
      description: 'Detective Zara solves puzzles aboard a space station',
      difficulty: 'Intermediate',
      icon: 'Rocket',
      color: 'from-purple-400 to-purple-600',
      estimatedTime: '15-20 min',
      chapters: [
        {
          id: 0,
          title: 'Strange Signals',
          content: "Detective Zara received an urgent message from the International Space Station. Strange signals were disrupting all communications, and the crew needed her help.",
          character: "Zara",
          dialogue: "These signals form a pattern. If I can decode them, I might discover what's causing the interference.",
          choices: [
            { 
              id: 'computer', 
              text: 'Use the computer to analyze the signal patterns',
              consequence: 'Zara discovers the signals are mathematical sequences'
            },
            { 
              id: 'manual', 
              text: 'Study the signals manually with pencil and paper',
              consequence: 'Zara notices patterns the computer missed'
            },
            { 
              id: 'team', 
              text: 'Ask the space station crew for their observations',
              consequence: 'The crew provides valuable clues about timing'
            }
          ],
          question: {
            text: "What does 'interference' mean in this story?",
            options: ["Helping with something", "Blocking or disrupting something", "Making something louder", "Fixing something broken"],
            correct: 1,
            explanation: "Interference means something that blocks or disrupts normal operations."
          }
        },
        {
          id: 1,
          title: 'The Source',
          content: "Zara's investigation leads her to discover that the signals are coming from a malfunctioning satellite that needs to be repaired.",
          character: "Commander",
          dialogue: "Excellent work, Detective! Now we need to decide how to fix the satellite. What do you recommend?",
          choices: [
            { 
              id: 'spacewalk', 
              text: 'Perform a spacewalk to repair it manually',
              consequence: 'A dramatic but successful repair mission'
            },
            { 
              id: 'remote', 
              text: 'Try to fix it remotely using robotic arms',
              consequence: 'A safer but more complex technical solution'
            },
            { 
              id: 'replace', 
              text: 'Launch a replacement satellite',
              consequence: 'A costly but guaranteed solution'
            }
          ],
          question: {
            text: "Based on the story, what kind of person is Detective Zara?",
            options: ["Lazy and uninterested", "Smart and determined", "Scared and worried", "Angry and impatient"],
            correct: 1,
            explanation: "Zara shows intelligence by solving the mystery and determination by helping the space station."
          }
        },
        {
          id: 2,
          title: 'Mission Success',
          content: "Thanks to Zara's detective work and the crew's teamwork, the space station's communications are restored, and everyone learns about the importance of backup systems.",
          character: "Zara",
          dialogue: "This adventure taught me that even in space, teamwork and careful thinking can solve any problem!",
          choices: [
            { 
              id: 'celebrate', 
              text: 'Celebrate with the crew and share stories',
              consequence: 'Everyone becomes good friends and allies'
            },
            { 
              id: 'document', 
              text: 'Write a detailed report for future missions',
              consequence: 'Zara helps prevent similar problems in the future'
            }
          ],
          question: {
            text: "What is the theme of this story?",
            options: ["Space is dangerous", "Teamwork solves problems", "Technology always fails", "Detectives are smart"],
            correct: 1,
            explanation: "The story shows how working together and thinking carefully can overcome challenges."
          }
        }
      ]
    },
    {
      id: 'underwater-kingdom',
      title: 'The Underwater Kingdom',
      description: 'Marina explores the depths of the ocean kingdom',
      difficulty: 'Advanced',
      icon: 'Fish',
      color: 'from-blue-400 to-blue-600',
      estimatedTime: '20-25 min',
      chapters: [
        {
          id: 0,
          title: 'The Coral Palace',
          content: "Marina, a marine biologist, discovered an ancient underwater kingdom while studying coral reefs. The palace was magnificent, built entirely from living coral and surrounded by colorful fish.",
          character: "Marina",
          dialogue: "This is incredible! But I notice the coral looks unhealthy. I wonder what's causing this environmental problem.",
          choices: [
            { 
              id: 'samples', 
              text: 'Collect water samples to test for pollution',
              consequence: 'Marina discovers chemical contamination from above'
            },
            { 
              id: 'fish', 
              text: 'Observe the fish behavior for clues',
              consequence: 'The fish lead Marina to the source of the problem'
            },
            { 
              id: 'coral', 
              text: 'Examine the coral structure more closely',
              consequence: 'Marina finds signs of rising ocean temperature'
            }
          ],
          question: {
            text: "What is a marine biologist?",
            options: ["Someone who studies ocean life", "Someone who builds boats", "Someone who catches fish", "Someone who cleans beaches"],
            correct: 0,
            explanation: "A marine biologist is a scientist who studies plants and animals that live in the ocean."
          }
        },
        {
          id: 1,
          title: 'The Ocean Guardian',
          content: "Marina meets Nereia, the guardian of the underwater kingdom, who explains that the coral is dying due to pollution from the surface world.",
          character: "Nereia",
          dialogue: "Young scientist, our kingdom has thrived for centuries, but now we face a crisis. Will you help us find a solution?",
          choices: [
            { 
              id: 'research', 
              text: 'Promise to research solutions back on land',
              consequence: 'Marina begins a long-term conservation project'
            },
            { 
              id: 'immediate', 
              text: 'Look for immediate ways to help the coral',
              consequence: 'Marina and Nereia work together on emergency measures'
            },
            { 
              id: 'educate', 
              text: 'Suggest educating people about ocean protection',
              consequence: 'Marina becomes an ambassador for ocean conservation'
            }
          ],
          question: {
            text: "What does 'thrived' mean in this context?",
            options: ["Struggled and failed", "Grown and succeeded", "Stayed the same", "Disappeared completely"],
            correct: 1,
            explanation: "To thrive means to grow successfully and flourish over time."
          }
        },
        {
          id: 2,
          title: 'A New Alliance',
          content: "Marina and Nereia form a partnership between the human and underwater worlds, working together to protect the ocean and educate others about marine conservation.",
          character: "Marina",
          dialogue: "Together, we can make a difference. Science and ancient wisdom combined can heal our oceans.",
          choices: [
            { 
              id: 'foundation', 
              text: 'Start a foundation for ocean protection',
              consequence: 'Marina creates lasting change through organized efforts'
            },
            { 
              id: 'technology', 
              text: 'Develop new technology to clean the oceans',
              consequence: 'Marina invents innovative solutions for marine protection'
            }
          ],
          question: {
            text: "What is the main message of this story?",
            options: ["Oceans are scary places", "Science and cooperation can solve environmental problems", "Fish are more important than people", "Ancient kingdoms are just myths"],
            correct: 1,
            explanation: "The story shows how scientific knowledge and cooperation between different groups can address environmental challenges."
          }
        }
      ]
    }
  ]

  // Story management functions
  const startStory = (storyId) => {
    const story = interactiveStories.find(s => s.id === storyId)
    if (story) {
      setCurrentStory(story)
      setStoryProgress({
        currentChapter: 0,
        choices: [],
        questionsAnswered: 0,
        comprehensionScore: 0
      })
      setSelectedChoice(null)
      setShowStoryResult(false)
      setStoryMode(true)
      setShowStoryResults(false)
      toast.info(`Starting "${story.title}"! 📖`, {
        position: "top-center",
        autoClose: 2000,
      })
    }
  }

  const handleStoryChoice = (choiceId) => {
    if (showStoryResult) return
    setSelectedChoice(choiceId)
  }

  const handleStorySubmit = () => {
    if (!selectedChoice || showStoryResult) return
    
    const currentChapter = currentStory.chapters[storyProgress.currentChapter]
    const selectedChoiceObj = currentChapter.choices.find(c => c.id === selectedChoice)
    
    // Add choice to progress
    const newChoices = [...storyProgress.choices, selectedChoice]
    
    // Show choice consequence
    toast.info(selectedChoiceObj.consequence, {
      position: "top-center",
      autoClose: 3000,
    })
    
    setShowStoryResult(true)
    
    // Move to next chapter or question after delay
    setTimeout(() => {
      if (storyProgress.currentChapter + 1 < currentStory.chapters.length) {
        setStoryProgress(prev => ({
          ...prev,
          currentChapter: prev.currentChapter + 1,
          choices: newChoices
        }))
        setSelectedChoice(null)
        setShowStoryResult(false)
      } else {
        handleStoryComplete()
      }
    }, 2000)
  }

  const handleStoryQuestionSubmit = (answerIndex) => {
    const currentChapter = currentStory.chapters[storyProgress.currentChapter]
    const isCorrect = answerIndex === currentChapter.question.correct
    
    if (isCorrect) {
      const points = 20
      setScore(prev => prev + points)
      setStoryProgress(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        comprehensionScore: prev.comprehensionScore + points
      }))
      toast.success(`Correct! +${points} points! 🎉`, {
        position: "top-center",
        autoClose: 2000,
      })
    } else {
      toast.info(`${currentChapter.question.explanation}`, {
        position: "top-center",
        autoClose: 4000,
      })
    }
  }

  const handleStoryComplete = () => {
    const totalPossibleScore = currentStory.chapters.length * 20
    const accuracy = Math.round((storyProgress.comprehensionScore / totalPossibleScore) * 100)
    
    const results = {
      storyTitle: currentStory.title,
      chaptersCompleted: currentStory.chapters.length,
      questionsAnswered: storyProgress.questionsAnswered,
      comprehensionScore: storyProgress.comprehensionScore,
      accuracy,
      choices: storyProgress.choices,
      totalReadingTime: Date.now() // Simple timestamp
    }
    
    setStoryResults(results)
    setShowStoryResults(true)
    setStoryMode(false)
    
    // Achievement toasts based on comprehension
    if (accuracy >= 90) {
      toast.success(`📚 Excellent reading comprehension! You understood "${currentStory.title}" perfectly!`, {
        position: "top-center",
        autoClose: 3000,
      })
    } else if (accuracy >= 70) {
      toast.success(`🌟 Great job reading "${currentStory.title}"! ${accuracy}% comprehension!`, {
        position: "top-center",
        autoClose: 3000,
      })
    } else {
      toast.info(`📖 Keep reading more stories to improve your comprehension skills!`, {
        position: "top-center",
        autoClose: 3000,
      })
    }
  }

  const exitStory = () => {
    setStoryMode(false)
    setCurrentStory(null)
    setShowStoryResults(false)
    setGameMode('reading')
    resetGame()
  }
const switchMode = (mode) => {
    setGameMode(mode)
    setQuizMode(false)
    setCurrentQuizTopic(null)
    setShowQuizResults(false)
    
    // Reset story-related states when switching modes
    if (mode !== 'stories') {
      setStoryMode(false)
      setCurrentStory(null)
      setShowStoryResults(false)
    }
    
    resetGame()
const modeText = mode === 'math' ? 'Math' : mode === 'reading' ? 'Reading' : mode === 'quiz' ? 'Quiz' : mode === 'stories' ? 'Interactive Stories' : 'Unknown'
    toast.info(`Switched to ${modeText} ${mode === 'stories' ? '' : 'Quest'}! 📚`, {
      position: "top-center",
      autoClose: 2000,
    })
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setStreak(0)
    setHearts(3)
    setShowCelebration(false)
  }

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null || showResult) return
    
    setShowResult(true)
const isCorrect = selectedAnswer === questions?.[currentQuestion]?.correct
    
    if (isCorrect) {
const points = questions?.[currentQuestion]?.points || 10
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      
      // Streak bonus
      if (streak + 1 >= 3) {
        setScore(prev => prev + 50)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
      
      toast.success(`Correct! +${points} points! 🎉`, {
        position: "top-center",
        autoClose: 1500,
      })
    } else {
      setStreak(0)
      setHearts(prev => Math.max(0, prev - 1))
      
      if (hearts <= 1) {
        toast.error("Game Over! Try again! 💪", {
          position: "top-center",
          autoClose: 2000,
        })
        setTimeout(resetGame, 2000)
        return
      }
      
      toast.error("Not quite! Try again! 💭", {
        position: "top-center",
        autoClose: 1500,
      })
    }
    
    // Move to next question after delay
    setTimeout(() => {
if (currentQuestion + 1 >= (questions?.length || 0)) {
        if (quizMode) {
          handleQuizComplete()
        } else {
          toast.success("Level Complete! Great job! 🌟", {
            position: "top-center",
            autoClose: 3000,
          })
          resetGame()
        }
      } else {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      }
    }, 2000)
  }

  const launchMiniGame = (gameId) => {
    setCurrentMiniGame(gameId)
    setShowMiniGameLauncher(false)
  }

  const closeMiniGame = () => {
    setCurrentMiniGame(null)
  }

  const completeMiniGame = (earnedPoints) => {
    setScore(prev => prev + earnedPoints)
    toast.success(`Mini-game complete! +${earnedPoints} bonus points! 🎮`, {
      position: "top-center",
      autoClose: 2000,
    })
    setCurrentMiniGame(null)
  }

  // Memory Card Mini-Game Component
  const MemoryGame = () => {
    const [cards, setCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [matched, setMatched] = useState([])
    const [moves, setMoves] = useState(0)

useEffect(() => {
      const symbols = ['🌟', '🎯', '🚀', '🎨', '🎪', '⚡']
      const gameCards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({ id: index, symbol, flipped: false }))
      setCards(gameCards)
    }, [])

    const handleCardClick = (id) => {
      if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return

      const newFlipped = [...flipped, id]
      setFlipped(newFlipped)

      if (newFlipped.length === 2) {
        setMoves(prev => prev + 1)
        const [first, second] = newFlipped
        if (cards[first].symbol === cards[second].symbol) {
          setMatched(prev => [...prev, first, second])
          setFlipped([])
          if (matched.length + 2 === cards.length) {
            setTimeout(() => completeMiniGame(25 + (10 - moves) * 2), 500)
          }
        } else {
          setTimeout(() => setFlipped([]), 1000)
        }
      }
    }

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-fun">Memory Cards</h3>
        <p className="text-gray-600 mb-4">Moves: {moves}</p>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-2xl font-bold ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? 'bg-white shadow-soft'
                  : 'bg-gradient-to-br from-primary/20 to-primary/40'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={flipped.includes(card.id) ? { rotateY: 180 } : { rotateY: 0 }}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? card.symbol : '?'}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Speed Math Mini-Game Component
  const SpeedMathGame = () => {
    const [problem, setProblem] = useState({ question: '', answer: 0 })
    const [userAnswer, setUserAnswer] = useState('')
    const [timeLeft, setTimeLeft] = useState(30)
    const [correct, setCorrect] = useState(0)

useEffect(() => {
      generateProblem()
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }, [])

useEffect(() => {
      if (timeLeft === 0) {
        completeMiniGame(correct * 5)
      }
    }, [timeLeft])

    const generateProblem = () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      setProblem({ question: `${a} + ${b}`, answer: a + b })
    }

    const handleSubmit = () => {
      if (parseInt(userAnswer) === problem.answer) {
        setCorrect(prev => prev + 1)
        setUserAnswer('')
        generateProblem()
      } else {
        setUserAnswer('')
      }
    }

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-fun">Speed Math</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Time: {timeLeft}s | Correct: {correct}</div>
          <div className="text-3xl font-bold my-4">{problem.question} = ?</div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="border-2 border-primary rounded-xl px-4 py-2 text-xl text-center"
            placeholder="?"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="ml-3 game-button text-lg px-6 py-2"
          >
            Go!
          </button>
        </div>
      </div>
    )
  }

  // Pattern Matching Mini-Game Component
  const PatternGame = () => {
    const [sequence, setSequence] = useState([])
    const [userSequence, setUserSequence] = useState([])
    const [showSequence, setShowSequence] = useState(true)
const [level, setLevel] = useState(1)
    const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0)

const generateSequence = () => {
      const colors = ['red', 'blue', 'green', 'yellow']
      const newSequence = Array.from({ length: level + 2 }, () => 
        colors[Math.floor(Math.random() * colors.length)]
      )
      setSequence(newSequence)
      setUserSequence([])
      setShowSequence(true)
      setCurrentSequenceIndex(0)
      
      // Show each color in sequence with timing
      const showPattern = () => {
        let index = 0
        const interval = setInterval(() => {
          setCurrentSequenceIndex(index)
          index++
          if (index >= newSequence.length) {
            clearInterval(interval)
            setTimeout(() => setShowSequence(false), 800)
          }
        }, 800)
      }
      
      setTimeout(showPattern, 500)
    }

useEffect(() => {
      generateSequence()
    }, [level])


    const handleColorClick = (color) => {
      if (showSequence) return
      const newUserSequence = [...userSequence, color]
      setUserSequence(newUserSequence)

      if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
        // Wrong
        setTimeout(() => {
          setUserSequence([])
          setShowSequence(true)
          setTimeout(() => setShowSequence(false), sequence.length * 800)
        }, 500)
      } else if (newUserSequence.length === sequence.length) {
        // Complete level
        if (level >= 3) {
          completeMiniGame(35 + level * 5)
        } else {
          setLevel(prev => prev + 1)
        }
      }
    }

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-fun">Pattern Match</h3>
        <p className="text-gray-600 mb-4">Level {level} - Watch and repeat!</p>
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {['red', 'blue', 'green', 'yellow'].map((color) => (
            <motion.button
              key={color}
              onClick={() => handleColorClick(color)}
              className={`aspect-square rounded-xl ${
                color === 'red' ? 'bg-red-400' :
                color === 'blue' ? 'bg-blue-400' :
                color === 'green' ? 'bg-green-400' : 'bg-yellow-400'
} ${showSequence && sequence[currentSequenceIndex] === color ? 'animate-glow' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Word Scramble Mini-Game Component
  const WordScrambleGame = () => {
    const words = ['LEARN', 'SMART', 'BRAIN', 'QUEST', 'MAGIC']
    const [currentWord, setCurrentWord] = useState('')
    const [scrambledWord, setScrambledWord] = useState('')
    const [userAnswer, setUserAnswer] = useState('')
    const [wordsCompleted, setWordsCompleted] = useState(0)

    useEffect(() => {
      generateWord()
    }, [])

    const generateWord = () => {
      const word = words[Math.floor(Math.random() * words.length)]
      setCurrentWord(word)
      setScrambledWord(word.split('').sort(() => Math.random() - 0.5).join(''))
      setUserAnswer('')
    }

    const handleSubmit = () => {
      if (userAnswer.toUpperCase() === currentWord) {
        const completed = wordsCompleted + 1
        setWordsCompleted(completed)
        if (completed >= 3) {
          completeMiniGame(30 + completed * 5)
        } else {
          generateWord()
        }
      } else {
        setUserAnswer('')
      }
    }

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-fun">Word Scramble</h3>
        <p className="text-gray-600 mb-4">Words completed: {wordsCompleted}/3</p>
        <div className="text-3xl font-bold mb-4 tracking-widest">{scrambledWord}</div>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="border-2 border-primary rounded-xl px-4 py-2 text-xl text-center mb-4"
          placeholder="Unscramble the word"
          autoFocus
        />
        <br />
        <button onClick={handleSubmit} className="game-button text-lg px-6 py-2">
          Submit
        </button>
      </div>
    )
  }

  // Color Match Mini-Game Component
  const ColorMatchGame = () => {
    const [targetColor, setTargetColor] = useState('')
    const [options, setOptions] = useState([])
    const [score, setGameScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(20)

useEffect(() => {
      generateColors()
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }, [])

useEffect(() => {
      if (timeLeft === 0) {
        completeMiniGame(25 + score * 3)
      }
    }, [timeLeft])

    const generateColors = () => {
      const colors = [
        { name: 'Red', value: 'bg-red-400' },
        { name: 'Blue', value: 'bg-blue-400' },
        { name: 'Green', value: 'bg-green-400' },
        { name: 'Yellow', value: 'bg-yellow-400' },
        { name: 'Purple', value: 'bg-purple-400' },
        { name: 'Pink', value: 'bg-pink-400' }
      ]
      const target = colors[Math.floor(Math.random() * colors.length)]
      setTargetColor(target)
      
      const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4)
      if (!shuffled.find(c => c.name === target.name)) {
        shuffled[0] = target
      }
      setOptions(shuffled.sort(() => Math.random() - 0.5))
    }

    const handleColorClick = (color) => {
      if (color.name === targetColor.name) {
        setGameScore(prev => prev + 1)
        generateColors()
      }
    }

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 font-fun">Color Match</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Time: {timeLeft}s | Score: {score}</div>
          <div className="text-xl font-bold my-4">Find: {targetColor.name}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {options.map((color, index) => (
            <motion.button
              key={index}
              onClick={() => handleColorClick(color)}
              className={`aspect-square rounded-xl ${color.value}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderCurrentMiniGame = () => {
    switch (currentMiniGame) {
      case 'memory': return <MemoryGame />
      case 'speed-math': return <SpeedMathGame />
      case 'pattern': return <PatternGame />
      case 'word-scramble': return <WordScrambleGame />
      case 'color-match': return <ColorMatchGame />
      default: return null
    }
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
<motion.button
          onClick={() => switchMode('quiz')}
          className={`px-6 py-3 rounded-2xl font-bold font-fun text-lg flex items-center gap-3 transition-all duration-300 ${
            gameMode === 'quiz' 
              ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-game' 
              : 'bg-white/80 text-gray-700 hover:bg-purple/10 border-2 border-purple-500/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Brain" className="w-6 h-6" />
          Quiz Mode
        </motion.button>
<motion.button
          onClick={() => switchMode('stories')}
          className={`px-6 py-3 rounded-2xl font-bold font-fun text-lg flex items-center gap-3 transition-all duration-300 ${
            gameMode === 'stories' 
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-game' 
              : 'bg-white/80 text-gray-700 hover:bg-pink/10 border-2 border-pink-500/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Book" className="w-6 h-6" />
          Interactive Stories
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
style={{ width: `${questions?.length ? ((currentQuestion + 1) / questions.length) * 100 : 0}%` }}
              ></div>
            </div>
<div className="text-sm text-gray-500 mt-1">
{questions?.length ? (quizMode ? `Question ${currentQuestion + 1} of ${questions.length}` : `${currentQuestion + 1} / ${questions.length}`) : 'Loading...'}
            </div>
          </div>
        </div>
{/* Mini-Game Launcher in Stats */}
        <div className="mt-6 text-center">
          <motion.button
            onClick={() => setShowMiniGameLauncher(true)}
            className="bg-gradient-to-r from-accent to-yellow-400 text-gray-800 font-bold py-3 px-6 rounded-2xl shadow-achievement hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Gamepad2" className="w-5 h-5" />
              <span className="font-fun">Mini-Games</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

{/* Quiz Topic Selection */}
      {gameMode === 'quiz' && !quizMode && !showQuizResults && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-fun mb-4">🧠 Choose Your Quiz Topic</h2>
            <p className="text-gray-600 text-lg">Select a skill area to test your knowledge!</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizTopics.map((topic) => (
              <motion.button
                key={topic.id}
                onClick={() => startQuiz(topic.id)}
                className={`bg-gradient-to-r ${topic.color} text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <ApperIcon name={topic.icon} className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-fun mb-2">{topic.name}</h3>
                    <p className="text-white/90 text-sm mb-3">{topic.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {topic.questions.length} Questions
                      </span>
                      <ApperIcon name="ArrowRight" className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quiz Results */}
      {showQuizResults && quizResults && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="game-card p-6 sm:p-8 lg:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {quizResults.accuracy >= 90 ? '🏆' : quizResults.accuracy >= 70 ? '🌟' : '📚'}
            </motion.div>
            <h2 className="text-3xl font-bold font-fun mb-2">Quiz Complete!</h2>
            <h3 className="text-xl text-gray-600 mb-6">{quizResults.topic}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 font-fun">{quizResults.correctAnswers}</div>
              <div className="text-blue-800 font-medium">Correct Answers</div>
              <div className="text-sm text-blue-600">out of {quizResults.totalQuestions}</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 font-fun">{quizResults.accuracy}%</div>
              <div className="text-green-800 font-medium">Accuracy</div>
              <div className="text-sm text-green-600">
                {quizResults.accuracy >= 90 ? 'Excellent!' : quizResults.accuracy >= 70 ? 'Good job!' : 'Keep practicing!'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 font-fun">{quizResults.totalScore}</div>
              <div className="text-purple-800 font-medium">Total Points</div>
              <div className="text-sm text-purple-600">Well earned!</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ApperIcon name="Target" className="w-5 h-5 text-primary" />
              Skills Practiced
            </h4>
            <div className="flex flex-wrap gap-2">
              {quizResults.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-secondary/20 to-secondary/30 text-secondary-dark px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => startQuiz(currentQuizTopic?.id)}
              className="game-button text-lg px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="RotateCcw" className="w-5 h-5" />
                Try Again
              </div>
            </motion.button>
            
            <motion.button
              onClick={exitQuiz}
              className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-8 rounded-2xl shadow-game hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Home" className="w-5 h-5" />
                Back to Home
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Story Selection */}
{/* Story Selection */}
      {gameMode === 'stories' && !storyMode && !showStoryResults && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="game-card p-6 sm:p-8 lg:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-fun mb-4">📖 Choose Your Story Adventure</h2>
            <p className="text-gray-600 text-lg">Select an interactive story to enhance your reading skills!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {interactiveStories.map((story) => (
              <motion.button
                key={story.id}
                onClick={() => startStory(story.id)}
                className={`bg-gradient-to-r ${story.color} text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <ApperIcon name={story.icon} className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-fun mb-2">{story.title}</h3>
                    <p className="text-white/90 text-sm mb-3">{story.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {story.difficulty}
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {story.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/80">
                        {story.chapters.length} Chapters
                      </span>
                      <ApperIcon name="ArrowRight" className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Story Results */}
      {showStoryResults && storyResults && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="game-card p-6 sm:p-8 lg:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {storyResults.accuracy >= 90 ? '📚' : storyResults.accuracy >= 70 ? '🌟' : '📖'}
            </motion.div>
            <h2 className="text-3xl font-bold font-fun mb-2">Story Complete!</h2>
            <h3 className="text-xl text-gray-600 mb-6">{storyResults.storyTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 font-fun">{storyResults.chaptersCompleted}</div>
              <div className="text-blue-800 font-medium">Chapters Read</div>
              <div className="text-sm text-blue-600">Complete story journey</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 font-fun">{storyResults.accuracy}%</div>
              <div className="text-green-800 font-medium">Comprehension</div>
              <div className="text-sm text-green-600">
                {storyResults.accuracy >= 90 ? 'Excellent!' : storyResults.accuracy >= 70 ? 'Great job!' : 'Keep reading!'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 font-fun">{storyResults.comprehensionScore}</div>
              <div className="text-purple-800 font-medium">Reading Points</div>
              <div className="text-sm text-purple-600">Well earned!</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
              Story Choices Made
            </h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700">
                You made {storyResults.choices.length} meaningful choices that shaped your story experience.
                Each choice helped develop critical thinking and reading comprehension skills!
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => startStory(currentStory?.id)}
              className="game-button text-lg px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="RotateCcw" className="w-5 h-5" />
                Read Again
              </div>
            </motion.button>
            
            <motion.button
              onClick={exitStory}
              className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-8 rounded-2xl shadow-game hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Home" className="w-5 h-5" />
                Back to Home
              </div>
            </motion.button>
          </div>
        </motion.div>
)}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
className={`game-card p-6 sm:p-8 lg:p-12 relative overflow-hidden ${(gameMode === 'quiz' && !quizMode) || (gameMode === 'stories' && !storyMode) || showQuizResults || showStoryResults || !questions?.length || gameMode === 'stories' ? 'hidden' : ''}`}
      >
{/* Story Mode Interface */}
{storyMode && currentStory && gameMode === 'stories' && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="game-card p-6 sm:p-8 lg:p-12 relative overflow-hidden"
        >
          {/* Story Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-700/20 p-3 rounded-2xl">
                <ApperIcon name="BookOpen" className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-600 font-fun">
                {currentStory.title} - Chapter {storyProgress.currentChapter + 1}
              </h2>
            </div>
            <h3 className="text-xl font-bold text-pink-600 mb-4">
              {currentStory.chapters[storyProgress.currentChapter]?.title}
            </h3>
          </div>

          {/* Story Content */}
          <div className="mb-8 story-text">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <p className="text-gray-800 text-lg leading-relaxed mb-4">
                {currentStory.chapters[storyProgress.currentChapter]?.content}
              </p>
              
              {/* Character Dialogue */}
              <div className="character-dialogue bg-white/80 rounded-xl p-4 border-l-4 border-pink-500">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {currentStory.chapters[storyProgress.currentChapter]?.character[0]}
                    </span>
                  </div>
                  <span className="font-bold text-pink-700">
                    {currentStory.chapters[storyProgress.currentChapter]?.character}
                  </span>
                </div>
                <p className="text-gray-700 italic">
                  "{currentStory.chapters[storyProgress.currentChapter]?.dialogue}"
                </p>
              </div>
            </div>
          </div>

          {/* Story Choices */}
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 text-center">What should happen next?</h4>
            <div className="grid grid-cols-1 gap-4">
              {currentStory.chapters[storyProgress.currentChapter]?.choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  onClick={() => handleStoryChoice(choice.id)}
                  className={`story-choice text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedChoice === choice.id 
                      ? 'border-pink-500 bg-pink-50 shadow-soft' 
                      : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25'
                  }`}
                  disabled={showStoryResult}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={!showStoryResult ? { scale: 1.02 } : {}}
                  whileTap={!showStoryResult ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                      selectedChoice === choice.id 
                        ? 'bg-pink-500 text-white border-pink-500' 
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-fun text-gray-800">{choice.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

{/* Story Question */}
          {currentStory.chapters[storyProgress.currentChapter]?.question && (
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-4 text-center">📚 Comprehension Question</h4>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-6">
                <h5 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {currentStory.chapters[storyProgress.currentChapter].question.text}
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {currentStory.chapters[storyProgress.currentChapter].question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleStoryQuestionSubmit(index)}
                      className="question-option text-left font-medium text-lg p-4 hover:border-blue-400 hover:bg-blue-50"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center font-bold text-blue-600">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-fun text-gray-800">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Think about what you just read in the story to answer this question!
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Story Question */}

          {/* Continue Button */}
          <div className="text-center">
            <motion.button
              onClick={handleStorySubmit}
              disabled={!selectedChoice || showStoryResult}
              className={`game-button text-xl px-8 py-4 ${
                !selectedChoice || showStoryResult 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              }`}
              whileHover={selectedChoice && !showStoryResult ? { scale: 1.05 } : {}}
              whileTap={selectedChoice && !showStoryResult ? { scale: 0.95 } : {}}
            >
              {showStoryResult ? 'Continuing story...' : 'Continue Story'}
            </motion.button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 story-progress">
            <div className="flex justify-center items-center gap-2">
              {currentStory.chapters.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= storyProgress.currentChapter 
                      ? 'bg-pink-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Chapter {storyProgress.currentChapter + 1} of {currentStory.chapters.length}
            </p>
          </div>
</motion.div>
      )}

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
              {quizMode ? `${currentQuizTopic?.name} Quiz` : gameMode === 'math' ? 'Math Challenge' : 'Reading Challenge'}
            </h2>
          </div>
          
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-fun leading-tight">
            {questions?.[currentQuestion]?.question || 'Loading question...'}
          </h3>
        </motion.div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {questions?.[currentQuestion]?.options?.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`question-option text-left font-medium text-lg sm:text-xl p-4 sm:p-6 ${
                selectedAnswer === index ? 'selected' : ''
              } ${
                showResult && index === questions?.[currentQuestion]?.correct ? 'correct' : ''
              } ${
                showResult && selectedAnswer === index && index !== questions?.[currentQuestion]?.correct ? 'incorrect' : ''
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

      {/* Mini-Game Launcher Button */}
      {(currentQuestion > 0 && currentQuestion % 2 === 0) && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-20"
        >
          <motion.button
            onClick={() => setShowMiniGameLauncher(true)}
            className="bg-gradient-to-r from-accent to-yellow-400 text-gray-800 font-bold py-3 px-4 rounded-2xl shadow-achievement animate-bounce-gentle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Gamepad2" className="w-5 h-5" />
              <span className="text-sm font-fun">Brain Break!</span>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Mini-Game Launcher Modal */}
      <AnimatePresence>
        {showMiniGameLauncher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMiniGameLauncher(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-fun mb-2">🎮 Mini-Game Launcher</h2>
                <p className="text-gray-600">Choose a fun brain break activity!</p>
              </div>
              
              <div className="grid gap-3">
                {miniGames.map((game) => (
                  <motion.button
                    key={game.id}
                    onClick={() => launchMiniGame(game.id)}
                    className={`bg-gradient-to-r ${game.color} text-white rounded-2xl p-4 text-left`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <ApperIcon name={game.icon} className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold font-fun">{game.name}</div>
                        <div className="text-sm opacity-90">{game.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-75">Up to</div>
                        <div className="font-bold">{game.points}pts</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                onClick={() => setShowMiniGameLauncher(false)}
                className="w-full mt-4 bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Maybe Later
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini-Game Modal */}
      <AnimatePresence>
        {currentMiniGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-fun">Mini-Game</h2>
                <motion.button
                  onClick={closeMiniGame}
                  className="bg-gray-200 text-gray-600 rounded-full p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>
              
              {renderCurrentMiniGame()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature