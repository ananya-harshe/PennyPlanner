import React, { useState, useEffect } from 'react'
import { Star, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot, Progress } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function QuestsPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState([])

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/lessons`, {
        headers: getAuthHeaders()
      })
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      toast.error('Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  const handleStartLesson = async (lessonId) => {
    try {
      // Try to get the quiz for this lesson
      const response = await fetch(`${API_URL}/quiz/${lessonId}`, {
        headers: getAuthHeaders()
      })
      const quiz = await response.json()
      
      if (quiz && quiz.questions) {
        toast.success(`🎓 Started lesson! ${quiz.questions.length} questions to answer`)
        setCompletedLessons([...completedLessons, lessonId])
      }
    } catch (error) {
      console.error('Failed to start lesson:', error)
      toast.error('Failed to start lesson')
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'budgeting':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'investing':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'credit':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const completedCount = completedLessons.length
  const totalXP = completedCount * 50

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-24">
      <PennyMascot message="Learn and earn XP with lessons! 📚" size="medium" animate />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-4 my-6">
        <div className="card-3d bg-gradient-to-br from-purple-100 to-purple-50 p-4 text-center">
          <div className="text-purple-600 font-bold text-xl">{completedCount}</div>
          <div className="text-gray-600 text-xs">Completed</div>
        </div>
        <div className="card-3d bg-gradient-to-br from-orange-100 to-orange-50 p-4 text-center">
          <div className="text-orange-600 font-bold text-xl">{totalXP}</div>
          <div className="text-gray-600 text-xs">Total XP</div>
        </div>
        <div className="card-3d bg-gradient-to-br from-emerald-100 to-emerald-50 p-4 text-center">
          <div className="text-emerald-600 font-bold text-xl">{lessons.length}</div>
          <div className="text-gray-600 text-xs">Lessons</div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="px-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">No lessons available</p>
          </div>
        ) : (
          lessons.map(lesson => (
            <div
              key={lesson.id}
              className={`card-3d p-4 border-4 border-gray-200 transition-opacity ${
                completedLessons.includes(lesson.id) ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">{lesson.icon || '📖'}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                </div>
                {lesson.is_locked && (
                  <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-lg">
                    🔒 Locked
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg border-2 ${getCategoryColor(
                    lesson.category
                  )}`}
                >
                  {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                </span>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-800">{lesson.xp_reward || 50} XP</span>
                </div>
              </div>

              <button
                onClick={() => handleStartLesson(lesson.id)}
                disabled={lesson.is_locked || completedLessons.includes(lesson.id)}
                className={`w-full px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  completedLessons.includes(lesson.id)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : lesson.is_locked
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'btn-3d-green text-white'
                }`}
              >
                {completedLessons.includes(lesson.id) ? '✓ Completed' : lesson.is_locked ? '🔒 Locked' : 'Start Lesson'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
