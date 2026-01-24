import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, User, ShoppingBag, Trophy, Settings, Wallet } from 'lucide-react'

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BookOpen, label: 'Dashboard' },
    { path: '/quests', icon: User, label: 'Quests' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/chatbot', icon: Trophy, label: 'Advice' },
]

export default function DesktopNavigation() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen fixed top-0 left-0 border-r-4 border-gray-200 bg-white p-6 z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="bg-emerald-500 rounded-2xl p-2">
                    <Wallet className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-black text-gray-800">PennyWise</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black transition-all
              ${location.pathname === item.path
                                ? 'bg-emerald-50 text-emerald-500 border-2 border-emerald-500'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-500'
                            }`}
                    >
                        <item.icon size={28} />
                        <span className="text-lg uppercase tracking-wide">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t-2 border-gray-100">
                <button
                    onClick={() => navigate('/settings')}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black transition-all
            ${location.pathname === '/settings'
                            ? 'bg-emerald-50 text-emerald-500 border-2 border-emerald-500'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-500'
                        }`}
                >
                    <Settings size={28} />
                    <span className="text-lg uppercase tracking-wide">Settings</span>
                </button>
            </div>
        </aside>
    )
}
