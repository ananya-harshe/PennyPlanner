import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

import { generateQuizQuestions } from '../services/geminiService.js';
import Lesson from '../models/Lesson.js';

export const getQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if quiz exists and hasn't expired
    let quiz = await Quiz.findOne({
      lesson_id: lessonId,
      expires_at: { $gt: new Date() }
    });

    // If no valid quiz, create a new one using Gemini
    if (!quiz) {
      // Get lesson details for context
      const lesson = await Lesson.findOne({ id: lessonId });
      const lessonTopic = lesson ? lesson.title : `Lesson ${lessonId}`;

      // Get user details for difficulty adjustment
      // Note: req.user might be undefined if auth middleware isn't strict, 
      // but protect middleware should ensure it.
      const userProfile = req.user ? { xp: req.user.xp } : {};

      const questions = await generateQuizQuestions(lessonTopic, userProfile);

      // Validate and ensure correct_answer is always a Number
      const validatedQuestions = questions.map(q => ({
        ...q,
        correct_answer: Number(q.correct_answer)
      }));

      quiz = await Quiz.create({
        lesson_id: lessonId,
        title: `Quiz: ${lessonTopic}`,
        questions: validatedQuestions,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // Cache for 24 hours
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
    // Update progress record
    let progress = await Progress.findOne({ user_id: userId });
    if (!progress) {
      // If no progress record exists, create one (should generally exist, but safe fallback)
      progress = await Progress.create({ user_id: userId });
    }

    // Update standard fields
    progress.xp += xpEarned;
    progress.daily_xp += xpEarned;
    if (!progress.completed_lessons.includes(lessonId)) {
      progress.completed_lessons.push(lessonId);
    }

    // Update XP history
    const today = new Date().toISOString().split('T')[0];
    const historyIndex = progress.xp_history.findIndex(h => h.date === today);

    if (historyIndex > -1) {
      progress.xp_history[historyIndex].xp += xpEarned;
    } else {
      progress.xp_history.push({ date: today, xp: xpEarned });
    }

    // Keep only last 30 days of history to prevent infinite growth
    if (progress.xp_history.length > 30) {
      progress.xp_history = progress.xp_history.slice(-30);
    }

    await progress.save();

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
