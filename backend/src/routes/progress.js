import express from 'express';
import { protect } from '../middleware/auth.js';
import { getProgress, refillHearts, redeemReward } from '../controllers/progressController.js';

const router = express.Router();

router.get('/', protect, getProgress);
router.post('/refill-hearts', protect, refillHearts);
router.post('/redeem', protect, redeemReward);

export default router;
