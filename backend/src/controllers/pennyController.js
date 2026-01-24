import { generatePennyTip, generatePennyMessage, chatWithPenny, generateSpendingInsights, analyzeFuturePlanning } from '../services/geminiService.js';
import Transaction from '../models/Transaction.js';

export const getPennyTip = async (req, res) => {
  try {
    const userId = req.user?.id;
    let transactions = [];

    if (userId) {
      transactions = await Transaction.find({ user_id: userId })
        .sort({ date: -1 })
        .limit(5);
    }

    const tip = await generatePennyTip(transactions);
    res.json({ tip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPennyMessage = async (req, res) => {
  try {
    const { context } = req.query;
    const message = await generatePennyMessage(context);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chatWithPennyController = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    let transactions = [];
    if (userId) {
      transactions = await Transaction.find({ user_id: userId })
        .sort({ date: -1 })
        .limit(5);
    }

    const response = await chatWithPenny(message, transactions);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPennyInsights = async (req, res) => {
  try {
    const userId = req.user?.id;
    let transactions = [];

    if (userId) {
      // Fetch more history for better context
      transactions = await Transaction.find({ user_id: userId })
        .sort({ date: -1 })
        .limit(10);
    }

    const insight = await generateSpendingInsights(transactions);
    res.json({ insight });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getFuturePlanningAnalysis = async (req, res) => {
  try {
    const userId = req.user?.id;
    let transactions = [];

    if (userId) {
      // Fetch 60 days of history for analysis
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      transactions = await Transaction.find({
        user_id: userId,
        date: { $gte: sixtyDaysAgo }
      }).sort({ date: -1 });
    }

    const analysis = await analyzeFuturePlanning(transactions, userId);
    res.json(analysis);
  } catch (error) {
    console.error('Future planning error:', error);
    res.status(500).json({ message: error.message });
  }
};
