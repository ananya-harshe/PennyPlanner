import React, { useEffect, useState } from 'react'
import { ShoppingBag, Sparkles, Check, Star } from 'lucide-react'

const ShopRedemptionAnimation = ({ item, onComplete }) => {
    const [stage, setStage] = useState('purchasing') // purchasing -> success -> finish

    useEffect(() => {
        // Sequence the animation
        const timer1 = setTimeout(() => setStage('success'), 600)
        const timer2 = setTimeout(() => {
            // Allow user to see success state before closing or requiring click?
            // Let's make it auto-close or manual. Manual is better for "stylish" feel.
        }, 2000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [])

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative flex flex-col items-center justify-center w-full h-full pointer-events-auto p-4">

                {/* Purchasing Effect - XP Flying Away */}
                {stage === 'purchasing' && (
                    <div className="absolute animate-pulse-glow">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center animate-spin-slow">
                                <Star className="w-12 h-12 text-white fill-white" />
                            </div>
                            <span className="text-3xl font-black text-red-400 mt-4 animate-float text-shadow">
                                -{item.price.toLocaleString()} XP
                            </span>
                        </div>
                    </div>
                )}

                {/* Success Reveal */}
                {stage === 'success' && (
                    <div className="relative flex flex-col items-center animation-pop-up">
                        {/* Background Burst */}
                        <div className="absolute inset-0 bg-emerald-400 blur-[80px] opacity-40 rounded-full scale-150 animate-pulse" />

                        {/* Main Icon */}
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 border-4 border-dashed border-yellow-300 rounded-full animate-spin-slow opacity-50" />
                            <div className="w-40 h-40 bg-white rounded-[40px] flex items-center justify-center shadow-3d rotate-3 hover:rotate-6 transition-transform">
                                {React.cloneElement(item.icon, { size: 80, className: "text-emerald-500 drop-shadow-md" })}
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-full border-4 border-white shadow-lg animate-bounce-in">
                                <Check size={32} strokeWidth={4} />
                            </div>
                        </div>

                        {/* Text */}
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 text-center drop-shadow-lg tracking-tight">
                            PURCHASE SUCCESSFUL!
                        </h2>
                        <div className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/20 mb-8">
                            <p className="text-xl md:text-2xl font-bold text-emerald-100 flex items-center gap-2">
                                You acquired: <span className="text-white underline decoration-yellow-400 decoration-4 underline-offset-4">{item.name}</span>
                            </p>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={onComplete}
                            className="btn-3d-green text-xl px-12 py-4 shadow-2xl animate-slide-up hover:scale-105 transition-transform"
                        >
                            Awesome! 🛍️
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ShopRedemptionAnimation
