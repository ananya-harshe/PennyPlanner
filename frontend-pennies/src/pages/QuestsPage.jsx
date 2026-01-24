import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot, Progress } from '@/components/PennyComponents'

const QUEST_TEMPLATES = [
  {
    title: 'Daily Budget Review',
    description: 'Review your spending and categorize today\'s expenses',
    reward: 50,
    difficulty: 'Easy',
    category: 'Budgeting',
  },
  {
    title: 'Track Your Savings',
    description: 'Log how much you saved this week',
    reward: 100,
    difficulty: 'Easy',
    category: 'Saving',
  },
  {
    title: 'Plan Monthly Budget',
    description: 'Create a 50/30/20 budget for next month',
    reward: 250,
    difficulty: 'Medium',
    category: 'Budgeting',
  },
  {
    title: 'Save $500',
    description: 'Build an emergency fund of $500',
    reward: 500,
    difficulty: 'Medium',
    category: 'Saving',
  },
  {
    title: 'Pay Off Credit Card',
    description: 'Complete payment on one credit card',
    reward: 750,
    difficulty: 'Hard',
    category: 'Debt Management',
  },
  {
    title: 'Start Investing',
    description: 'Open investment account and make first trade',
    reward: 1000,
    difficulty: 'Hard',
    category: 'Investing',
  },
]

export default function QuestsPage() {
  const [quests, setQuests] = useState([])


  useEffect(() => {
    generateNewQuests()
  }, [])

  const generateNewQuests = () => {
    const shuffled = QUEST_TEMPLATES.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 3).map((q, i) => ({
      id: `${Date.now()}-${i}`,
      ...q,
      completed: false,
      progress: 0,
    }))
    setQuests(selected)
  }

  const handleCompleteQuest = (questId) => {
    const quest = quests.find(q => q.id === questId)
    setQuests(quests.map(q =>
      q.id === questId ? { ...q, completed: true, progress: 100 } : q
    ))
    toast.success(`🎉 +${quest.reward} rewards earned!`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300'
      case 'Medium':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const totalRewards = quests.reduce((sum, q) => sum + (q.completed ? q.reward : 0), 0)
  const completedCount = quests.filter(q => q.completed).length
  const inProgressCount = quests.filter(q => !q.completed).length

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-24">
      <PennyMascot message="Quest time! Choose one to earn rewards 🚀" size="medium" animate />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-4 my-6">
        <div className="card-3d bg-gradient-to-br from-purple-100 to-purple-50 p-4 text-center">
          <div className="text-purple-600 font-bold text-xl">{completedCount}</div>
          <div className="text-gray-600 text-xs">Completed</div>
        </div>
        <div className="card-3d bg-gradient-to-br from-orange-100 to-orange-50 p-4 text-center">
          <div className="text-orange-600 font-bold text-xl">${totalRewards}</div>
          <div className="text-gray-600 text-xs">Total Rewards</div>
        </div>
        <div className="card-3d bg-gradient-to-br from-emerald-100 to-emerald-50 p-4 text-center">
          <div className="text-emerald-600 font-bold text-xl">{inProgressCount}</div>
          <div className="text-gray-600 text-xs">In Progress</div>
        </div>
      </div>

      {/* Generate New Quests Button */}
      <div className="px-4 mb-4">
        <button
          onClick={generateNewQuests}
          className="w-full btn-3d-green text-white font-bold py-3 rounded-2xl"
        >
          🎲 Generate New Quests
        </button>
      </div>

      {/* Quests List */}
      <div className="px-4 space-y-4">
        {quests.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">Loading quests...</p>
          </div>
        ) : (
          quests.map(quest => (
            <div
              key={quest.id}
              className={`card-3d p-4 border-4 border-gray-200 transition-opacity ${
                quest.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{quest.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg border-2 whitespace-nowrap ${getDifficultyColor(
                    quest.difficulty
                  )}`}
                >
                  {quest.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-600 font-bold">{quest.category}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-800">${quest.reward}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Progress value={quest.progress} className="flex-1" />
                <button
                  onClick={() => handleCompleteQuest(quest.id)}
                  disabled={quest.completed}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    quest.completed
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'btn-3d-green text-white'
                  }`}
                >
                  {quest.completed ? '✓ Done' : 'Start'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
