import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, deleteAccount, getLeaderboard, setDemoXP } from '../controllers/userController.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.delete('/me', protect, deleteAccount);
router.get('/leaderboard', protect, getLeaderboard);
router.put('/demo/xp', protect, setDemoXP);

export default router;
