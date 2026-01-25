import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
    getDailyQuests, 
    completeDailyQuest, 
    updateDailyQuestProgress 
} from '../controllers/dailyQuestController.js';

const router = express.Router();

// Get today's daily quests
router.get('/', protect, getDailyQuests);

// Update progress for daily quests (called after transaction)
router.post('/update-progress', protect, async (req, res) => {
    try {
        const { updateDailyQuestProgress } = await import('../controllers/dailyQuestController.js');
        const quests = await updateDailyQuestProgress(req.user.id);
        res.status(200).json({ success: true, data: quests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update quest progress' });
    }
});

// Complete a daily quest
router.post('/:questId/complete', protect, completeDailyQuest);

export default router;
