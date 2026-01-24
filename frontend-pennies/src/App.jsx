import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Trophy, User, Wallet, LogOut, Settings, ShoppingBag, Sparkles } from 'lucide-react'
import { AuthProvider, useAuth } from '@/store/authContext'
import Penny from '@/assets/Penny.png'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import ChatbotPage from '@/pages/ChatbotPage'
import QuestsPage from '@/pages/QuestsPage'

import LeaderboardPage from '@/pages/LeaderboardPage'
import SettingsPage from '@/pages/SettingsPage'
import ShopPage from '@/pages/ShopPage'
import FuturePlanningPage from '@/pages/FuturePlanningPage'
import LoginPage from '@/pages/LoginPage'
import DesktopNavigation from '@/components/DesktopNavigation'
import StatsSidebar from '@/components/StatsSidebar'
import ScrollToTop from '@/components/ScrollToTop'
import PennyChatWidget from '@/components/PennyChatWidget'
import { Toaster } from 'sonner'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api'

// Navigation Component (Mobile Only)
const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BookOpen, label: 'Dash' },
    { path: '/quests', icon: User, label: 'Quests' },
    { path: '/leaderboard', icon: Trophy, label: 'Rank' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/future-planning', icon: Sparkles, label: 'Future' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 z-50 lg:hidden">
      <div className="max-w-4xl mx-auto px-1 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 ${location.pathname === item.path
              ? 'text-emerald-500 border-b-4 border-emerald-500'
              : 'text-gray-600 hover:text-emerald-500'
              } transition-colors`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Header Component (Mobile Only)
const StatsHeader = ({ onOpenChat }) => {
  return (
    <header className="bg-white border-b-4 border-gray-200 sticky top-0 z-40 lg:hidden">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 rounded-2xl p-2">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">PennyWise</h1>
        </div>

        <button
          onClick={onOpenChat}
          className="px-3 py-1.5 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
            <img src={Penny} alt="Penny" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm">Ask!</span>
        </button>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth()
  const [isChatOpen, setIsChatOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-xl font-semibold text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container bg-gray-100">
        <Toaster position="top-center" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  }

  return (
    <div className="app-container bg-gray-100 min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" richColors />

        {/* Desktop Left Nav - Fixed Position */}
        <DesktopNavigation />

        {/* Desktop Right Stats - Fixed Position */}
        <StatsSidebar user={user} onOpenChat={() => setIsChatOpen(true)} />

        {/* Main Layout - Offset by both sidebars on Desktop */}
        <div className="lg:ml-72 xl:mr-80 h-screen overflow-y-auto">
          {/* Main Content Area - Centered */}
          <main className="w-full max-w-4xl mx-auto px-4">
            <StatsHeader onOpenChat={() => setIsChatOpen(true)} />
            <div className="min-h-screen pb-24 lg:pb-12">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/quests" element={<QuestsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/future-planning" element={<FuturePlanningPage />} />

                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
            <BottomNav />
          </main>
        </div>

        {/* Global Chat Widget */}
        <PennyChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </BrowserRouter>
    </div>
  )
}
