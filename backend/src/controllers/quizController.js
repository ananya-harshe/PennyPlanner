import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

export const getQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if quiz exists and hasn't expired
    let quiz = await Quiz.findOne({ 
      lesson_id: lessonId,
      expires_at: { $gt: new Date() }
    });

    // If no valid quiz, create a default one
    if (!quiz) {
      const defaultQuestions = [
        {
          question: 'What is the first step to financial independence?',
          options: ['Spend more', 'Save money', 'Invest all savings', 'Take a loan'],
          correct_answer: 1,
          explanation: 'Saving is the foundation of financial independence!'
        },
        {
          question: 'How often should you review your budget?',
          options: ['Never', 'Once a year', 'Monthly', 'Every 5 years'],
          correct_answer: 2,
          explanation: 'Monthly reviews help you stay on track!'
        },
        {
          question: 'What does emergency fund mean?',
          options: ['Money for fun', 'Savings for unexpected expenses', 'Investment account', 'Loan money'],
          correct_answer: 1,
          explanation: 'An emergency fund protects you from financial crisis!'
        }
      ];
      
      quiz = await Quiz.create({
        lesson_id: lessonId,
        title: `Quiz for Lesson ${lessonId}`,
        questions: defaultQuestions
      });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { correct_answers, total_questions } = req.query;
    const userId = req.user.id;

    const scorePercentage = correct_answers / total_questions;
    const passed = scorePercentage >= 0.7;
    const xpEarned = Math.round(scorePercentage * 100);

    // Update user progress
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { xp: xpEarned, daily_xp: xpEarned },
        $addToSet: { completed_lessons: lessonId }
      },
      { new: true }
    );

    // Update progress record
    await Progress.findOneAndUpdate(
      { user_id: userId },
      {
        $inc: { xp: xpEarned, daily_xp: xpEarned },
        $addToSet: { completed_lessons: lessonId }
      }
    );

    res.json({
      passed,
      score_percentage: scorePercentage,
      xp_earned: xpEarned,
      perfect: scorePercentage === 1
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
