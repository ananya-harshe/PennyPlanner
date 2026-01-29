import express from 'express';
import { protect } from '../middleware/auth.js';
import { getQuests, completeQuest, resetQuests } from '../controllers/questController.js';

const router = express.Router();

router.get('/', protect, getQuests);
router.post('/:questId/complete', protect, completeQuest);
router.delete('/reset', protect, resetQuests);

export default router;
