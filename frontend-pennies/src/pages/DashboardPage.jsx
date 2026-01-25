import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, CreditCard, Wallet, Loader2, AlertCircle, Target, Plus, PiggyBank } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { toast } from 'sonner'
import axios from 'axios'
import { theme } from '@/theme'
import { PennyMascot, Progress } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'
import { useAuth } from '@/store/authContext'
import AddGoalModal from '@/components/AddGoalModal'
import Penny from '@/assets/Penny.png'

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function DashboardPage() {
  const { user, dashboardData, setDashboardData, goalsData, setGoalsData } = useAuth()
  const [data, setData] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [pennyMessage, setPennyMessage] = useState(null)
  const [pennyAdvice, setPennyAdvice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // If we already have data in context, use it!
      if (dashboardData) {
        console.log("⚡ Using cached dashboard data")
        setData(dashboardData.analysis)
        setPennyMessage(dashboardData.message)
        setPennyAdvice(dashboardData.advice)
        setLoading(false)
      }

      try {
        setLoading(true)

        // Parallel Fetching for Speed Optimization
        const [analysisResponse, messageResponse, adviceResponse, goalsResponse, goalInsightsResponse] = await Promise.all([
          fetch(`${API_URL}/transactions/analysis`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/penny/message?context=home`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/penny/insights`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/goals`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/goals/insights`, { headers: getAuthHeaders() })
        ]);

        const analysisData = await analysisResponse.json()
        const messageData = await messageResponse.json()
        const adviceData = await adviceResponse.json()
        const goalsList = await goalsResponse.json()
        const goalInsights = await goalInsightsResponse.json()

        setData(analysisData)
        setPennyMessage(messageData.message)
        // Combine penny advice with goal advice if available
        const goalMsg = goalInsights.insights?.[0]?.message;
        setPennyAdvice(goalMsg || adviceData.insight)

        // Cache the data in context
        setDashboardData({
          analysis: analysisData,
          message: messageData.message,
          advice: goalMsg || adviceData.insight
        })

        setGoalsData(goalsList.data)

        // Fetch recent transactions from backend (which has Nessie key)
        if (user?.accountID) {
          try {
            console.log('📍 Fetching transactions for accountID:', user.accountID);
            console.log('🔗 Calling endpoint: ', `${API_URL}/transactions/nessie/${user.accountID}`);
            const purchasesResponse = await fetch(
              `${API_URL}/transactions/nessie/${user.accountID}`,
              { headers: getAuthHeaders() }
            );
            
            console.log('📊 Response status:', purchasesResponse.status);
            const responseData = await purchasesResponse.json();
            console.log('📊 Response data:', responseData);
            
            if (purchasesResponse.ok) {
              const purchases = Array.isArray(responseData) ? responseData : responseData.data || [];
              console.log('✅ Processed purchases:', purchases);
              console.log('✅ Number of transactions:', purchases.length);
              setRecentTransactions(purchases);
            } else {
              console.warn('⚠️ Could not fetch purchases from Nessie:', purchasesResponse.status, responseData);
              setRecentTransactions([]);
            }
          } catch (err) {
            console.error('Error fetching Nessie transactions:', err);
            setRecentTransactions([]);
          }
        } else {
          console.warn('⚠️ No accountID found for user:', user);
        }

      } catch (e) {
        console.error("Failed to fetch dashboard data", e)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }

    }

    fetchData()
  }, [user?.accountID])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Penny is analyzing your habits...</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 lg:px-10 space-y-6 pb-24 lg:pb-8" data-testid="dashboard-page">
      {/* Penny Welcome */}
      <PennyMascot
        message={pennyMessage || "Your finances are looking great!"}
        size="medium"
        mood="happy"
      />


      {/* Goals Section */}
      <div className="card-3d p-6 border-4 border-indigo-200 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-[50px] -z-10" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <Target className="text-indigo-500" />
            Your Financial Goals
          </h2>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl border-2 border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            New Goal
          </button>
        </div>

        {goalsData && goalsData.length > 0 ? (
          <div className="space-y-4">
            {goalsData.map(goal => (
              <div key={goal._id} className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                      <PiggyBank size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{goal.title}</h3>
                      <p className="text-xs text-gray-500 font-bold">${goal.current_amount || 0} / ${goal.target_amount}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-indigo-500">{Math.round((goal.current_amount / goal.target_amount) * 100)}%</span>
                </div>
                <Progress value={(goal.current_amount / goal.target_amount) * 100} className="h-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-medium mb-3">No goals set yet! Start saving today.</p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="text-indigo-500 font-bold hover:underline"
            >
              Create your first goal
            </button>
          </div>
        )}
      </div>

      {showAddGoal && <AddGoalModal onClose={() => setShowAddGoal(false)} />}

      <div className="card-3d p-6 border-4 border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp className="text-emerald-500" />
          Spending Breakdown
        </h2>

        <div className="h-64 w-full">
          {recentTransactions && recentTransactions.length > 0 ? (() => {
            // Calculate chart data once and reuse
            const categoryMap = {};
            recentTransactions.forEach(transaction => {
              const category = transaction.description || 'Other';
              categoryMap[category] = (categoryMap[category] || 0) + parseFloat(transaction.amount || 0);
            });
            const chartData = Object.entries(categoryMap).map(([name, value]) => ({
              name,
              value: parseFloat(value.toFixed(2))
            }));
            const total = chartData.reduce((a, b) => a + b.value, 0);

            return (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => {
                      const percent = ((value / total) * 100).toFixed(1);
                      return [`$${value.toFixed(2)} (${percent}%)`, 'Amount'];
                    }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend
                    formatter={(value, entry) => {
                      const val = entry?.payload?.value || 0;
                      const percent = ((val / total) * 100).toFixed(1);
                      return <span className="text-sm font-bold ml-1">{percent}% {value}</span>
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            );
          })() : (
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

      {/* Penny's Advice */}
      <div className="card-3d p-6 border-4 border-indigo-200 mb-6 bg-indigo-50/50">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-500 w-16 h-16 rounded-full p-1 flex-shrink-0 animate-bounce-slow overflow-hidden border-2 border-white flex items-center justify-center">
            <img src={Penny} alt="Penny" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h3 className="text-lg font-black text-indigo-900 mb-1">Penny's Advice</h3>
            {loading ? (
              <p className="text-indigo-400 font-bold animate-pulse text-sm">Reviewing your transactions...</p>
            ) : (
              <p className="text-indigo-700 font-bold text-sm italic">"{pennyAdvice || "Keep up the great work! Your financial future looks bright! ✨"}"</p>
            )}
          </div>
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
            <h3 className="text-2xl font-black text-gray-800 text-left">Recent Transactions</h3>
          </div>
          {/* View All removed */}
        </div>
        <div className="space-y-4">
          {recentTransactions && recentTransactions.length > 0 ? (
            recentTransactions.slice(0, 5).map((transaction, index) => (
              <div key={transaction._id || index} className="flex items-center justify-between py-3 border-b-2 border-gray-200 last:border-b-0">
                <div className="text-left">
                  <p className="font-black text-gray-800 text-left">{transaction.description || transaction.merchant_id}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">{transaction.type || 'Purchase'}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                      {transaction.purchase_date ? new Date(transaction.purchase_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <p
                  className={`font-black text-right ${
                    transaction.type === 'credit' ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'credit' ? '+' : '-'}${parseFloat(transaction.amount || 0).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent transactions from Nessie</p>
          )}
        </div>
      </div>
    </div>
  )
}
