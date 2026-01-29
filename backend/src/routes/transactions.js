import express from 'express';
import { protect } from '../middleware/auth.js';
import { createTransaction, getTransactions, getSpendingAnalysis, getNessieTransactions } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);
router.get('/analysis', protect, getSpendingAnalysis);
router.get('/nessie/:accountID', protect, getNessieTransactions);

export default router;
