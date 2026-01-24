import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, ChevronRight, ArrowLeft, Play } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot, Progress } from '@/components/PennyComponents'
import QuizScreen from '@/components/QuizScreen'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function LearningPage() {
    const navigate = useNavigate()
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [completedLessons, setCompletedLessons] = useState([])
    const [activeQuiz, setActiveQuiz] = useState(null)
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

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

            // Find the first uncompleted lesson
            const firstUncompleted = data.findIndex(lesson =>
                !lesson.is_locked && !completedLessons.includes(lesson.id)
            )
            if (firstUncompleted >= 0) {
                setCurrentLessonIndex(firstUncompleted)
            }
        } catch (error) {
            console.error('Failed to fetch lessons:', error)
            toast.error('Failed to load lessons')
        } finally {
            setLoading(false)
        }
    }

    const handleStartLesson = (lesson) => {
        if (lesson.is_locked) {
            toast.error('Complete previous lessons to unlock this one!')
            return
        }

        setActiveQuiz({
            lessonId: lesson.id,
            lessonTitle: lesson.title
        })
    }

    const handleQuizComplete = (result) => {
        if (result.passed) {
            setCompletedLessons(prev => [...prev, activeQuiz.lessonId])
            toast.success(`🎉 Lesson completed! +${Math.round(result.score / result.total * 100)} XP`)

            // Move to next lesson
            const nextIndex = lessons.findIndex(l => l.id === activeQuiz.lessonId) + 1
            if (nextIndex < lessons.length && !lessons[nextIndex].is_locked) {
                setCurrentLessonIndex(nextIndex)
            }
        }
        setActiveQuiz(null)
    }

    const currentLesson = lessons[currentLessonIndex]
    const completedCount = completedLessons.length
    const totalXP = completedCount * 50

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 pt-24 pb-24">
                <div className="space-y-4">
                    <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
                    <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8 lg:px-10 space-y-6 pb-24 lg:pb-8">
            {/* Quiz Modal */}
            {activeQuiz && (
                <QuizScreen
                    lessonId={activeQuiz.lessonId}
                    lessonTitle={activeQuiz.lessonTitle}
                    onClose={() => setActiveQuiz(null)}
                    onComplete={handleQuizComplete}
                />
            )}

            <PennyMascot
                message="Ready to learn something new? Let's go! 📚"
                size="medium"
                animate
            />

            {/* Progress Overview */}
            <div className="px-4 my-6">
                <div className="card-3d bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-black">Your Progress</h2>
                            <p className="text-emerald-100 text-sm">Keep learning to earn XP!</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black">{completedCount}/{lessons.length}</div>
                            <div className="text-emerald-100 text-sm">Lessons</div>
                        </div>
                    </div>
                    <Progress
                        value={(completedCount / Math.max(lessons.length, 1)) * 100}
                        className="h-3 bg-emerald-400"
                    />
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-300" />
                            <span className="font-bold">{totalXP} XP earned</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Lesson Card */}
            {currentLesson && !completedLessons.includes(currentLesson.id) && (
                <div className="px-4 mb-6">
                    <h3 className="text-lg font-black text-gray-800 mb-3">Continue Learning</h3>
                    <div className="card-3d p-6 border-4 border-emerald-300 bg-gradient-to-br from-white to-emerald-50">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl">
                                {currentLesson.icon || '📖'}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-black text-gray-800">{currentLesson.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{currentLesson.description}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-bold text-gray-700">
                                        {currentLesson.xp_reward || 50} XP
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleStartLesson(currentLesson)}
                            className="w-full mt-4 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-colors flex items-center justify-center gap-2 border-b-4 border-emerald-700"
                        >
                            <Play className="w-5 h-5" />
                            Start Learning
                        </button>
                    </div>
                </div>
            )}

            {/* All Lessons */}
            <div className="px-4">
                <h3 className="text-lg font-black text-gray-800 mb-3">All Lessons</h3>
                <div className="space-y-3">
                    {lessons.map((lesson, index) => {
                        const isCompleted = completedLessons.includes(lesson.id)
                        const isCurrent = index === currentLessonIndex && !isCompleted

                        return (
                            <div
                                key={lesson.id}
                                className={`card-3d p-4 border-4 transition-all ${isCompleted
                                    ? 'border-green-300 bg-green-50 opacity-75'
                                    : isCurrent
                                        ? 'border-emerald-400 bg-emerald-50'
                                        : lesson.is_locked
                                            ? 'border-gray-200 opacity-60'
                                            : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isCompleted ? 'bg-green-200' : 'bg-gray-100'
                                        }`}>
                                        {isCompleted ? '✅' : lesson.is_locked ? '🔒' : (lesson.icon || '📖')}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${lesson.category === 'budgeting' ? 'bg-blue-100 text-blue-700' :
                                                lesson.category === 'investing' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                {lesson.category}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-500" />
                                                {lesson.xp_reward || 50} XP
                                            </span>
                                        </div>
                                    </div>
                                    {!isCompleted && !lesson.is_locked && (
                                        <button
                                            onClick={() => handleStartLesson(lesson)}
                                            className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white transition-colors"
                                        >
                                            <Play className="w-5 h-5" />
                                        </button>
                                    )}
                                    {isCompleted && (
                                        <div className="text-green-500 font-bold text-sm">Done!</div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
