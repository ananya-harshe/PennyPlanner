import React from 'react'
import { Star, Flame } from 'lucide-react'
import { PennyMascot } from './PennyComponents'
import Penny from '@/assets/Penny.png'

export default function StatsSidebar({ user, onOpenChat }) {
    return (
        <aside className="hidden xl:flex flex-col w-80 h-screen fixed top-0 right-0 p-8 space-y-8 bg-gray-50 overflow-y-auto border-l-4 border-gray-200 z-40">
            {/* Stats Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-black text-gray-800 mb-6">Your Stats</h2>

                <div className="card-3d p-4 border-4 border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-xl">
                            <Star className="w-6 h-6 text-indigo-500 fill-indigo-500" />
                        </div>
                        <span className="font-black text-gray-700">XP</span>
                    </div>
                    <span className="text-2xl font-black text-indigo-500">{user?.xp || 0}</span>
                </div>



                <div className="card-3d p-4 border-4 border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-xl">
                            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                        </div>
                        <span className="font-black text-gray-700">Streak</span>
                    </div>
                    <span className="text-2xl font-black text-orange-500">{user?.streak || 0} days</span>
                </div>

                {/* Ask Penny Button (Desktop) */}
                <button
                    onClick={onOpenChat}
                    className="w-full card-3d p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 border-b-4 border-emerald-800 rounded-2xl flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 p-1 rounded-xl group-hover:rotate-12 transition-transform overflow-hidden border border-white/50">
                            <img src={Penny} alt="Penny" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="text-left">
                            <span className="block font-black text-white">Ask Penny</span>
                            <span className="text-xs text-emerald-100 font-bold">AI Financial Advisor</span>
                        </div>
                    </div>
                    <span className="bg-white/20 px-2 py-1 rounded-lg text-white font-bold text-sm">Chat</span>
                </button>
            </div>

            {/* Mascot Advice */}
            <div className="mt-auto">
                <PennyMascot
                    message="Keep practicing every day to reach your financial goals! You're doing great! 📈"
                    mood="happy"
                    size="medium"
                    className="shadow-3d bg-white p-6 rounded-[32px] border-4 border-emerald-100"
                />
            </div>
        </aside>
    )
}
