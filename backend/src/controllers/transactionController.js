import Transaction from '../models/Transaction.js';
import { generateSpendingInsights } from '../services/geminiService.js';

export const createTransaction = async (req, res) => {
  try {
    const { description, amount, category, type } = req.body;
    const userId = req.user.id;

    const transaction = await Transaction.create({
      user_id: userId,
      description,
      amount,
      category,
      type
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user_id: userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpendingAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user_id: userId }).sort({ date: -1 });

    // Calculate aggregations
    const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);

    // Group by category
    const categorySpending = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const chartData = Object.entries(categorySpending).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Get AI Insights
    const insights = await generateSpendingInsights(transactions);

    res.json({
      total: totalSpent,
      chartData,
      recent: transactions.slice(0, 10),
      insights
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
