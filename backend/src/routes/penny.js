import express from 'express';
import { protect } from '../middleware/auth.js';
import { getPennyTip, getPennyMessage, chatWithPennyController, getPennyInsights, getFuturePlanningAnalysis } from '../controllers/pennyController.js';

const router = express.Router();

router.get('/tip', protect, getPennyTip);
router.get('/message', getPennyMessage);
router.get('/insights', protect, getPennyInsights);
router.post('/chat', protect, chatWithPennyController);
router.get('/future-planning', protect, getFuturePlanningAnalysis);

export default router;

