import React, { useState } from 'react'
import { Gift, Sparkles, CreditCard, TrendingUp, Star } from 'lucide-react'

const GiftBoxAnimation = ({ onComplete }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showReward, setShowReward] = useState(false)

    // Randomize reward for now
    const rewards = [
        { type: 'XP', value: 500, label: "+500 XP", icon: Star, color: "text-yellow-400" },
        { type: 'APR', value: 0.01, label: "+0.01% APR Boost", icon: TrendingUp, color: "text-emerald-400" },
        { type: 'POINTS', value: 1000, label: "+1,000 Points", icon: CreditCard, color: "text-blue-400" }
    ]
    const [reward] = useState(rewards[Math.floor(Math.random() * rewards.length)])

    const handleBoxClick = () => {
        if (isOpen) return
        setIsOpen(true)
        setTimeout(() => {
            setShowReward(true)
        }, 600) // Wait for lid open animation
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="relative flex flex-col items-center justify-center w-full h-full">

                {/* Title */}
                <h2 className={`text-4xl font-black text-white mb-12 transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
                    Milestone Reached!
                </h2>

                {/* The Gift Box */}
                <div
                    onClick={handleBoxClick}
                    className={`relative cursor-pointer transition-all duration-700 ${isOpen ? 'scale-110 translate-y-20' : 'animate-bounce-toy hover:scale-110'}`}
                >
                    {/* Lid */}
                    <div className={`absolute -top-10 left-0 w-48 h-12 bg-indigo-500 rounded-lg border-4 border-indigo-300 z-20 transition-transform duration-500 origin-bottom-left ${isOpen ? '-rotate-[120deg] -translate-y-20 translate-x-10' : ''}`}>
                        <div className="absolute inset-x-0 h-full w-8 bg-yellow-400 mx-auto border-x-2 border-yellow-200" />
                    </div>

                    {/* Box Body */}
                    <div className="w-48 h-48 bg-indigo-600 rounded-xl border-4 border-indigo-400 flex items-center justify-center relative shadow-3d overflow-hidden">
                        <div className="absolute inset-y-0 w-8 bg-yellow-400 border-x-2 border-yellow-200" />
                        {!isOpen && <span className="text-8xl font-black text-white/20 z-10 animate-pulse">?</span>}
                    </div>

                    {/* Glow behind */}
                    <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-40 -z-10 animate-pulse-glow" />
                </div>

                {/* Reward Reveal */}
                {showReward && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 animation-pop-up">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent pointer-events-none" />

                        {/* Reward Icon Burst */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-white blur-[80px] opacity-30" />
                            <Sparkles className="absolute -top-10 -right-10 w-20 h-20 text-yellow-300 animate-spin-slow" />
                            <reward.icon className={`w-40 h-40 ${reward.color} drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-float`} />
                        </div>

                        <div className="text-center relative z-40 space-y-4">
                            <h3 className="text-white text-3xl font-bold uppercase tracking-widest">Rare Found!</h3>
                            <div className="bg-white/10 backdrop-blur-md px-12 py-6 rounded-3xl border border-white/20">
                                <p className={`text-6xl font-black ${reward.color} drop-shadow-md`}>{reward.label}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onComplete(reward)}
                            className="mt-12 btn-3d-green text-xl px-12 py-4 shadow-2xl animate-bounce-in relative z-50 pointer-events-auto"
                        >
                            Claim Reward
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default GiftBoxAnimation
