import React, { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState(null)
  const [questsData, setQuestsData] = useState(null)
  const [homeData, setHomeData] = useState(null) // New cache for HomePage
  const [goalsData, setGoalsData] = useState(null) // New cache for Goals

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setDashboardData(null)
    setQuestsData(null)
    setHomeData(null)
    setGoalsData(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const refreshUser = useCallback(async (currentToken) => {
    const tokenToUse = currentToken || token;
    if (!tokenToUse) return;

    try {
      // Dynamic import to avoid circular dependency issues if any, though regular import is fine here.
      // Using fetch directly to avoid client helper circular dep if client uses auth context.
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          console.log('🔄 Auth: Synced fresh user data', data.data)
          setUser(data.data)
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      } else {
        console.log('⚠️ Auth: Token invalid or expired during sync')
        if (response.status === 401) {
          logout()
        }
      }
    } catch (error) {
      console.error('❌ Auth: Failed to sync user data', error)
    }
  }, [token, logout])

  // Initialize from localStorage on mount AND fetch fresh data
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken) {
        setToken(storedToken)
        if (storedUser) setUser(JSON.parse(storedUser))

        // Fetch fresh user data to sync XP/Stats
        await refreshUser(storedToken)
      }
      setLoading(false)
    }

    initAuth()
  }, []) // refreshUser is stable

  const login = useCallback((token, user) => {
    console.log('🔐 Auth: Logging in user:', user.username)
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }, [])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser, isAuthenticated, dashboardData, setDashboardData, questsData, setQuestsData, homeData, setHomeData, goalsData, setGoalsData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
