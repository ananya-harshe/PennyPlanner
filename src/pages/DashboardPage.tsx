import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Wallet, CreditCard, Flame, Heart } from 'lucide-react';
import { theme } from '../theme';

interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

export default function DashboardPage() {
  const [transactions] = useState<Transaction[]>([
    { id: '1', category: 'Groceries', amount: 125.50, date: '2026-01-23', type: 'expense' },
    { id: '2', category: 'Salary', amount: 3500, date: '2026-01-20', type: 'income' },
    { id: '3', category: 'Entertainment', amount: 45.99, date: '2026-01-22', type: 'expense' },
    { id: '4', category: 'Utilities', amount: 89.00, date: '2026-01-21', type: 'expense' },
    { id: '5', category: 'Transport', amount: 35.00, date: '2026-01-23', type: 'expense' },
  ]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(c => c.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 border-b-4 border-gray-200 shadow-lg">
        <div className={`${theme.spacing.container} py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 rounded-2xl p-2">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-800">PennyPlanning</h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="/" className="nav-link">Home</a>
            <a href="/dashboard" className="nav-link-active">Dashboard</a>
            <a href="/chatbot" className="nav-link">Advice</a>
            <a href="/quests" className="nav-link">Quests</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white border-b-4 border-gray-200 px-4">
        <div className={`${theme.spacing.container} py-8`}>
          <h2 className="text-4xl font-black text-gray-800 mb-8">Financial Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="card-3d p-6 border-4 border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-700">Balance</h3>
                <div className="bg-emerald-500 rounded-2xl p-3">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-500">${balance.toFixed(2)}</p>
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
              <p className="text-3xl font-black text-sky-500">${totalIncome.toFixed(2)}</p>
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
              <p className="text-3xl font-black text-red-500">${totalExpenses.toFixed(2)}</p>
              <p className="text-sm font-bold text-gray-600 mt-2">This month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className={`${theme.spacing.container}`}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Spending by Category */}
            <div className="lg:col-span-2 card-3d p-8 border-4 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500 rounded-2xl p-3">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">Spending by Category</h3>
              </div>
              <div className="space-y-6">
                {categorySpending.map((item, idx) => {
                  const percentage = (item.amount / totalExpenses) * 100;
                  const colors = [
                    'bg-emerald-500',
                    'bg-sky-500',
                    'bg-orange-500',
                    'bg-red-500',
                    'bg-purple-500',
                  ];
                  return (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2">
                        <span className="font-black text-gray-700">{item.category}</span>
                        <span className="font-black text-emerald-500">${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="progress-bar-duolingo">
                        <div
                          className={`${colors[idx % colors.length]} transition-all`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card-3d p-8 border-4 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-sky-500 rounded-2xl p-3">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">Recent</h3>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b-2 border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-black text-gray-800">{transaction.category}</p>
                      <p className="text-xs font-bold text-gray-500">{transaction.date}</p>
                    </div>
                    <span
                      className={`font-black ${
                        transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 border-t-4 border-gray-900 mt-8">
        <div className={`${theme.spacing.container} text-center font-black`}>
          <p>&copy; 2026 PennyPlanning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
