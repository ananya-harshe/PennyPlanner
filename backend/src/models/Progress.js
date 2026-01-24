import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  xp: {
    type: Number,
    default: 0
  },
  daily_xp: {
    type: Number,
    default: 0
  },
  daily_goal: {
    type: Number,
    default: 50
  },
  streak: {
    type: Number,
    default: 0
  },
  last_activity_date: {
    type: Date,
    default: Date.now
  },
  completed_lessons: {
    type: [String],
    default: []
  },
  badges: [{
    id: String,
    earned_at: Date
  }],
  hearts: {
    type: Number,
    default: 5
  },
  gems: {
    type: Number,
    default: 100
  },
  daily_challenge_completed: {
    type: Boolean,
    default: false
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Progress', progressSchema);
