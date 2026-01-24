import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correct_answer: Number,
  explanation: String
}, { _id: false });

const quizSchema = new mongoose.Schema({
  lesson_id: {
    type: String,
    required: true
  },
  title: String,
  questions: [questionSchema],
  generated_at: {
    type: Date,
    default: Date.now
  },
  // Keep for 24 hours then regenerate
  expires_at: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000)
  }
});

export default mongoose.model('Quiz', quizSchema);
