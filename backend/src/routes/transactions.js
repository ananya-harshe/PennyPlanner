import express from 'express';
import { protect } from '../middleware/auth.js';
import { createTransaction, getTransactions, getSpendingAnalysis } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);
router.get('/analysis', protect, getSpendingAnalysis);

export default router;
