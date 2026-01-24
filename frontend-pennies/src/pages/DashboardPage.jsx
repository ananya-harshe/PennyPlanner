import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, CreditCard, Wallet, Loader2, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { toast } from 'sonner'
import axios from 'axios'
import { theme } from '@/theme'
import { PennyMascot, Progress } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [pennyMessage, setPennyMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Parallel Fetching for Speed Optimization
        const [analysisResponse, messageResponse] = await Promise.all([
          fetch(`${API_URL}/transactions/analysis`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/penny/message?context=home`, { headers: getAuthHeaders() })
        ]);

        const analysisData = await analysisResponse.json()
        const messageData = await messageResponse.json()

        setData(analysisData)
        setPennyMessage(messageData.message)

      } catch (e) {
        console.error("Failed to fetch dashboard data", e)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Penny is analyzing your habits... 🐸</p>
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



      <div className="card-3d p-6 border-4 border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp className="text-emerald-500" />
          Spending Breakdown
        </h2>

        <div className="h-64 w-full">
          {data?.chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 font-bold">
              No spending data yet!
            </div>
          )}
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
          <p className="text-3xl font-black text-emerald-500">${data ? (data.total * -1 + 5000).toFixed(2) : '0.00'}</p>
          <p className="text-sm font-bold text-gray-600 mt-2">Available (Est.)</p>
        </div>

        {/* Income Card */}
        <div className="card-3d p-6 border-4 border-sky-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-700">Income</h3>
            <div className="bg-sky-500 rounded-2xl p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black text-sky-500">$5,000.00</p>
          <p className="text-sm font-bold text-gray-600 mt-2">Target Monthly</p>
        </div>

        {/* Expenses Card */}
        <div className="card-3d p-6 border-4 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-700">Expenses</h3>
            <div className="bg-red-500 rounded-2xl p-3">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black text-red-500">${data?.total?.toFixed(2) || '0.00'}</p>
          <p className="text-sm font-bold text-gray-600 mt-2">This month</p>
        </div>
      </div>

      {/* Spending by Category */}






      {/* Recent Transactions */}
      <div className="card-3d p-8 border-4 border-gray-200">
        <div className="flex items-center gap-3 mb-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 rounded-2xl p-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">Recent Transactions</h3>
          </div>
          {/* View All removed */}
        </div>
        <div className="space-y-4">
          {data?.recent?.slice(0, 5).map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between py-3 border-b-2 border-gray-200 last:border-b-0">
              <div>
                <p className="font-black text-gray-800">{transaction.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">{transaction.category}</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
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
      </div >
    </div >
  )
}
