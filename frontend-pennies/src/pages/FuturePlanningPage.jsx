import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiCall } from '../api/client';
import { Sparkles, PiggyBank } from 'lucide-react';
import { toast } from 'sonner';
import ScholarlyPenny from '../assets/ScholarlyPenny.png';

export default function FuturePlanningPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [popup, setPopup] = useState(null); // For centered "What If" popup

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        try {
            const res = await apiCall('/penny/future-planning');
            if (!res.ok) throw new Error('Failed to fetch analysis');
            const jsonData = await res.json();
            setData(jsonData);
        } catch (error) {
            toast.error('Could not load future planning data.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin text-4xl">🔮</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-gray-800">Oops! Could not generate prediction.</h2>
                <p className="text-gray-500 mb-4">Penny needs more transaction history to see the future.</p>
                <button onClick={fetchAnalysis} className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Try Again</button>
            </div>
        );
    }

    // Format chart data
    const chartData = data?.projections?.map(p => ({
        name: `Year ${p.year}`,
        "Cash (No Growth)": p.cash_kept,
        "High Yield Savings (4%)": p.dca_hys_4pct,
        "Market Invest (7%)": p.dca_market_7pct,
        "Lump Sum Invest (Hypothetical)": p.lump_sum_market_7pct
    })) || [];

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Centered Header */}
            <header className="text-center py-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl">
                <h1 className="text-4xl font-black text-white flex items-center justify-center gap-3">
                    <Sparkles className="text-white" size={40} />
                    Future Planning Engine
                </h1>
                <p className="text-indigo-100 mt-2 text-lg">
                    Turn small daily habits into massive future wealth.
                </p>
            </header>

            {/* Main Insight Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl">

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 opacity-90">Potential Monthly Wealth</h2>
                        <div className="text-6xl font-black mb-2">
                            ${data?.total_monthly_savings?.toFixed(2)}
                            <span className="text-2xl font-medium opacity-70"> / mo</span>
                        </div>
                        <p className="text-indigo-100 text-lg max-w-md">
                            We found this much by analyzing your recurring "non-essential" transactions like coffee, subscriptions, and dining.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <PiggyBank size={20} /> Identified Habits
                        </h3>
                        <ul className="space-y-3">
                            {data?.recurring_items?.length > 0 ? (
                                data.recurring_items.map((item, i) => (
                                    <li key={i} className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                                        <span>{item.name}</span>
                                        <span className="font-mono font-bold">${item.monthly_cost}/mo</span>
                                    </li>
                                ))
                            ) : (
                                <p className="italic opacity-80">No specific recurring habits found, using general estimate.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800">Wealth Projection</h2>
                        <p className="text-gray-500">Comparing different strategies over 5 years.</p>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#888" tickLine={false} />
                            <YAxis
                                stroke="#888"
                                tickLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Legend iconType="circle" />
                            <Line type="monotone" dataKey="Cash (No Growth)" stroke="#9ca3af" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="High Yield Savings (4%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="Market Invest (7%)" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Lump Sum Invest (Hypothetical)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Explainer Blurbs */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="bg-gray-100 rounded-2xl p-4 text-center">
                        <div className="text-2xl mb-2">💵</div>
                        <h4 className="font-bold text-gray-800">Cash</h4>
                        <p className="text-sm text-gray-600">Keeping money under your mattress. 0% growth, loses to inflation.</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                        <div className="text-2xl mb-2">🏦</div>
                        <h4 className="font-bold text-blue-800">High Yield Savings</h4>
                        <p className="text-sm text-blue-600">A savings account that actually pays you. Safe ~4%/year.</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                        <div className="text-2xl mb-2">📈</div>
                        <h4 className="font-bold text-emerald-800">Market Invest (DCA)</h4>
                        <p className="text-sm text-emerald-600">Invest a little each month. Average ~7%/year over time.</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-4 text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <h4 className="font-bold text-purple-800">Lump Sum</h4>
                        <p className="text-sm text-purple-600">Drop a big chunk in at once. More risk, more reward.</p>
                    </div>
                </div>
            </div>

            {/* What If Interactive Section — up to 2 rows of habits */}
            {data?.recurring_items?.length > 0 && (
                <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-5 text-white text-center">
                    <h2 className="text-lg font-black mb-2">🤔 What If You Invested Instead?</h2>
                    <p className="text-orange-100 text-sm mb-4 leading-snug">Tap a habit to see what it could become in 5 years if you invested it instead!</p>

                    <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                        {data.recurring_items.slice(0, 4).map((item, i) => {
                            // Simple 5-year projection at 7%
                            const monthlyAmount = item.monthly_cost || item.amount * 30;
                            const fiveYearValue = Math.round(monthlyAmount * ((Math.pow(1 + 0.07 / 12, 60) - 1) / (0.07 / 12)));

                            return (
                                <button
                                    key={i}
                                    onClick={() => setPopup({ name: item.name, value: fiveYearValue })}
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center min-w-0"
                                >
                                    <span className="truncate">{item.name} → ${fiveYearValue.toLocaleString()}?</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Penny's Insight */}
            <div className="bg-emerald-50 rounded-3xl p-8 border-2 border-emerald-100 flex gap-6 items-start">
                <img
                    src={ScholarlyPenny}
                    alt="Scholarly Penny"
                    className="w-20 h-20 flex-shrink-0 animate-bounce cursor-pointer hover:scale-110 transition-transform rounded-full"
                />
                <div>
                    <h3 className="text-xl font-black text-emerald-800 mb-2">Penny's Prediction</h3>
                    <p className="text-emerald-700 text-lg leading-relaxed">
                        "{data?.commentary || "Start saving today to build your future!"}"
                    </p>
                </div>
            </div>

            {/* Centered Popup Modal */}
            {popup && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setPopup(null)}
                >
                    <div
                        className="bg-white rounded-3xl p-8 max-w-md text-center animate-bounce-in shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-6xl mb-4">💸</div>
                        <h2 className="text-2xl font-black text-gray-800 mb-2">
                            Your {popup.name}
                        </h2>
                        <p className="text-gray-600 mb-4">could become...</p>
                        <div className="text-5xl font-black text-emerald-500 mb-4">
                            ${popup.value.toLocaleString()}
                        </div>
                        <p className="text-gray-500 mb-6">in just 5 years if invested at 7%/year!</p>
                        <button
                            onClick={() => setPopup(null)}
                            className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors"
                        >
                            Cool!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
