import React from 'react'
import { Star, Flame } from 'lucide-react'
import { PennyMascot } from './PennyComponents'

export default function StatsSidebar({ user }) {
    return (
        <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 p-8 space-y-8 bg-gray-50 overflow-y-auto">
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
