import express from 'express';
import { protect } from '../middleware/auth.js';
import { createTransaction, getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);

export default router;
