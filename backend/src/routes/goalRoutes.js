import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal, getGoalInsights } from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
    .get(getGoals)
    .post(createGoal);

router.route('/insights')
    .get(getGoalInsights);

router.route('/:id')
    .put(updateGoal)
    .delete(deleteGoal);

export default router;
