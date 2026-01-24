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
        icon: 'piggy-bank',
        xp_reward: 50,
        is_locked: false,
        order: 1,
        description: 'Learn why saving should be your first priority'
      },
      {
        id: 'lesson2',
        title: 'Track Spending',
        category: 'budgeting',
        icon: 'target',
        xp_reward: 50,
        is_locked: false,
        order: 2,
        description: 'Master the art of tracking every purchase'
      },
      {
        id: 'lesson3',
        title: 'Budget Basics',
        category: 'budgeting',
        icon: 'pie-chart',
        xp_reward: 75,
        is_locked: false,
        order: 3,
        description: 'Learn the 50/30/20 budgeting rule'
      },
      {
        id: 'lesson4',
        title: 'Emergency Fund',
        category: 'budgeting',
        icon: 'shield',
        xp_reward: 75,
        is_locked: false,
        order: 4,
        description: 'Build your financial safety net'
      },
      {
        id: 'lesson5',
        title: 'Investment Intro',
        category: 'investing',
        icon: 'trending-up',
        xp_reward: 100,
        is_locked: true,
        order: 5,
        description: 'Introduction to investing basics'
      },
      {
        id: 'lesson6',
        title: 'Stock Basics',
        category: 'investing',
        icon: 'zap',
        xp_reward: 100,
        is_locked: true,
        order: 6,
        description: 'Understand how stocks work'
      },
      {
        id: 'lesson7',
        title: 'Credit Scores',
        category: 'credit',
        icon: 'credit-card',
        xp_reward: 80,
        is_locked: true,
        order: 7,
        description: 'Master your credit score'
      }
    ];

    await Lesson.insertMany(lessons);
    console.log('✅ Lessons seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
