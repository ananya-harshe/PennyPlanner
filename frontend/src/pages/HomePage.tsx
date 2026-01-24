import React from 'react';
import { ArrowRight, TrendingUp, PieChart, Target, Wallet, Flame, Heart, Zap } from 'lucide-react';
import { theme } from '../theme';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white sticky top-0 z-50 border-b-4 border-gray-200 shadow-lg">
        <div className={`${theme.spacing.container} py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 rounded-2xl p-2">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-800">PennyPlanning</h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="/" className="nav-link-active">Home</a>
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/chatbot" className="nav-link">Advice</a>
            <a href="/quests" className="nav-link">Quests</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className={`${theme.spacing.container} text-center space-y-8`}>
          <div>
            <h2 className="text-6xl font-black text-gray-800 mb-4">
              Take Control of Your <span className="text-emerald-500">Financial Future</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Learn to save, invest, and reach your goals with PennyPlanning. Fun, gamified, and actually effective.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <a href="/dashboard" className="btn-3d-green flex items-center gap-2">
              Start Planning
              <ArrowRight className="w-5 h-5" />
            </a>
            <button className="bg-white text-emerald-500 font-black rounded-2xl px-8 py-3 border-b-4 border-gray-400 hover:bg-gray-50 active:translate-y-1 active:border-b-2 transition-all duration-100">
              Watch Demo
            </button>
          </div>

          {/* Hero Card */}
          <div className="card-3d p-8 mt-12 border-4 border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-emerald-100 to-sky-100 rounded-2xl flex flex-col items-center justify-center gap-4">
              <TrendingUp className="w-20 h-20 text-emerald-500" />
              <p className="text-lg font-bold text-gray-800">Your Financial Dashboard Awaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white border-t-4 border-gray-200">
        <div className={`${theme.spacing.container}`}>
          <h3 className="text-4xl font-black text-center text-gray-800 mb-12">Why PennyPlanning?</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="card-3d p-8 border-4 border-emerald-200 hover:scale-105">
              <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-black text-gray-800 mb-3">Budget Tracking</h4>
              <p className="text-gray-700 font-bold">Monitor your spending and stay on top of your money.</p>
            </div>

            {/* Feature 2 */}
            <div className="card-3d p-8 border-4 border-sky-200 hover:scale-105">
              <div className="bg-sky-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-black text-gray-800 mb-3">Visual Analytics</h4>
              <p className="text-gray-700 font-bold">See your spending patterns with beautiful charts.</p>
            </div>

            {/* Feature 3 */}
            <div className="card-3d p-8 border-4 border-orange-200 hover:scale-105">
              <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-black text-gray-800 mb-3">Goal Setting</h4>
              <p className="text-gray-700 font-bold">Set milestones and track your progress to success.</p>
            </div>

            {/* Feature 4 */}
            <div className="card-3d p-8 border-4 border-red-200 hover:scale-105">
              <div className="bg-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-black text-gray-800 mb-3">Smart Insights</h4>
              <p className="text-gray-700 font-bold">Get AI-powered advice tailored to your finances.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className={`${theme.spacing.container}`}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-gray-800">Gamified Learning</h3>
              <p className="text-lg text-gray-700 font-bold">PennyPlanning uses game mechanics to make financial learning fun. Earn streaks, complete quests, and unlock achievements.</p>

              <div className="space-y-4">
                {[
                  { icon: Flame, text: 'Build daily streaks', color: 'text-orange-500' },
                  { icon: Heart, text: 'Compete with friends', color: 'text-red-500' },
                  { icon: Zap, text: 'Unlock powerful quests', color: 'text-sky-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-white rounded-2xl p-3 border-2 border-gray-300">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="font-black text-gray-800 text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-3d p-8 border-4 border-emerald-200">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-sky-50 p-6 rounded-2xl border-2 border-emerald-200">
                  <p className="text-2xl font-black text-emerald-500">50K+</p>
                  <p className="text-gray-700 font-black">Active Users</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-200">
                  <p className="text-2xl font-black text-orange-500">$2.5B+</p>
                  <p className="text-gray-700 font-black">Money Tracked</p>
                </div>
                <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-6 rounded-2xl border-2 border-sky-200">
                  <p className="text-2xl font-black text-sky-500">4.8/5 ⭐</p>
                  <p className="text-gray-700 font-black">User Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-emerald-500">
        <div className={`${theme.spacing.container} text-center space-y-6`}>
          <h3 className="text-4xl font-black text-white">Ready to Transform Your Finances?</h3>
          <p className="text-lg text-white font-black max-w-2xl mx-auto">
            Join thousands of users already taking control of their financial future.
          </p>
          <button className="bg-white text-emerald-500 font-black rounded-2xl px-10 py-4 border-b-4 border-emerald-700 hover:bg-gray-50 active:translate-y-1 active:border-b-2 transition-all duration-100 text-lg">
            Start Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 border-t-4 border-gray-900">
        <div className={`${theme.spacing.container}`}>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-500 rounded-2xl p-2">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-xl">PennyPlanning</span>
              </div>
              <p className="font-black">Your personal finance companion.</p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-lg">Product</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:text-emerald-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-lg">Company</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:text-emerald-400 transition">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-lg">Legal</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:text-emerald-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-gray-700 pt-8 text-center font-black">
            <p>&copy; 2026 PennyPlanning. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Character Space */}
      <div className="character-space">
        <div className="mascot-peek text-6xl">🤡</div>
      </div>
    </div>
  );
}
