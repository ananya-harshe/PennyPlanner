import React, { useEffect, useState } from 'react'
import { Flame, Sparkles } from 'lucide-react'

const StreakAnimation = ({ streak, onComplete }) => {
    const [stage, setStage] = useState('ignite') // ignite -> burn -> fade

    useEffect(() => {
        // Sequence
        const timer1 = setTimeout(() => setStage('burn'), 100)
        const timer2 = setTimeout(() => setStage('fade'), 2500) // Keep it visible for a bit
        const timer3 = setTimeout(() => onComplete(), 3000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
        }
    }, [onComplete])

    if (stage === 'fade') return null // Or handle fade out via CSS classes

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${stage === 'fade' ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

            <div className="relative flex flex-col items-center justify-center z-10 animate-bounce-in">
                {/* Fire Effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-[80px] rounded-full opacity-50 animate-pulse" />
                    <div className="absolute -inset-4 bg-red-500 blur-[60px] rounded-full opacity-30 animate-pulse animation-delay-200" />

                    {/* Main Icon */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <Flame size={140} className={`text-orange-500 fill-orange-500 drop-shadow-lg ${stage === 'burn' ? 'animate-wiggle' : 'scale-0'}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl font-black text-white drop-shadow-md pt-6">{streak}</span>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-4xl md:text-5xl font-black text-white mt-4 text-shadow-lg text-center leading-tight">
                    <span className="text-orange-400">DAY</span> STREAK!
                </h2>
                <p className="text-white/80 font-bold mt-2 text-lg animate-pulse-slow">You're on fire! 🔥</p>
            </div>
        </div>
    )
}

export default StreakAnimation
