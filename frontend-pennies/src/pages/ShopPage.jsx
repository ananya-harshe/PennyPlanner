import React, { useState, useEffect } from 'react'
import { ShoppingBag, Gem, Lock, Check } from 'lucide-react'
import { toast } from 'sonner'
import { API_URL, getAuthHeaders } from '@/api/client'
import { PennyMascot } from '@/components/PennyComponents'

export default function ShopPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Mock Shop Items
    const shopItems = [
        { id: 1, name: 'Neon Frog', type: 'avatar', price: 500, icon: '🐸', unlocked: false },
        { id: 2, name: 'Gold Theme', type: 'theme', price: 1000, icon: '🎨', unlocked: false },
        { id: 3, name: 'Wizard Hat', type: 'accessory', price: 300, icon: '🧙‍♂️', unlocked: true },
        { id: 4, name: 'Rocket Badge', type: 'badge', price: 150, icon: '🚀', unlocked: false },
        { id: 5, name: 'Mystery Box', type: 'consumable', price: 200, icon: '🎁', unlocked: false },
        { id: 6, name: 'Super Streak', type: 'powerup', price: 800, icon: '🔥', unlocked: false },
    ]

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, { headers: getAuthHeaders() })
            const data = await response.json()
            setUser(data.data)
        } catch (error) {
            console.error("Failed to fetch user data")
        } finally {
            setLoading(false)
        }
    }

    const handleBuy = (item) => {
        if (item.unlocked) return

        if (user.gems >= item.price) {
            // Optimistic update
            setUser(prev => ({ ...prev, gems: prev.gems - item.price }))
            toast.success(`Purchased ${item.name}!`)
            // TODO: Call backend to process purchase
        } else {
            toast.error("Not enough gems! Keep learning to earn more.")
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-24 pb-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="p-4 pt-24 pb-24 min-h-screen bg-gray-50">

            {/* Header & Balance */}
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="text-emerald-500" />
                        Penny's Shop
                    </h1>
                    <p className="text-sm text-gray-500 font-bold">Spend your hard-earned gems!</p>
                </div>

                <div className="bg-white border-4 border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <Gem className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                    <span className="text-xl font-black text-gray-800">{user?.gems || 0}</span>
                </div>
            </div>

            <PennyMascot
                message="Ooh, shiny! Check out these cool rewards! 💎"
                mood="happy"
                size="small"
                className="mb-6"
            />

            {/* Shop Grid */}
            <div className="grid grid-cols-2 gap-4">
                {shopItems.map((item) => (
                    <div key={item.id} className="card-3d p-4 border-4 border-gray-100 flex flex-col items-center text-center relative overflow-hidden">

                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-3
               ${item.unlocked ? 'bg-emerald-100' : 'bg-gray-100 grayscale opacity-80'}
            `}>
                            {item.icon}
                        </div>

                        <h3 className="font-black text-gray-800">{item.name}</h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{item.type}</span>

                        {/* Action Button */}
                        {item.unlocked ? (
                            <button disabled className="w-full py-2 bg-gray-100 text-gray-400 font-black rounded-xl flex items-center justify-center gap-1 cursor-default">
                                <Check size={16} /> Owned
                            </button>
                        ) : (
                            <button
                                onClick={() => handleBuy(item)}
                                className="w-full py-2 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md">
                                <Gem size={14} className="fill-white/20" /> {item.price}
                            </button>
                        )}

                        {/* Locked Overlay if too expensive (optional visual cue) */}
                        {!item.unlocked && user?.gems < item.price && (
                            <div className="absolute top-2 right-2 opacity-50">
                                <Lock size={14} className="text-gray-400" />
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}
