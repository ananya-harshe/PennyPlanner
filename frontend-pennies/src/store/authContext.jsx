import React, { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState(null)
  const [questsData, setQuestsData] = useState(null)

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = useCallback((token, user) => {
    console.log('🔐 Auth: Logging in user:', user.username)
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setDashboardData(null)
    setQuestsData(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthenticated, dashboardData, setDashboardData, questsData, setQuestsData }}>
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
