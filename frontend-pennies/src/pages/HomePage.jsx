import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, Sparkles, Award, Flame, Star, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { theme } from '@/theme'
import { PennyMascot, PennyTip, Progress } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function HomePage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [pennyMessage, setPennyMessage] = useState(null)
  const [showPennyTip, setShowPennyTip] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real progress data
        const progressResponse = await fetch(`${API_URL}/progress`, { headers: getAuthHeaders() })
        const progressData = await progressResponse.json()
        setProgress(progressData)

        // Mock transaction data (keep mocked for now as we focus on XP target sync)
        setTransactions({
          analysis: {
            good_decisions: 12,
            needs_improvement: 3,
            savings_rate: 22,
          }
        })

        setPennyMessage("Hop to it! Ready to become a money master? 🐸")
      } catch (e) {
        console.error("Failed to fetch data", e)
        setPennyMessage("Hop to it! Ready to become a money master? 🐸")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const dailyProgress = Math.min(((progress?.daily_xp || 0) / (progress?.daily_goal || 50)) * 100, 100)

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-24" data-testid="home-page">
      {/* Penny Welcome */}
      <PennyMascot
        message={pennyMessage || "Hey there! Ready to become a money master? 🐸"}
        size="medium"
        mood="happy"
      />

      {/* Daily Goal Progress */}
      <div className="card-3d p-6 border-4 border-gray-200" data-testid="daily-goal-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700">Daily Goal</h3>
          <span className="text-sm font-bold text-emerald-500">{progress?.daily_xp || 0} / {progress?.daily_goal || 50} XP</span>
        </div>
        <Progress value={dailyProgress} className="mb-3" />
        {dailyProgress >= 100 && (
          <p className="text-sm text-emerald-500 font-bold mt-2">🎉 Toad-ally crushed it!</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/learn')}
          className="card-3d p-6 border-4 border-gray-200 hover:scale-105 transition-transform flex flex-col items-center gap-2"
          data-testid="continue-learning-btn"
        >
          <BookOpen size={32} className="text-emerald-500" />
          <span className="font-bold text-gray-700 text-sm text-center">Continue Learning</span>
          <span className="text-xs text-gray-500">{progress?.completed_lessons?.length || 0} done</span>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="card-3d p-6 border-4 border-gray-200 hover:scale-105 transition-transform flex flex-col items-center gap-2"
          data-testid="daily-challenge-btn"
        >
          <Calendar size={32} className="text-orange-500" />
          <span className="font-bold text-gray-700 text-sm text-center">Dashboard</span>
          <span className="text-xs text-gray-500">View stats</span>
        </button>
      </div>

      {/* Ask Penny Button */}
      <button
        onClick={() => setShowPennyTip(true)}
        className="w-full card-3d p-4 border-4 border-gray-200 hover:scale-105 transition-transform flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
        data-testid="ask-penny-btn"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl">
          🐸
        </div>
        <div className="flex-1 text-left">
          <span className="font-bold text-gray-700 block">Ask Penny for a Tip</span>
          <span className="text-xs text-gray-500">Get personalized money advice!</span>
        </div>
        <Sparkles size={20} className="text-yellow-500" />
      </button>

      {showPennyTip && <PennyTip onClose={() => setShowPennyTip(false)} />}

      {/* Transaction Analysis */}
      {transactions && (
        <div className="card-3d p-6 border-4 border-gray-200" data-testid="transactions-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700">Your Spending Habits</h3>
            <button
              onClick={() => navigate('/spending')}
              className="text-emerald-500 text-sm font-bold flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                <ArrowUp size={18} />
                <span className="text-lg font-bold">{transactions.analysis.good_decisions}</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">Good Choices</span>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                <ArrowDown size={18} />
                <span className="text-lg font-bold">{transactions.analysis.needs_improvement}</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">Can Improve</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Savings Rate</span>
              <span className="text-lg font-bold text-emerald-500">{transactions.analysis.savings_rate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-yellow-50 rounded-2xl p-4 text-center card-3d border-4 border-gray-200">
          <Star size={24} className="text-yellow-500 mx-auto mb-1" />
          <span className="block text-xl font-bold text-gray-800">{progress?.xp || 0}</span>
          <span className="text-xs text-gray-500 font-medium">Total XP</span>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center card-3d border-4 border-gray-200">
          <Flame size={24} className="text-orange-500 mx-auto mb-1" />
          <span className="block text-xl font-bold text-gray-800">{progress?.streak || 0}</span>
          <span className="text-xs text-gray-500 font-medium">Day Streak</span>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center card-3d border-4 border-gray-200">
          <Award size={24} className="text-purple-500 mx-auto mb-1" />
          <span className="block text-xl font-bold text-gray-800">{progress?.badges?.length || 0}</span>
          <span className="text-xs text-gray-500 font-medium">Badges</span>
        </div>
      </div>
    </div>
  )
}
