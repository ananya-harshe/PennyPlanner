import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Toaster } from 'sonner'
import { Home, BookOpen, Trophy, User, Wallet } from 'lucide-react'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import ChatbotPage from '@/pages/ChatbotPage'
import QuestsPage from '@/pages/QuestsPage'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'

// Navigation Component
const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BookOpen, label: 'Dashboard' },
    { path: '/chatbot', icon: Trophy, label: 'Advice' },
    { path: '/quests', icon: User, label: 'Quests' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 z-50">
      <div className="max-w-4xl mx-auto px-4 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              location.pathname === item.path 
                ? 'text-emerald-500 border-b-4 border-emerald-500' 
                : 'text-gray-600 hover:text-emerald-500'
            } transition-colors`}
          >
            <item.icon size={24} />
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Header Component
const StatsHeader = () => {
  return (
    <header className="bg-white border-b-4 border-gray-200 sticky top-0 z-40">
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
    <div className="app-container bg-gray-100 min-h-screen">
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <StatsHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/quests" element={<QuestsPage />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </div>
  )
}
