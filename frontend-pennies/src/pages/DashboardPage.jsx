import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, PieChart, CreditCard, Wallet, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import axios from 'axios'
import { theme } from '@/theme'
import { PennyMascot, Progress } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState(null)
  const [pennyMessage, setPennyMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  const [learningStats, setLearningStats] = useState([])
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    const fetchCriticalData = async () => {
      try {
        setLoading(true)

        // Fetch progress data (fast)
        const progressResponse = await fetch(`${API_URL}/progress`, { headers: getAuthHeaders() })
        const progressData = await progressResponse.json()

        setTotalXP(progressData.xp || 0)

        // Process XP history for the graph (last 7 days)
        const history = progressData.xp_history || []
        const last7Days = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
          const found = history.find(h => h.date === dateStr)
          last7Days.push({
            name: dayName,
            xp: found ? found.xp : 0
          })
        }
        setLearningStats(last7Days)

        // Mock transaction data
        const mockTransactions = [
          { id: '1', category: 'Groceries', amount: 125.50, date: '2026-01-23', type: 'expense' },
          { id: '2', category: 'Salary', amount: 3500, date: '2026-01-20', type: 'income' },
          { id: '3', category: 'Entertainment', amount: 45.99, date: '2026-01-22', type: 'expense' },
          { id: '4', category: 'Utilities', amount: 89.00, date: '2026-01-21', type: 'expense' },
          { id: '5', category: 'Transport', amount: 35.00, date: '2026-01-23', type: 'expense' },
        ]

        const totalIncome = mockTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)

        const totalExpenses = mockTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)

        const balance = totalIncome - totalExpenses

        const categorySpending = mockTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => {
            const existing = acc.find(c => c.category === t.category)
            if (existing) {
              existing.amount += t.amount
            } else {
              acc.push({ category: t.category, amount: t.amount })
            }
            return acc
          }, [])

        setTransactions({
          list: mockTransactions,
          totalIncome,
          totalExpenses,
          balance,
          categorySpending
        })
      } catch (e) {
        console.error("Failed to fetch critical data", e)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    const fetchPennyMessage = async () => {
      try {
        const messageResponse = await fetch(`${API_URL}/penny/message?context=home`, {
          headers: getAuthHeaders()
        })
        const messageData = await messageResponse.json()
        setPennyMessage(messageData.message)
      } catch (e) {
        console.error("Failed to fetch Penny message", e)
        // Fallback message is already set in render or initial state if we wanted
      }
    }

    fetchCriticalData()
    fetchPennyMessage()
  }, [])

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-24">
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-24" data-testid="dashboard-page">
      {/* Penny Welcome */}
      <PennyMascot
        message={pennyMessage || "Your finances are looking great!"}
        size="medium"
        mood="happy"
      />

      {/* Learning Activity Graph */}
      <div className="card-3d p-8 border-4 border-indigo-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 rounded-2xl p-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">Learning Activity</h3>
              <p className="text-sm text-gray-500 font-bold">Total XP: {totalXP}</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={learningStats}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis
                hide={true}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#6366f1"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorXp)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="card-3d p-6 border-4 border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-700">Balance</h3>
            <div className="bg-emerald-500 rounded-2xl p-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-500">${transactions?.balance.toFixed(2)}</p>
          <p className="text-sm font-bold text-gray-600 mt-2">Available</p>
        </div>

        {/* Income Card */}
        <div className="card-3d p-6 border-4 border-sky-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-700">Income</h3>
            <div className="bg-sky-500 rounded-2xl p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black text-sky-500">${transactions?.totalIncome.toFixed(2)}</p>
          <p className="text-sm font-bold text-gray-600 mt-2">This month</p>
        </div>

        {/* Expenses Card */}
        <div className="card-3d p-6 border-4 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-700">Expenses</h3>
            <div className="bg-red-500 rounded-2xl p-3">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black text-red-500">${transactions?.totalExpenses.toFixed(2)}</p>
          <p className="text-sm font-bold text-gray-600 mt-2">This month</p>
        </div>
      </div>

      {/* Spending by Category */}




      {/* Spending by Category */}
      <div className="card-3d p-8 border-4 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500 rounded-2xl p-3">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-800">Spending by Category</h3>
        </div>
        <div className="space-y-6">
          {transactions?.categorySpending.map((item, idx) => {
            const percentage = (item.amount / transactions.totalExpenses) * 100
            const colors = [
              'bg-emerald-500',
              'bg-sky-500',
              'bg-orange-500',
              'bg-red-500',
              'bg-purple-500',
            ]
            return (
              <div key={item.category}>
                <div className="flex justify-between mb-2">
                  <span className="font-black text-gray-700">{item.category}</span>
                  <span className="font-black text-emerald-500">${item.amount.toFixed(2)}</span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-3d p-8 border-4 border-gray-200">
        <div className="flex items-center gap-3 mb-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 rounded-2xl p-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">Recent Transactions</h3>
          </div>
          <button
            onClick={() => navigate('/spending')}
            className="text-sky-500 font-bold text-sm hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {transactions?.list.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b-2 border-gray-200 last:border-b-0">
              <div>
                <p className="font-black text-gray-800">{transaction.category}</p>
                <p className="text-xs font-bold text-gray-500">{transaction.date}</p>
              </div>
              <span
                className={`font-black ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                  }`}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
