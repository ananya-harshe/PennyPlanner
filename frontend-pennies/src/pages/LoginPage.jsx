import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/store/authContext'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📝 Form submitted. Is login?', isLogin)
    console.log('Form data:', { ...formData, password: '***' })
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          toast.error('Please fill in all fields')
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || 'Login failed')
          setLoading(false)
          return
        }

        // Store token and user info in auth context
        login(data.token, data.user)
        toast.success(`Welcome back, ${data.user.username}! 🎉`)

        // Trigger streak animation on next home load
        sessionStorage.setItem('showStreak', 'true')

        navigate('/')
      } else {
        // Register
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          toast.error('Please fill in all fields')
          setLoading(false)
          return
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        })

        const data = await response.json()
        console.log('Register response:', { status: response.status, ok: response.ok, data })

        if (!response.ok) {
          console.error('Registration failed:', data.message)
          toast.error(data.message || 'Registration failed')
          setLoading(false)
          return
        }

        // Store token and user info in auth context
        login(data.token, data.user)
        toast.success(`Welcome, ${data.user.username}! Let's learn about money! 💰`)

        // Trigger streak animation on next home load
        sessionStorage.setItem('showStreak', 'true')

        navigate('/')
      }
    } catch (error) {
      console.error('Auth error - Full Error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      toast.error(`Error: ${error.message || 'Something went wrong. Please try again.'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">💰 PennyPlanner</h1>
          <p className="text-gray-600">Learn money management the fun way!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username - Register only */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Confirm Password - Register only */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Loading...
              </>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Log In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Form Type */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ username: '', email: '', password: '', confirmPassword: '' })
              }}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Info Message */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>Demo:</strong> For testing, use any email and password (min 6 chars). Your account will be saved to our database!
          </p>
        </div>
      </div>
    </div>
  )
}
