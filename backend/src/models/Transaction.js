import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['income', 'food', 'entertainment', 'utilities', 'savings', 'other'],
    required: true
  },
  type: {
    type: String,
    enum: ['need', 'want', 'savings'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  is_good_decision: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Transaction', transactionSchema);
