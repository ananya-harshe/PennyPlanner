import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Lesson from '../models/Lesson.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Lesson.deleteMany({});

    // Create lessons
    const lessons = [
      {
        id: 'lesson1',
        title: 'Save First',
        category: 'budgeting',
        icon: '🐷',
        xp_reward: 50,
        is_locked: false,
        order: 1,
        description: 'Learn why saving should be your first priority'
      },
      {
        id: 'lesson2',
        title: 'Track Spending',
        category: 'budgeting',
        icon: '🎯',
        xp_reward: 50,
        is_locked: false,
        order: 2,
        description: 'Master the art of tracking every purchase'
      },
      {
        id: 'lesson3',
        title: 'Budget Basics',
        category: 'budgeting',
        icon: '📊',
        xp_reward: 75,
        is_locked: false,
        order: 3,
        description: 'Learn the 50/30/20 budgeting rule'
      },
      {
        id: 'lesson4',
        title: 'Emergency Fund',
        category: 'budgeting',
        icon: '🛡️',
        xp_reward: 75,
        is_locked: false,
        order: 4,
        description: 'Build your financial safety net'
      },
      {
        id: 'lesson5',
        title: 'Investment Intro',
        category: 'investing',
        icon: '📈',
        xp_reward: 100,
        is_locked: true,
        order: 5,
        description: 'Introduction to investing basics'
      },
      {
        id: 'lesson6',
        title: 'Stock Basics',
        category: 'investing',
        icon: '⚡',
        xp_reward: 100,
        is_locked: true,
        order: 6,
        description: 'Understand how stocks work'
      },
      {
        id: 'lesson7',
        title: 'Credit Scores',
        category: 'credit',
        icon: '💳',
        xp_reward: 80,
        is_locked: true,
        order: 7,
        description: 'Master your credit score'
      }
    ];

    await Lesson.insertMany(lessons);
    console.log('✅ Lessons seeded successfully');

    // Seed/Update test user progress with historical data for demo
    const User = (await import('../models/User.js')).default;
    const Progress = (await import('../models/Progress.js')).default;

    // Generate last 7 days of data
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      history.push({
        date: d.toISOString().split('T')[0],
        xp: Math.floor(Math.random() * 150) + 50 // Random XP between 50-200
      });
    }

    // Update all progress records with this history
    await Progress.updateMany({}, {
      $set: { xp_history: history, xp: 1250 }
    });
    console.log('✅ User progress seeded with history');

    // Seed dummy transactions for all users
    const Transaction = (await import('../models/Transaction.js')).default;
    const users = await User.find({});
    // Clear existing transactions first to avoid duplicates on re-run
    await Transaction.deleteMany({});

    const transactionTemplates = [
      { description: 'Starbucks Coffee', amount: 5.50, category: 'food', type: 'want' },
      { description: 'Netflix Subscription', amount: 15.99, category: 'entertainment', type: 'want' },
      { description: 'Grocery Store', amount: 45.20, category: 'food', type: 'need' },
      { description: 'Amazon Order', amount: 25.00, category: 'entertainment', type: 'want' },
      { description: 'Uber Ride', amount: 18.50, category: 'other', type: 'want' },
      { description: 'Electric Bill', amount: 85.00, category: 'utilities', type: 'need' },
      { description: 'Paycheck', amount: 500.00, category: 'income', type: 'savings' }
    ];

    for (const user of users) {
      const userTransactions = [];
      for (let i = 0; i < 8; i++) {
        const template = transactionTemplates[i % transactionTemplates.length];
        // Random date within last 7 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));

        userTransactions.push({
          user_id: user._id,
          description: template.description,
          amount: template.amount,
          category: template.category,
          type: template.type,
          date: date,
          is_good_decision: template.type === 'need' || template.type === 'savings'
        });
      }
      await Transaction.insertMany(userTransactions);
    }
    console.log(`✅ Seeded transactions for ${users.length} users`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
