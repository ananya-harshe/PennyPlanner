import React from 'react'
import { API_URL, getAuthHeaders } from '@/api/client'
import Penny from '@/assets/Penny.png'
import SadPenny from '@/assets/SadPenny.png'
import SurprisedPenny from '@/assets/SurprisedPenny.png'
import ScholarlyPenny from '@/assets/ScholarlyPenny.png'
import TalkingPenny from '@/assets/TalkingPenny.png'
import ThinkingPenny from '@/assets/ThinkingPenny.png'
import PomPomPenny from '@/assets/Pom Pom Penny.png'

export const PennyMascot = ({ message, size = 'medium', mood = 'happy', showBubble = true, animate = true }) => {
  const sizes = {
    small: 'w-12 h-12 text-xl',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-24 h-24 text-4xl'
  }

  const moodImages = {
    happy: Penny,
    excited: Penny,
    thinking: ThinkingPenny,
    celebrating: Penny,
    encouraging: Penny,
    sad: SadPenny,
    surprised: SurprisedPenny,
    scholarly: ScholarlyPenny,
    talking: TalkingPenny,
    pompom: PomPomPenny
  }

  const currentImage = moodImages[mood] || Penny // Fallback

  // Shake animation for sad/surprised
  const isNegative = mood === 'sad' || mood === 'surprised'
  const animationClass = isNegative ? 'animate-shake' : (animate ? 'animate-float' : '')

  return (
    <div className={`flex items-start gap-3 ${animate ? 'animate-slide-up' : ''}`} data-testid="penny-mascot">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0 ${animationClass} overflow-hidden border-2 border-white`}>
        <img src={currentImage} alt={`Penny ${mood}`} className="w-full h-full object-cover" />
      </div>
      {showBubble && message && (
        <div className="speech-bubble flex-1 bg-green-50 border-2 border-green-200 rounded-2xl p-3">
          <div className="text-gray-700 font-medium text-sm">
            {message}
          </div>
        </div>
      )}
    </div>
  )
}

export const PennyTip = ({ onClose }) => {
  const [tip, setTip] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTip = async () => {
      try {
        const response = await fetch(`${API_URL}/penny/tip`, {
          headers: getAuthHeaders()
        })
        const data = await response.json()
        setTip(data.tip || "Try the 24-hour rule before making purchases! 🐸")
      } catch (e) {
        console.error('Failed to fetch tip:', e)
        // Fallback tips if API fails
        const tips = [
          "Try the 24-hour rule before making purchases!",
          "The 50/30/20 budgeting rule is a great start!",
          "Automate your savings for consistent growth!",
          "Track every penny to understand your spending!",
          "Start with small goals and build from there!",
        ]
        setTip(tips[Math.floor(Math.random() * tips.length)])
      } finally {
        setLoading(false)
      }
    }
    fetchTip()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-bounce-in">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl animate-pulse overflow-hidden border-4 border-white">
              <img src={Penny} alt="Penny" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-center text-gray-500">Penny is thinking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl animate-float overflow-hidden border-4 border-white">
            <img src={TalkingPenny} alt="Penny" className="w-full h-full object-cover" />
          </div>
        </div>
        <h3 className="text-xl font-extrabold text-center text-gray-800 mb-3">
          Penny's Tip!
        </h3>
        <p className="text-gray-600 text-center mb-6">
          {tip}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-500 text-white font-black rounded-2xl px-6 border-b-4 border-emerald-700 hover:bg-emerald-600 active:translate-y-1 active:border-b-2 transition-all"
          data-testid="close-penny-tip"
        >
          Thanks, Penny!
        </button>
      </div>
    </div>
  )
}

export const Progress = ({ value, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}
