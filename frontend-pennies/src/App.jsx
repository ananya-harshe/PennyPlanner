import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Trophy, User, Wallet, LogOut, Settings, ShoppingBag } from 'lucide-react'
import { AuthProvider, useAuth } from '@/store/authContext'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import ChatbotPage from '@/pages/ChatbotPage'
import QuestsPage from '@/pages/QuestsPage'

import SettingsPage from '@/pages/SettingsPage'
import ShopPage from '@/pages/ShopPage'
import LoginPage from '@/pages/LoginPage'
import DesktopNavigation from '@/components/DesktopNavigation'
import StatsSidebar from '@/components/StatsSidebar'
import ScrollToTop from '@/components/ScrollToTop'
import { Toaster } from 'sonner'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api'

// Navigation Component (Mobile Only)
const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BookOpen, label: 'Dashboard' },
    { path: '/quests', icon: User, label: 'Quests' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/chatbot', icon: Trophy, label: 'Advice' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 z-50 lg:hidden">
      <div className="max-w-4xl mx-auto px-4 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${location.pathname === item.path
              ? 'text-emerald-500 border-b-4 border-emerald-500'
              : 'text-gray-600 hover:text-emerald-500'
              } transition-colors`}
          >
            <item.icon size={24} />
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => navigate('/settings')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 ${location.pathname === '/settings'
            ? 'text-emerald-500 border-b-4 border-emerald-500'
            : 'text-gray-600 hover:text-emerald-500'
            } transition-colors`}
        >
          <Settings size={24} />
          <span className="text-xs font-semibold">Settings</span>
        </button>
      </div>
    </nav>
  )
}

// Header Component (Mobile Only)
const StatsHeader = () => {
  return (
    <header className="bg-white border-b-4 border-gray-200 sticky top-0 z-40 lg:hidden">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 rounded-2xl p-2">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">PennyPlanning</h1>
        </div>
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

        {/* Main Layout - Offset by Sidebar Width on Desktop */}
        <div className="lg:ml-72 flex justify-center min-h-screen">
          <div className="flex w-full max-w-[1200px] gap-6">

            {/* Main Content Area */}
            <main className="flex-1 w-full lg:max-w-4xl lg:mx-0">
              <StatsHeader />
              <div className="min-h-screen pb-24 lg:pb-12">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/quests" element={<QuestsPage />} />
                  <Route path="/shop" element={<ShopPage />} />

                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
              <BottomNav />
            </main>

            {/* Desktop Right Stats */}
            <StatsSidebar user={user} />
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}
