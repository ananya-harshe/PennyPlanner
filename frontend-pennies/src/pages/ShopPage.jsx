import React, { useState, useEffect } from 'react'
import { ShoppingBag, Star, Lock, Check, Zap, Gift, TrendingUp, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { API_URL, getAuthHeaders } from '@/api/client'
import { PennyMascot } from '@/components/PennyComponents'
import { useAuth } from '@/store/authContext'
import ShopRedemptionAnimation from '@/components/ShopRedemptionAnimation'

export default function ShopPage() {
    const { refreshUser } = useAuth()
    const [userXP, setUserXP] = useState(0)
    const [loading, setLoading] = useState(true)
    const [purchasedItem, setPurchasedItem] = useState(null)

    // Financial Rewards
    const shopItems = [
        { id: 1, name: '0.05% APR Boost', type: 'boost', price: 5000, icon: <TrendingUp />, description: 'Boost your savings rate for 30 days!', unlocked: false },
        { id: 2, name: '0.10% APR Boost', type: 'boost', price: 10000, icon: <Zap />, description: 'Supercharge your interest rate!', unlocked: false },
        { id: 3, name: '$10 Amazon Gift Card', type: 'reward', price: 25000, icon: <Gift />, description: 'Treat yourself on us.', unlocked: false },
        { id: 4, name: '$25 Target Gift Card', type: 'reward', price: 50000, icon: <ShoppingBag />, description: 'Shopping spree time!', unlocked: false },
        { id: 5, name: 'Financial Review', type: 'service', price: 100000, icon: <CreditCard />, description: '30-min call with a certified planner.', unlocked: false },
    ]

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            // We need the XP balance. Typically this is in the progress endpoint or user profile.
            // Assuming /progress has the most up-to-date XP.
            const response = await fetch(`${API_URL}/progress`, { headers: getAuthHeaders() })
            const data = await response.json()
            setUserXP(data.xp || 0)
        } catch (error) {
            console.error("Failed to fetch user data")
            toast.error("Failed to load XP balance")
        } finally {
            setLoading(false)
        }
    }

    const handleBuy = async (item) => {
        if (item.unlocked) return

        if (userXP >= item.price) {
            // Call backend to process purchase/redemption
            try {
                const response = await fetch(`${API_URL}/progress/redeem`, {
                    method: 'POST',
                    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: item.price })
                })
                const result = await response.json()

                if (result.success) {
                    setUserXP(result.xp)
                    // toast.success(`Redeemed ${item.name}! Check your email for details.`)
                    // Trigger animation
                    setPurchasedItem(item)

                    // Sync global user state so sidebar updates
                    refreshUser();
                } else {
                    toast.error(result.message || "Redemption failed")
                }
            } catch (error) {
                console.error("Redemption error", error)
                toast.error("Failed to redeem reward")
            }
        } else {
            toast.error(`Need ${item.price - userXP} more XP! Keep completing quests!`)
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
        <div className="p-4 lg:p-8 lg:px-10 space-y-6 pb-24 lg:pb-8 min-h-screen bg-transparent">
            {purchasedItem && (
                <ShopRedemptionAnimation
                    item={purchasedItem}
                    onComplete={() => setPurchasedItem(null)}
                />
            )}

            {/* Header & Balance */}
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="text-emerald-500" />
                        Rewards Shop
                    </h1>
                    <p className="text-sm text-gray-500 font-bold">Turn your financial wisdom into real wealth!</p>
                </div>

                <div className="bg-white border-4 border-yellow-100 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xl font-black text-gray-800">{userXP} XP</span>
                </div>
            </div>

            <PennyMascot
                message="Your hard work pays off! Literally! 🤑"
                mood="happy"
                size="small"
                className="mb-6"
            />

            {/* Shop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopItems.map((item) => (
                    <div key={item.id} className="card-3d p-6 border-4 border-gray-100 flex flex-col items-center text-center relative overflow-hidden group hover:border-emerald-200 transition-colors">

                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner
               ${item.unlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-emerald-500'}
            `}>
                            {React.cloneElement(item.icon, { size: 40 })}
                        </div>

                        <h3 className="text-lg font-black text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.type}</p>
                        <p className="text-sm text-gray-600 mb-4 px-4 min-h-[40px]">{item.description}</p>

                        {/* Action Button */}
                        {item.unlocked ? (
                            <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-black rounded-xl flex items-center justify-center gap-2 cursor-default">
                                <Check size={18} /> Redeemed
                            </button>
                        ) : (
                            <button
                                onClick={() => handleBuy(item)}
                                disabled={userXP < item.price}
                                className={`w-full py-3 font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm
                                    ${userXP >= item.price
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'}
                                `}
                            >
                                <Star size={16} className={userXP >= item.price ? "fill-white/20" : ""} />
                                {item.price.toLocaleString()} XP
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
