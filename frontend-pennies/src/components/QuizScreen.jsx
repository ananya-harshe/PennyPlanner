import React, { useState, useEffect } from 'react'
import { X, ChevronRight, CheckCircle, XCircle, Star, Trophy, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot, Progress } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function QuizScreen({ lessonId, lessonTitle, onClose, onComplete }) {
    const [quiz, setQuiz] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuiz()
    }, [lessonId])

    const fetchQuiz = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/quiz/${lessonId}`, {
                headers: getAuthHeaders()
            })
            const data = await response.json()
            setQuiz(data)
        } catch (error) {
            console.error('Failed to fetch quiz:', error)
            toast.error('Failed to load quiz')
        } finally {
            setLoading(false)
        }
    }

    const currentQuestion = quiz?.questions?.[currentQuestionIndex]
    const totalQuestions = quiz?.questions?.length || 0
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100



    const handleSelectAnswer = (index) => {
        if (showResult) return
        setSelectedAnswer(index)
    }

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return

        // Ensure robust type comparison (handle both string and number)
        const safeSelected = Number(selectedAnswer);
        const safeCorrect = Number(currentQuestion.correct_answer);

        const correct = safeSelected === safeCorrect;

        setIsCorrect(correct)
        setShowResult(true)

        if (correct) {
            setScore(prev => prev + 1)
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
            setIsCorrect(false)
        } else {
            completeQuiz()
        }
    }

    const completeQuiz = async () => {
        setQuizCompleted(true)

        try {
            const response = await fetch(
                `${API_URL}/quiz/${lessonId}/complete?correct_answers=${score}&total_questions=${totalQuestions}`,
                {
                    method: 'POST',
                    headers: getAuthHeaders()
                }
            )
            const result = await response.json()

            if (result.passed) {
                toast.success(`🎉 You earned ${result.xp_earned} XP!`)
            }
        } catch (error) {
            console.error('Failed to complete quiz:', error)
        }
    }

    const handleFinish = () => {
        if (onComplete) {
            onComplete({
                score,
                total: totalQuestions,
                passed: score / totalQuestions >= 0.7
            })
        }
        onClose()
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-900/80 z-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="text-4xl mb-4 animate-bounce">📚</div>
                    <p className="text-gray-600 font-bold">Loading questions...</p>
                </div>
            </div>
        )
    }

    if (quizCompleted) {
        const percentage = (score / totalQuestions) * 100
        const passed = percentage >= 70

        return (
            <div className="fixed inset-0 bg-gradient-to-b from-emerald-500 to-emerald-700 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="text-6xl mb-4">
                        {passed ? '🎉' : '💪'}
                    </div>

                    <h2 className="text-2xl font-black text-gray-800 mb-2">
                        {passed ? 'Awesome Job!' : 'Keep Practicing!'}
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {passed
                            ? "You've mastered this lesson!"
                            : "You're getting better! Try again soon."}
                    </p>

                    <div className="bg-gray-100 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Trophy className={`w-8 h-8 ${passed ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <span className="text-4xl font-black text-gray-800">
                                {score}/{totalQuestions}
                            </span>
                        </div>
                        <Progress value={percentage} className="h-3" />
                        <p className="text-sm text-gray-600 mt-2 font-bold">
                            {Math.round(percentage)}% Correct
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-gray-700">
                            +{Math.round(percentage)} XP earned!
                        </span>
                    </div>

                    <button
                        onClick={handleFinish}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-colors border-b-4 border-emerald-700"
                    >
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b-4 border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm">{lessonTitle}</h3>
                        <p className="text-xs text-gray-500">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <Progress value={progressPercent} className="h-2" />
                </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <PennyMascot
                    message={showResult
                        ? (isCorrect ? "Ribbit! That's right! 🎉" : "Not quite, but you're learning! 📚")
                        : "Think carefully! You've got this! 🐸"
                    }
                    size="small"
                    mood={showResult ? (isCorrect ? 'happy' : 'thinking') : 'thinking'}
                />

                <div className="mt-6">
                    <h2 className="text-xl font-black text-gray-800 mb-6">
                        {currentQuestion?.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion?.options?.map((option, index) => {
                            let buttonClass = 'bg-white border-4 border-gray-200 hover:border-emerald-300'

                            // Type-safe comparisons
                            const correctAnswerIndex = Number(currentQuestion.correct_answer);
                            const selectedIndex = Number(selectedAnswer);

                            if (showResult) {
                                if (index === correctAnswerIndex) {
                                    buttonClass = 'bg-green-100 border-4 border-green-500'
                                } else if (index === selectedIndex && !isCorrect) {
                                    buttonClass = 'bg-red-100 border-4 border-red-500'
                                }
                            } else if (selectedIndex === index) {
                                buttonClass = 'bg-blue-100 border-4 border-blue-500'
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAnswer(index)}
                                    disabled={showResult}
                                    className={`w-full p-4 rounded-2xl text-left font-bold transition-all ${buttonClass}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-600">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className="flex-1 text-gray-800">{option}</span>
                                        {showResult && index === Number(currentQuestion.correct_answer) && (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        )}
                                        {showResult && index === Number(selectedAnswer) && !isCorrect && index !== Number(currentQuestion.correct_answer) && (
                                            <XCircle className="w-6 h-6 text-red-500" />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-8 mb-6">
                        {showResult ? (
                            <button
                                onClick={handleNextQuestion}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-colors flex items-center justify-center gap-2 border-b-4 border-emerald-700"
                            >
                                {currentQuestionIndex < totalQuestions - 1 ? (
                                    <>
                                        Next Question
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        See Results
                                        <Trophy className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={selectedAnswer === null}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-colors border-b-4 border-emerald-700 disabled:border-gray-400"
                            >
                                Check Answer
                            </button>
                        )}
                    </div>

                    {/* Explanation */}
                    {showResult && currentQuestion?.explanation && (
                        <div className={`mt-6 p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'}`}>
                            <p className="text-sm font-bold text-gray-700">
                                💡 {currentQuestion.explanation}
                            </p>
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}
