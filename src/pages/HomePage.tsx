import React, { useState } from 'react';
import { ArrowRight, TrendingUp, PieChart, Target, Wallet, Flame, Heart, Zap, Play, Trophy } from 'lucide-react';
import { theme } from '../theme';

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
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

      {/* Game Start Screen Hero */}
      <section className="relative min-h-screen bg-gradient-to-b from-emerald-100 via-sky-50 to-gray-100 px-4 flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">💰</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-bounce delay-200">📈</div>
        <div className="absolute bottom-32 left-1/4 text-6xl opacity-20 animate-bounce delay-100">🎯</div>

        <div className={`${theme.spacing.container} text-center space-y-12 relative z-10`}>
          {/* Game Title */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="card-3d p-8 border-4 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
                <h2 className="text-7xl font-black text-emerald-600 mb-2">
                  PENNY
                </h2>
                <h2 className="text-7xl font-black text-sky-500">
                  PLANNING
                </h2>
                <p className="text-2xl font-black text-gray-700 mt-4">Master Your Money</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-3xl font-black text-gray-800">
                Ready to Level Up Your Finances?
              </p>
              <p className="text-xl font-bold text-gray-700 max-w-2xl mx-auto">
                Embark on an epic quest to master budgeting, crush financial goals, and unlock achievements. No game overs—only wins.
              </p>
            </div>
          </div>

          {/* Big Play Button */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <a
              href="/dashboard"
              className="group relative inline-flex items-center gap-3 bg-emerald-500 text-white font-black rounded-[32px] px-12 py-6 border-b-8 border-emerald-700 hover:bg-emerald-600 active:translate-y-2 active:border-b-4 transition-all duration-100 text-2xl shadow-xl transform hover:scale-105"
            >
              <Play className="w-8 h-8 fill-current" />
              START YOUR ADVENTURE
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition" />
            </a>
            <p className="text-sm font-bold text-gray-600">Click to begin your financial quest</p>
          </div>

          {/* Level Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="card-3d p-6 border-4 border-sky-200 hover:scale-105 transition-transform">
              <div className="bg-sky-500 rounded-2xl p-3 w-fit mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="font-black text-gray-800 text-lg">LEVEL 1</p>
              <p className="font-bold text-gray-700">Budget Mastery</p>
            </div>

            <div className="card-3d p-6 border-4 border-orange-200 hover:scale-105 transition-transform">
              <div className="bg-orange-500 rounded-2xl p-3 w-fit mx-auto mb-3">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <p className="font-black text-gray-800 text-lg">LEVEL 2</p>
              <p className="font-bold text-gray-700">Build Your Streak</p>
            </div>

            <div className="card-3d p-6 border-4 border-red-200 hover:scale-105 transition-transform">
              <div className="bg-red-500 rounded-2xl p-3 w-fit mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="font-black text-gray-800 text-lg">LEVEL 3</p>
              <p className="font-bold text-gray-700">Achieve Glory</p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Features Section */}
      <section className="py-20 px-4 bg-white border-t-4 border-gray-200">
        <div className={`${theme.spacing.container}`}>
          <h3 className="text-5xl font-black text-center text-gray-800 mb-4">Game Features</h3>
          <p className="text-center text-xl font-bold text-gray-700 mb-12">Unlock powerful tools as you progress</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div
              className="card-3d p-8 border-4 border-emerald-200 hover:scale-105 transition-transform cursor-pointer"
              onMouseEnter={() => setHoveredFeature('budget')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-emerald-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-b-4 border-emerald-700">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-gray-800 mb-3 text-center">Budget</h4>
              <p className="text-gray-700 font-bold text-center">Track spending across categories</p>
              {hoveredFeature === 'budget' && (
                <div className="mt-4 pt-4 border-t-2 border-emerald-200">
                  <p className="text-sm font-black text-emerald-600">⭐ Unlock at Level 1</p>
                </div>
              )}
            </div>

            {/* Feature 2 */}
            <div
              className="card-3d p-8 border-4 border-sky-200 hover:scale-105 transition-transform cursor-pointer"
              onMouseEnter={() => setHoveredFeature('analytics')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-sky-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-b-4 border-sky-700">
                <PieChart className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-gray-800 mb-3 text-center">Analytics</h4>
              <p className="text-gray-700 font-bold text-center">Visual spending insights</p>
              {hoveredFeature === 'analytics' && (
                <div className="mt-4 pt-4 border-t-2 border-sky-200">
                  <p className="text-sm font-black text-sky-600">⭐ Unlock at Level 1</p>
                </div>
              )}
            </div>

            {/* Feature 3 */}
            <div
              className="card-3d p-8 border-4 border-orange-200 hover:scale-105 transition-transform cursor-pointer"
              onMouseEnter={() => setHoveredFeature('quests')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-b-4 border-orange-700">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-gray-800 mb-3 text-center">Quests</h4>
              <p className="text-gray-700 font-bold text-center">Complete missions for rewards</p>
              {hoveredFeature === 'quests' && (
                <div className="mt-4 pt-4 border-t-2 border-orange-200">
                  <p className="text-sm font-black text-orange-600">⭐ Unlock at Level 2</p>
                </div>
              )}
            </div>

            {/* Feature 4 */}
            <div
              className="card-3d p-8 border-4 border-red-200 hover:scale-105 transition-transform cursor-pointer"
              onMouseEnter={() => setHoveredFeature('advice')}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-b-4 border-red-700">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-gray-800 mb-3 text-center">AI Advisor</h4>
              <p className="text-gray-700 font-bold text-center">Get smart financial tips</p>
              {hoveredFeature === 'advice' && (
                <div className="mt-4 pt-4 border-t-2 border-red-200">
                  <p className="text-sm font-black text-red-600">⭐ Unlock at Level 2</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-50 to-sky-50">
        <div className={`${theme.spacing.container}`}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-gray-800">Join the Community</h3>
              <p className="text-lg font-bold text-gray-700">Compete with players around the world. Check the leaderboard and climb the ranks as you master your finances.</p>

              <div className="space-y-3">
                {[
                  { rank: '🥇', name: 'Alex Chen', score: '$47,392' },
                  { rank: '🥈', name: 'Jordan Miller', score: '$43,821' },
                  { rank: '🥉', name: 'Casey Rodriguez', score: '$41,205' },
                  { rank: '#4', name: 'You', score: '$0' },
                ].map((player, idx) => (
                  <div key={idx} className="card-3d p-4 border-4 border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black">{player.rank}</span>
                      <div>
                        <p className="font-black text-gray-800">{player.name}</p>
                        <p className="text-sm font-bold text-gray-600">{player.score}</p>
                      </div>
                    </div>
                    <span className="text-xl">💰</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-3d p-12 border-4 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
              <div className="text-center space-y-4">
                <p className="text-6xl font-black text-emerald-500">50K+</p>
                <p className="text-2xl font-black text-gray-800">Active Players</p>
                <p className="text-lg font-bold text-gray-700">Already transforming their finances</p>
                <div className="pt-4 flex justify-center gap-2">
                  <span>⭐⭐⭐⭐⭐</span>
                  <p className="font-black text-gray-800">4.8/5 Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className={`${theme.spacing.container} text-center space-y-8`}>
          <h3 className="text-5xl font-black text-white">No Time to Waste!</h3>
          <p className="text-2xl font-black text-emerald-50 max-w-2xl mx-auto">
            Every day you wait is a day of missed financial growth. Start your adventure now!
          </p>

          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-emerald-500 font-black rounded-[32px] px-12 py-6 border-b-8 border-emerald-700 hover:bg-emerald-50 active:translate-y-2 active:border-b-4 transition-all duration-100 text-xl"
          >
            <Play className="w-6 h-6 fill-current" />
            ENTER THE GAME
          </a>
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
              <p className="font-black">The ultimate money game.</p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-lg">Game</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:text-emerald-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Leaderboard</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Achievements</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-lg">Community</h4>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:text-emerald-400 transition">Discord</a></li>
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
            <p>&copy; 2026 PennyPlanning. Level up your life.</p>
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
