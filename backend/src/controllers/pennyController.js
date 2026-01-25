import { generatePennyTip, generatePennyMessage, chatWithPenny, generateSpendingInsights, analyzeFuturePlanning } from '../services/geminiService.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import axios from 'axios';

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
      try {
        // Fetch user to get Nessie accountID
        const user = await User.findById(userId);
        if (!user || !user.accountID) {
          console.warn('⚠️ User has no accountID, falling back to local database');
          // Fallback to local database
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

          transactions = await Transaction.find({
            user_id: userId,
            date: { $gte: sixtyDaysAgo }
          }).sort({ date: -1 });
        } else {
          // Fetch from Nessie API
          try {
            const nessieUrl = `http://api.nessieisreal.com/accounts/${user.accountID}/purchases?key=${process.env.NESSIE}`;
            const response = await axios.get(nessieUrl);
            
            if (response.data && Array.isArray(response.data)) {
              console.log(`✅ Fetched ${response.data.length} transactions from Nessie for future planning`);
              
              // Transform Nessie purchases to match local transaction format
              transactions = response.data.map(purchase => ({
                _id: purchase._id,
                description: purchase.description || purchase.merchant_id,
                amount: purchase.amount || 0,
                category: purchase.type || 'Uncategorized',
                date: purchase.purchase_date ? new Date(purchase.purchase_date) : new Date(),
                user_id: userId
              })).sort((a, b) => b.date - a.date);
            }
          } catch (nessieError) {
            console.error('⚠️ Error fetching from Nessie API:', nessieError.message);
            // Fallback to local database
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            transactions = await Transaction.find({
              user_id: userId,
              date: { $gte: sixtyDaysAgo }
            }).sort({ date: -1 });
          }
        }
      } catch (error) {
        console.error('Error fetching user or transactions:', error);
        // Silent fallback - still try to get analysis with empty transactions
      }
    }

    const analysis = await analyzeFuturePlanning(transactions, userId);
    res.json(analysis);
  } catch (error) {
    console.error('Future planning error:', error);
    res.status(500).json({ message: error.message });
  }
};
