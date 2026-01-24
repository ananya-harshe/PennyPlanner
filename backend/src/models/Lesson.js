import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['budgeting', 'investing', 'credit'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  xp_reward: {
    type: Number,
    default: 50
  },
  is_locked: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  content: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lesson', lessonSchema);
