import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Transaction from './src/models/Transaction.js';
import Progress from './src/models/Progress.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CATEGORIES = ['food', 'entertainment', 'utilities', 'savings', 'other']; // 'income' handled separately

const DESCRIPTIONS = {
    food: ['Grocery Store', 'Pizza Place', 'Coffee Shop', 'Fancy Dinner', 'Snack Run'],
    entertainment: ['Netflix Subscription', 'Movie Theater', 'Concert Tickets', 'Video Game', 'Spotify'],
    utilities: ['Electric Bill', 'Water Bill', 'Internet Service', 'Phone Bill'],
    savings: ['Transfer to Savings', 'Investment Deposit', 'Emergency Fund'],
    other: ['Amazon Purchase', 'Gas Station', 'Unknown Expense'],
    income: ['Paycheck', 'Freelance Work', 'Gift']
};

const generateTransactions = async (userId) => {
    await Transaction.deleteMany({ user_id: userId });

    const transactions = [];

    // Add Income
    const incomeDate = new Date();
    incomeDate.setDate(incomeDate.getDate() - 15); // Mid-month
    transactions.push({
        user_id: userId,
        description: 'Monthly Salary',
        amount: 5000 + Math.floor(Math.random() * 500),
        category: 'income',
        type: 'income',
        is_good_decision: true,
        date: incomeDate
    });

    // Add Expenses
    for (let i = 0; i < 40; i++) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const descList = DESCRIPTIONS[category];
        const description = descList[Math.floor(Math.random() * descList.length)];

        let amount = 0;
        let type = 'want';
        let isGood = true;

        if (category === 'savings') {
            amount = 100 + Math.random() * 400;
            type = 'savings';
        } else if (category === 'utilities') {
            amount = 50 + Math.random() * 150;
            type = 'need';
        } else if (category === 'food') {
            amount = 10 + Math.random() * 100;
            type = 'need';
            if (amount > 80) isGood = false; // Expensive dinner
        } else {
            amount = 20 + Math.random() * 100;
            // Randomly mark some entertainment/other as bad decisions
            if (Math.random() > 0.7) isGood = false;
        }

        // Random date in last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        transactions.push({
            user_id: userId,
            description,
            amount: Number(amount.toFixed(2)),
            category,
            type,
            is_good_decision: isGood,
            date
        });
    }

    await Transaction.insertMany(transactions);
    console.log(`Generated ${transactions.length} transactions for user.`);
};

const randomizeUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ username: 'adamhorvitz' });

        if (!user) {
            console.error("User 'adamhorvitz' not found!");
            process.exit(1);
        }

        // Randomize Stats
        user.xp = 5000 + Math.floor(Math.random() * 15000);
        user.streak = Math.floor(Math.random() * 30) + 1;
        user.gems = Math.floor(Math.random() * 500);
        user.daily_xp = Math.floor(Math.random() * 50);
        user.badges = ['First Saver', 'Streak Master', 'Budget Boss'].slice(0, Math.floor(Math.random() * 3) + 1);

        await user.save();
        console.log(`Updated user stats: XP=${user.xp}, Streak=${user.streak}`);

        // Update Progress record too
        const progressBadges = user.badges.map(b => ({ id: b, earned_at: new Date() }));

        await Progress.findOneAndUpdate(
            { user_id: user._id },
            {
                xp: user.xp,
                streak: user.streak,
                daily_xp: user.daily_xp,
                badges: progressBadges
            },
            { upsert: true }
        );

        // Generate Transactions
        await generateTransactions(user._id);

        console.log("Demo data generation complete!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

randomizeUser();
