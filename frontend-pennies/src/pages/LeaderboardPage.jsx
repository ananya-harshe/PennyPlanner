import React, { useEffect, useState } from 'react'
import { Trophy, Crown, Medal, Award, User, Star } from 'lucide-react'
import { API_URL, getAuthHeaders } from '@/api/client'
import { toast } from 'sonner'
import { useAuth } from '@/store/authContext'

export default function LeaderboardPage() {
    const { user } = useAuth()
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_URL}/users/leaderboard`, { headers: getAuthHeaders() })
            const data = await response.json()
            setLeaderboard(data)
        } catch (error) {
            console.error("Failed to fetch leaderboard", error)
            toast.error("Failed to load rankings")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-24 gap-4">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse">Summoning the champions... 🏆</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent p-4 lg:p-8 lg:px-10 space-y-8 pb-24 lg:pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <Trophy className="text-yellow-500" />
                        Leaderboard
                    </h1>
                    <p className="text-sm text-gray-500 font-bold">Top savers and spenders!</p>
                </div>
            </div>

            {/* Podium (Top 3) */}
            <div className="flex items-end justify-center gap-4 mb-12 min-h-[220px]">
                {/* 2nd Place */}
                {leaderboard[1] && (
                    <div className="flex flex-col items-center animate-slide-up animation-delay-200">
                        <div className="relative mb-2">
                            <div className="w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-200 flex items-center justify-center">
                                <span className="text-2xl font-black text-gray-400 uppercase">{leaderboard[1].username[0]}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-gray-300 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">2</div>
                        </div>
                        <div className="flex flex-col items-center bg-white p-4 pt-8 -mt-6 rounded-t-2xl w-28 h-32 border-x-4 border-t-4 border-gray-100 shadow-sm relative -z-10">
                            <p className="font-bold text-gray-700 truncate w-full text-center text-sm">{leaderboard[1].nickname || leaderboard[1].username}</p>
                            <p className="font-black text-emerald-500 text-xs">{leaderboard[1].xp.toLocaleString()} XP</p>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {leaderboard[0] && (
                    <div className="flex flex-col items-center z-10 animate-slide-up">
                        <div className="relative mb-2">
                            <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400 fill-yellow-400 animate-bounce-toy" />
                            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden bg-yellow-100 flex items-center justify-center shadow-lg ring-4 ring-yellow-100/50">
                                <span className="text-3xl font-black text-yellow-600 uppercase">{leaderboard[0].username[0]}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md text-lg">1</div>
                        </div>
                        <div className="flex flex-col items-center bg-gradient-to-b from-yellow-50 to-white p-4 pt-8 -mt-6 rounded-t-3xl w-36 h-40 border-x-4 border-t-4 border-yellow-200 shadow-md relative -z-10">
                            <p className="font-black text-gray-800 truncate w-full text-center">{leaderboard[0].nickname || leaderboard[0].username}</p>
                            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full mt-1">
                                <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                                <p className="font-black text-yellow-700 text-sm">{leaderboard[0].xp.toLocaleString()} XP</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {leaderboard[2] && (
                    <div className="flex flex-col items-center animate-slide-up animation-delay-400">
                        <div className="relative mb-2">
                            <div className="w-20 h-20 rounded-full border-4 border-orange-300 overflow-hidden bg-orange-100 flex items-center justify-center">
                                <span className="text-2xl font-black text-orange-400 uppercase">{leaderboard[2].username[0]}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">3</div>
                        </div>
                        <div className="flex flex-col items-center bg-white p-4 pt-8 -mt-6 rounded-t-2xl w-28 h-24 border-x-4 border-t-4 border-gray-100 shadow-sm relative -z-10">
                            <p className="font-bold text-gray-700 truncate w-full text-center text-sm">{leaderboard[2].nickname || leaderboard[2].username}</p>
                            <p className="font-black text-emerald-500 text-xs">{leaderboard[2].xp.toLocaleString()} XP</p>
                        </div>
                    </div>
                )}
            </div>

            {/* List for rest */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-4 border-gray-100 space-y-4">
                {leaderboard.slice(3).map((player, index) => (
                    <div
                        key={player._id}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:scale-[1.01]
                            ${player._id === user?._id
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm'}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <span className="font-black text-gray-400 w-6 text-center">{index + 4}</span>
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center font-bold">
                                {player.username[0].toUpperCase()}
                            </div>
                            <div>
                                <p className={`font-bold ${player._id === user?._id ? 'text-emerald-700' : 'text-gray-700'}`}>
                                    {player.nickname || player.username}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{player.username} {player._id === user?._id && '(You)'}</p>
                                {player.badges?.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                        {player.badges.slice(0, 3).map((b, i) => (
                                            <span key={i} className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded">🏅</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="font-black text-gray-800 flex items-center gap-1">
                            {player.xp.toLocaleString()} <span className="text-xs text-gray-400 font-bold">XP</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
