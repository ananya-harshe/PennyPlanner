import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, Sparkles, Award, Flame, Star, ChevronRight, ArrowUp, ArrowDown, Target } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { theme } from '@/theme'
import { PennyMascot, PennyTip, Progress } from '@/components/PennyComponents'
import StreakAnimation from '@/components/StreakAnimation'
import { API_URL, getAuthHeaders } from '@/api/client'

import { useAuth } from '@/store/authContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { homeData, setHomeData, goalsData } = useAuth()
  const [progress, setProgress] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [pennyMessage, setPennyMessage] = useState(null)
  const [showPennyTip, setShowPennyTip] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showStreakAnim, setShowStreakAnim] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // Use cached data if available
      if (homeData) {
        setProgress(homeData.progress)
        setTransactions(homeData.transactions)
        setPennyMessage(homeData.message)
        // Check animation even with cache? Only if flag set, which is handled below.
        // Actually we need to check flag logic below too.
        // But for loading state, we can skip fetch.
        // However, we still need to check the streak flag logic.

        // Streak Logic with Cache:
        // Cache might have outdated streak if user just logged in? No, cache is cleared on logout.
        // But if user plays a while, streak updates?
        // Let's assume on mount after login, cache is empty, so we fetch.
        // If user returns to Home, cache exists. Animation flag was removed.
        setLoading(false)
      } else {
        // Fetch Fresh
        try {
          const [progressResponse, analysisResponse] = await Promise.all([
            fetch(`${API_URL}/progress`, { headers: getAuthHeaders() }),
            fetch(`${API_URL}/transactions/analysis`, { headers: getAuthHeaders() })
          ])

          const progressData = await progressResponse.json()
          const analysisData = await analysisResponse.json()

          // Update State
          setProgress(progressData)
          setTransactions({ analysis: analysisData.stats })
          setPennyMessage("Hop to it! Ready to become a money master? 🐸")

          // Update Cache
          setHomeData({
            progress: progressData,
            transactions: { analysis: analysisData.stats },
            message: "Hop to it! Ready to become a money master? 🐸"
          })

          // Animation Logic (Fresh Fetch Only usually, or check every time? 
          // Flag is in SessionStorage set by Login.
          // If we have cache, we skipped fetching, but streak info IS in cache now.
          // We should check flag regardless of cache source.
        } catch (e) {
          console.error("Failed to fetch data", e)
          setPennyMessage("Hop to it! Ready to become a money master? 🐸")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [])

  // Ref to ensure we only check for animation once per mount to prevent double-firing
  const hasCheckedStreak = React.useRef(false)

  // Separate effect for Animation Trigger to handle both Cache/NoCache scenarios cleanly
  useEffect(() => {
    if (hasCheckedStreak.current) return;

    // Check session flag immediately
    const shouldShowStreak = sessionStorage.getItem('showStreak')

    // We only want to trigger if we actually HAVE data to show.
    // However, waiting for data might cause double-check if dependencies change.
    // So we check: if flag exists, and we have SOME data (progress or cache), we trigger.
    const currentStreak = progress?.streak || homeData?.progress?.streak || 0

    if (shouldShowStreak && currentStreak > 0) {
      setShowStreakAnim(true)
      sessionStorage.removeItem('showStreak')
      hasCheckedStreak.current = true; // Lock it
    } else if (shouldShowStreak && !progress && !homeData) {
      // Data not ready yet? Wait.
      // Do NOT set checked=true yet.
    } else {
      // If flag is missing, OR if we have data but streak is 0, we're done checking.
      if (!shouldShowStreak) {
        hasCheckedStreak.current = true;
      }
    }
  }, [progress, homeData]) // Depend on data availability

  const dailyProgress = Math.min(((progress?.daily_xp || 0) / (progress?.daily_goal || 50)) * 100, 100)
  const currentStreak = progress?.streak || homeData?.progress?.streak || 0

  return (
    <div className="p-4 lg:p-8 lg:px-10 space-y-6 pb-24 lg:pb-8 min-h-screen bg-transparent" data-testid="home-page">
      {/* Streak Animation Overlay - Render even if loading */}
      {showStreakAnim && (
        <StreakAnimation
          streak={currentStreak}
          onComplete={() => setShowStreakAnim(false)}
        />
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
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

          {/* Top Goal Widget */}
          {goalsData && goalsData.length > 0 && (
            (() => {
              // Find top priority goal (highest progress but not 100%) or just first one
              const topGoal = goalsData.filter(g => g.current_amount < g.target_amount).sort((a, b) => (b.current_amount / b.target_amount) - (a.current_amount / a.target_amount))[0] || goalsData[0];
              const pct = Math.min((topGoal.current_amount / topGoal.target_amount) * 100, 100);

              return (
                <div className="card-3d p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-xl transform rotate-1 hover:rotate-0 transition-transform cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <Target size={16} />
                      </div>
                      <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Top Goal</span>
                    </div>
                    <span className="font-black text-white">{Math.round(pct)}%</span>
                  </div>
                  <h3 className="font-black text-lg mb-1">{topGoal.title}</h3>
                  <p className="text-indigo-100 text-xs font-bold mb-3">${topGoal.current_amount} / ${topGoal.target_amount}</p>
                  <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-indigo-200 mt-2 text-right">Keep it up! 🚀</p>
                </div>
              )
            })()
          )}

          {/* Quick Actions */}
          <div className="w-full">
            <button
              onClick={() => navigate('/quests')}
              className="w-full card-3d p-6 border-4 border-gray-200 hover:scale-105 transition-transform flex flex-col items-center gap-2"
              data-testid="daily-quests-btn"
            >
              <BookOpen size={32} className="text-emerald-500" />
              <span className="font-bold text-gray-700 text-sm text-center">Daily Quests</span>
              <span className="text-xs text-gray-500">{progress?.completed_lessons?.length || 0} done</span>
            </button>
          </div>
        </>
      )}

      {!loading && (
        <>
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
                  onClick={() => navigate('/dashboard')}
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
              <span className="block text-xl font-bold text-gray-800">{currentStreak}</span>
              <span className="text-xs text-gray-500 font-medium">Day Streak</span>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 text-center card-3d border-4 border-gray-200">
              <Award size={24} className="text-purple-500 mx-auto mb-1" />
              <span className="block text-xl font-bold text-gray-800">{progress?.badges?.length || 0}</span>
              <span className="text-xs text-gray-500 font-medium">Badges</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
