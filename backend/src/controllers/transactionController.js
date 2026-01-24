import Transaction from '../models/Transaction.js';

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
