import React, { useState } from 'react';
import { Zap, CheckCircle, Wallet, Flame, Star } from 'lucide-react';
import { theme } from '../theme';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  completed: boolean;
  progress: number;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Budget Master',
      description: 'Create a monthly budget for all spending categories',
      reward: 250,
      difficulty: 'Easy',
      category: 'Budgeting',
      completed: true,
      progress: 100,
    },
    {
      id: '2',
      title: 'Savings Champion',
      description: 'Save $500 this month',
      reward: 500,
      difficulty: 'Medium',
      category: 'Saving',
      completed: false,
      progress: 60,
    },
    {
      id: '3',
      title: 'Debt Destroyer',
      description: 'Pay off one credit card',
      reward: 1000,
      difficulty: 'Hard',
      category: 'Debt Management',
      completed: false,
      progress: 30,
    },
    {
      id: '4',
      title: 'Investment Explorer',
      description: 'Research and start investing in an index fund',
      reward: 750,
      difficulty: 'Hard',
      category: 'Investing',
      completed: false,
      progress: 20,
    },
    {
      id: '5',
      title: 'Expense Tracker',
      description: 'Log expenses for 7 consecutive days',
      reward: 150,
      difficulty: 'Easy',
      category: 'Tracking',
      completed: true,
      progress: 100,
    },
    {
      id: '6',
      title: 'Emergency Fund Builder',
      description: 'Build 3 months of emergency savings',
      reward: 1500,
      difficulty: 'Hard',
      category: 'Saving',
      completed: false,
      progress: 45,
    },
  ]);

  const totalRewards = quests.filter(q => q.completed).reduce((sum, q) => sum + q.reward, 0);
  const completedCount = quests.filter(q => q.completed).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Medium':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCompleteQuest = (questId: string) => {
    setQuests(quests.map(q => (q.id === questId ? { ...q, completed: true, progress: 100 } : q)));
  };

  return (
    <div className="min-h-screen">
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
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/chatbot" className="nav-link">Advice</a>
            <a href="/quests" className="nav-link-active">Quests</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white border-b-4 border-gray-200 px-4">
        <div className={`${theme.spacing.container} py-8`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 rounded-2xl p-3">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-black text-gray-800">Financial Quests</h2>
          </div>
          <p className="text-lg text-gray-700 font-bold mb-6">Complete missions to earn rewards and reach your financial goals</p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card-3d p-4 border-4 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-purple-500 rounded-lg p-2">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-black text-sm">Quests Completed</span>
              </div>
              <p className="text-2xl font-black text-purple-500">{completedCount}/{quests.length}</p>
            </div>
            <div className="card-3d p-4 border-4 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-orange-500 rounded-lg p-2">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-black text-sm">Total Rewards</span>
              </div>
              <p className="text-2xl font-black text-orange-500">${totalRewards}</p>
            </div>
            <div className="card-3d p-4 border-4 border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-emerald-500 rounded-lg p-2">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-black text-sm">In Progress</span>
              </div>
              <p className="text-2xl font-black text-emerald-500">{quests.filter(q => !q.completed).length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quests */}
      <section className="py-8 px-4">
        <div className={`${theme.spacing.container}`}>
          <div className="space-y-4">
            {quests.map(quest => (
              <div
                key={quest.id}
                className={`card-3d p-6 border-4 border-gray-200 ${quest.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {quest.completed && (
                        <div className="bg-emerald-500 rounded-full p-1">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <h3 className="text-2xl font-black text-gray-800">{quest.title}</h3>
                      <span className={`text-xs font-black px-3 py-1 rounded-full border-2 ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-700 font-bold mb-4">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-black text-gray-700">Progress</span>
                        <span className="text-sm font-black text-emerald-500">{quest.progress}%</span>
                      </div>
                      <div className="progress-bar-duolingo">
                        <div
                          className="bg-emerald-500 transition-all duration-500 ease-out"
                          style={{ width: `${quest.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Category and Reward */}
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black px-3 py-1 bg-gray-200 text-gray-700 rounded-full border-2 border-gray-300">
                        {quest.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-400 rounded-full p-1">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-gray-800">${quest.reward}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    {quest.completed ? (
                      <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-2xl border-2 border-emerald-300">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-black text-emerald-700">Done!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteQuest(quest.id)}
                        className="btn-3d-green"
                      >
                        {quest.progress === 100 ? 'Claim' : 'In Progress'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
