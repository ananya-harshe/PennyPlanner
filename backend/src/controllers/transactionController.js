import Transaction from '../models/Transaction.js';
import { generateSpendingInsights } from '../services/geminiService.js';
import axios from 'axios';

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

    // AI Insights
    const insights = await generateSpendingInsights(transactions);

    // Calculate Decisions & Savings Rate
    const goodDecisions = transactions.filter(t => t.is_good_decision).length;
    const badDecisions = transactions.filter(t => !t.is_good_decision).length;

    const income = transactions.filter(t => t.category === 'income').reduce((acc, t) => acc + t.amount, 0);
    const savings = transactions.filter(t => t.category === 'savings').reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

    res.json({
      total: totalSpent,
      chartData,
      recent: transactions.slice(0, 10),
      insights,
      stats: {
        good_decisions: goodDecisions,
        needs_improvement: badDecisions,
        savings_rate: savingsRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNessieTransactions = async (req, res) => {
  try {
    const { accountID } = req.params;

    if (!accountID) {
      return res.status(400).json({ message: 'accountID is required' });
    }

    console.log(`📍 Fetching Nessie transactions for account: ${accountID}`);

    const nessieUrl = `http://api.nessieisreal.com/accounts/${accountID}/purchases?key=${process.env.NESSIE}`;
    const response = await axios.get(nessieUrl);

    console.log(`✅ Received ${response.data.length} purchases from Nessie`);

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching from Nessie:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch transactions from Nessie',
      error: error.message 
    });
  }
};
