import express from 'express';
import { protect } from '../middleware/auth.js';
import { getQuests, completeQuest } from '../controllers/questController.js';

const router = express.Router();

router.get('/', protect, getQuests);
router.post('/:questId/complete', protect, completeQuest);

export default router;
