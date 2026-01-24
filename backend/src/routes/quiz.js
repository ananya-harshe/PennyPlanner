import express from 'express';
import { protect } from '../middleware/auth.js';
import { getQuiz, completeQuiz } from '../controllers/quizController.js';

const router = express.Router();

router.get('/:lessonId', getQuiz);
router.post('/:lessonId/complete', protect, completeQuiz);

export default router;
