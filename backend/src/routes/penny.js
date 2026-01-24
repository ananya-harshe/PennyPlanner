import express from 'express';
import { protect } from '../middleware/auth.js';
import { getPennyTip, getPennyMessage, chatWithPennyController } from '../controllers/pennyController.js';

const router = express.Router();

router.get('/tip', protect, getPennyTip);
router.get('/message', getPennyMessage);
router.post('/chat', protect, chatWithPennyController);

export default router;

