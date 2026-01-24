import React, { useState, useEffect } from 'react'
import { Star, Swords, Zap, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import { PennyMascot } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'
import QuestCompletionAnimation from '@/components/QuestCompletionAnimation'

// Multi-step Quiz Modal for Quest
const QuestQuizModal = ({ quest, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  // Ensure quest.questions exists and use it
  const questions = quest.questions || []
  const currentQuestion = questions[currentStep]

  // Safety check
  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6">
          <p>Error: Invalid quest data. Please refresh quests.</p>
          <button onClick={onClose} className="mt-4 btn-3d-green w-full">Close</button>
        </div>
      </div>
    )
  }

  const handleCheckAnswer = () => {
    if (selectedOption === null) return

    const correct = selectedOption === currentQuestion.correct_answer
    setIsCorrect(correct)
    setSubmitted(true)
  }

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      // Next question
      setCurrentStep(prev => prev + 1)
      setSelectedOption(null)
      setSubmitted(false)
      setIsCorrect(null)
    } else {
      // Finish Quest - Immediate Close to prevent double-clicks
      onClose();

      try {
        const response = await fetch(`${API_URL}/quests/${quest._id}/complete`, {
          method: 'POST',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
        })
        const result = await response.json()

        if (result.success) {
          onComplete(result)
        } else {
          // If it failed but we closed the modal, show the error toast
          toast.error(result.message)
        }
      } catch (e) {
        toast.error("Failed to complete quest")
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-md w-full animate-bounce-in" onClick={e => e.stopPropagation()}>

        {/* Header with Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-gray-800">{quest.title}</h3>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Question {currentStep + 1} of {questions.length}
            </span>
          </div>
          {/* Simple Step Dots */}
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-100 mb-4">
          <p className="font-bold text-gray-800">{currentQuestion.question}</p>
        </div>

        <div className="space-y-2 mb-6">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !submitted && setSelectedOption(idx)}
              disabled={submitted}
              className={`w-full p-3 rounded-xl text-left text-sm font-semibold border-2 transition-all
                        ${submitted && isCorrect && idx === currentQuestion.correct_answer ? 'bg-green-100 border-green-500 text-green-700' : ''}
                        ${submitted && !isCorrect && idx === selectedOption ? 'bg-red-100 border-red-500 text-red-700' : ''}
                        ${!submitted && selectedOption === idx ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 hover:border-indigo-300'}
                    `}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className={`text-center font-black p-3 rounded-xl mb-4 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
          </div>
        )}

        {submitted && isCorrect && (
          <div className="text-xs text-gray-500 mb-4 p-3 bg-gray-50 rounded-xl">
            <span className="font-bold">Explanation:</span> {currentQuestion.explanation}
          </div>
        )}

        {/* Action Buttons */}
        {!submitted ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className="w-full py-3 bg-emerald-500 text-white font-black rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            Check Answer
          </button>
        ) : (
          isCorrect ? (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-colors animate-pulse"
            >
              {currentStep < questions.length - 1 ? 'Next Question →' : 'Complete Quest! 🏆'}
            </button>
          ) : (
            <button
              onClick={() => {
                setSubmitted(false)
                setIsCorrect(null)
                setSelectedOption(null)
              }}
              className="w-full py-3 bg-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-300"
            >
              Try Again
            </button>
          )
        )}
      </div>
    </div>
  )
}

import { useAuth } from '@/store/authContext'

export default function QuestsPage() {
  const { questsData, setQuestsData, refreshUser } = useAuth()

  // Initialize state from cache if available
  const [quests, setQuests] = useState(questsData?.quests || [])
  const [loading, setLoading] = useState(!questsData)
  const [activeQuest, setActiveQuest] = useState(null)
  const [learningStats, setLearningStats] = useState(questsData?.learningStats || [])
  const [totalXP, setTotalXP] = useState(questsData?.totalXP || 0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [gainedXP, setGainedXP] = useState(0)

  useEffect(() => {
    // Determine if we need to fetch new data
    const shouldFetch = !questsData || quests.length === 0

    if (shouldFetch) {
      fetchQuests()
    }
  }, [])

  const fetchQuests = async () => {
    try {
      setLoading(true)

      // Parallel fetch for quests and progress
      const [questsResponse, progressResponse] = await Promise.all([
        fetch(`${API_URL}/quests`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/progress`, { headers: getAuthHeaders() })
      ])

      const questsDataNew = await questsResponse.json()
      const progressData = await progressResponse.json()

      // Process Quests - only update if different or empty? 
      // Actually backend generates on GET usually? 
      // If we just got them, set them.
      setQuests(questsDataNew)
      setTotalXP(progressData.xp || 0)

      // Process XP history
      const history = progressData.xp_history || []
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
        const found = history.find(h => h.date === dateStr)
        last7Days.push({
          name: dayName,
          xp: found ? found.xp : 0
        })
      }
      setLearningStats(last7Days)

      // Update Cache
      setQuestsData({
        quests: questsDataNew,
        totalXP: progressData.xp || 0,
        learningStats: last7Days
      })

    } catch (error) {
      console.error("Failed to fetch data", error)
      toast.error("Failed to load quests")
    } finally {
      setLoading(false)
    }
  }

  const handleQuestComplete = (result) => {
    // toast.success(`Quest Complete! +${result.xp_earned} XP`)
    setActiveQuest(null)
    setGainedXP(result.xp_earned)
    setShowAnimation(true)

    // Update local state immediately
    const newTotalXP = totalXP + result.xp_earned
    setTotalXP(newTotalXP)

    // Remove completed quest
    const updatedQuests = quests.filter(q => q._id !== activeQuest._id)
    setQuests(updatedQuests)

    // Update Cache
    setQuestsData(prev => ({
      ...prev,
      quests: updatedQuests,
      totalXP: newTotalXP
    }))

    // Trigger regeneration ONLY if NO quests left
    // MOVED: Now handled in handleAnimationComplete so we don't show loading spinner over the animation
    /*
    if (updatedQuests.length === 0) {
      fetchQuests()
    }
    */

    // Sync XP with global user state (Sidebar)
    refreshUser();
  }

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    // If we have no quests left (meaning we just completed the last one), generate more now
    if (quests.length === 0) {
      fetchQuests();
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-24 gap-4">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Generating your financial challenges... 🐸</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8 lg:px-10 space-y-6 pb-24 lg:pb-8">
      {activeQuest && (
        <QuestQuizModal
          quest={activeQuest}
          onClose={() => setActiveQuest(null)}
          onComplete={handleQuestComplete}
        />
      )}

      <PennyMascot
        message="Master your money with these interactive challenges! 🏆"
        size="medium"
        animate
      />

      <div className="px-4 mt-6 mb-4">
        {/* Learning Activity Graph */}
        <div className="card-3d p-6 border-4 border-indigo-200 mb-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 rounded-2xl p-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">Learning Activity</h3>
                <p className="text-sm text-gray-500 font-bold">Total XP: {totalXP}</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningStats}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorXp)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Swords className="text-red-500" />
            Active Quests
          </h2>
          <span className="text-xs font-bold bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
            {quests.length} Remaining
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {quests.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-3xl border-4 border-gray-100">
            <p className="text-gray-500 font-bold mb-4">All quests completed! 🎉</p>
            <button
              onClick={fetchQuests}
              className="px-6 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Generate New Batch
            </button>
          </div>
        ) : (
          quests.map(quest => (
            <div key={quest._id} className="card-3d p-5 border-4 border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg
                            ${quest.type === 'Spending Slayer' ? 'bg-red-100 text-red-600' :
                    quest.type === 'Asset Builder' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'}
                        `}>
                  {quest.type}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-700">{quest.xp_reward} XP</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-gray-800 mb-1">{quest.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{quest.description}</p>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                <p className="text-xs text-gray-500 font-bold mb-1">Penny's Reason:</p>
                <p className="text-xs text-gray-500 italic">"{quest.generated_reason}"</p>
              </div>

              <button
                onClick={() => setActiveQuest(quest)}
                className="w-full py-3 btn-3d-green text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                Start Quest (4 Questions)
              </button>
            </div>
          ))
        )}
      </div>

      {/* Animation Overlay */}
      {showAnimation && (
        <QuestCompletionAnimation
          xpGained={gainedXP}
          onComplete={handleAnimationComplete}
        />
      )}
    </div>
  )
}
