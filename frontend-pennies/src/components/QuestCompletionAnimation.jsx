import React, { useEffect } from 'react'
import { Star, Trophy, Sparkles } from 'lucide-react'

// Animation Component
const QuestCompletionAnimation = ({ xpGained, onComplete }) => {

    useEffect(() => {
        // Auto-close after animation duration if desired, 
        // but the user might want to click "Continue" themselves.
        // Let's keep it manual for now so they can bask in the glory.
    }, [])

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative flex flex-col items-center justify-center w-full h-full pointer-events-auto p-4">

                {/* Burst Background Effects - decorative circles */}
                <div className="absolute animate-spin-slow opacity-20">
                    <div className="w-[600px] h-[600px] border-[50px] border-dashed border-yellow-400 rounded-full" />
                </div>
                <div className="absolute animate-spin-reverse-slow opacity-20">
                    <div className="w-[500px] h-[500px] border-[30px] border-dotted border-white rounded-full" />
                </div>

                {/* Main Content Card */}
                <div className="relative z-10 flex flex-col items-center animation-pop-up">

                    {/* Icons */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-yellow-400 blur-[60px] opacity-60 rounded-full animate-pulse-glow" />
                        <Trophy className="w-32 h-32 text-yellow-300 drop-shadow-lg animate-bounce-toy relative z-10 stroke-[1.5]" />

                        {/* Floating Stars */}
                        <Star className="absolute -top-6 -right-10 w-12 h-12 text-yellow-200 animate-float-delayedFill text-yellow-400 fill-yellow-400" />
                        <Star className="absolute top-10 -left-12 w-8 h-8 text-yellow-100 animate-float text-yellow-200 fill-yellow-200" />
                        <Sparkles className="absolute -bottom-4 right-10 w-10 h-10 text-white animate-pulse" />
                    </div>

                    {/* Text */}
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-2 text-center drop-shadow-xl tracking-wide animate-slide-up">
                        QUEST COMPLETE!
                    </h2>

                    <div className="flex items-center gap-2 mb-8 animate-slide-up animation-delay-200">
                        <span className="text-2xl font-bold text-emerald-200">You earned</span>
                        <div className="flex items-center gap-1 bg-white/10 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md">
                            <span className="text-5xl font-black text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                +{xpGained}
                            </span>
                            <span className="text-2xl font-bold text-emerald-200">XP</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onComplete}
                        className="btn-3d-green text-xl md:text-2xl px-12 py-4 animate-slide-up animation-delay-400 shadow-2xl hover:scale-105 transition-transform"
                    >
                        Continue Adventure
                    </button>

                </div>
            </div>
        </div>
    )
}

export default QuestCompletionAnimation
