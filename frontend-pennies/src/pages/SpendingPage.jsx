import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { ArrowUp, ArrowDown, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'
import { PennyMascot } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function SpendingPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/transactions/analysis`, {
                    headers: getAuthHeaders()
                })
                const result = await response.json()
                setData(result)
            } catch (error) {
                console.error("Failed to fetch spending data", error)
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
        <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
            <h1 className="text-2xl font-black text-gray-800 mb-2">Spending Habits</h1>

            {/* AI Insights Card */}
            <div className="card-3d p-6 border-4 border-emerald-200 bg-emerald-50">
                <PennyMascot
                    message={data?.insights || "Great job tracking your finances! 🐸"}
                    mood="thinking"
                    animate={false}
                />
            </div>

            {/* Spending Chart */}
            <div className="card-3d p-6 border-4 border-gray-200">
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" />
                    Where Your Money Goes
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
                <div className="text-center mt-4">
                    <span className="text-3xl font-black text-gray-800">${data?.total?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Spent</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-700 px-2">Recent Transactions</h2>
                {data?.recent?.length > 0 ? (
                    data.recent.map((t) => (
                        <div key={t._id} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${t.type === 'need' ? 'bg-blue-100 text-blue-500' :
                                        t.type === 'want' ? 'bg-orange-100 text-orange-500' : 'bg-emerald-100 text-emerald-500'}
                        `}>
                                    {t.type === 'need' ? '🏠' : t.type === 'want' ? '🎮' : '💰'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{t.description}</p>
                                    <p className="text-xs text-gray-500 capitalize">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="font-black text-gray-700">-${t.amount.toFixed(2)}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        No recent transactions found.
                    </div>
                )}
            </div>
        </div>
    )
}
