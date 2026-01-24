import Quest from '../models/Quest.js';
import Transaction from '../models/Transaction.js';
import { generateProceduralQuests } from '../services/geminiService.js';
import User from '../models/User.js';

export const getQuests = async (req, res) => {
    try {
        console.log('\n🎯 [QUEST GENERATION] Starting quest fetch...');
        const overallStart = Date.now();
        const userId = req.user.id;

        // 1. Purge invalid quests (old schema or empty questions)
        const purgeStart = Date.now();
        await Quest.deleteMany({
            user_id: userId,
            status: 'active',
            $or: [
                { questions: { $exists: false } },
                { questions: { $size: 0 } }
            ]
        });
        console.log(`⏱️  [PURGE] Deleted invalid quests in ${Date.now() - purgeStart}ms`);

        // 2. Check for active quests
        const queryStart = Date.now();
        let activeQuests = await Quest.find({ user_id: userId, status: 'active' });
        console.log(`⏱️  [DB QUERY] Found ${activeQuests.length} active quests in ${Date.now() - queryStart}ms`);

        // 2. If no active quests, generate new batch
        if (activeQuests.length === 0) {
            console.log('🔄 No active quests found. Regenerating batch...');

            // Fetch recent transactions for context
            const txStart = Date.now();
            const transactions = await Transaction.find({ user_id: userId })
                .sort({ date: -1 })
                .limit(20);
            console.log(`⏱️  [TRANSACTIONS] Fetched ${transactions.length} transactions in ${Date.now() - txStart}ms`);

            // Generate procedural quests via Gemini
            const geminiStart = Date.now();
            console.log('🤖 [GEMINI API] Starting quest generation...');
            const newQuestsData = await generateProceduralQuests(transactions);
            const geminiTime = Date.now() - geminiStart;
            console.log(`⏱️  [GEMINI API] ⚠️  BOTTLENECK: Generated quests in ${geminiTime}ms (${(geminiTime / 1000).toFixed(2)}s)`);

            // Save to database
            const insertStart = Date.now();
            const questDocs = newQuestsData.map(q => ({
                ...q,
                user_id: userId,
                status: 'active'
            }));

            activeQuests = await Quest.insertMany(questDocs);
            console.log(`⏱️  [DB INSERT] Saved ${activeQuests.length} quests in ${Date.now() - insertStart}ms`);
        }

        const totalTime = Date.now() - overallStart;
        console.log(`✅ [TOTAL] Quest fetch completed in ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)\n`);
        res.json(activeQuests);
    } catch (error) {
        console.error('❌ [ERROR] Failed to get quests:', error);
        res.status(500).json({ message: error.message });
    }
};

// Complete quest (called after user passes all questions on frontend)
export const completeQuest = async (req, res) => {
    try {
        const { questId } = req.params;
        const userId = req.user.id;

        const quest = await Quest.findOne({ _id: questId, user_id: userId });

        if (!quest) {
            return res.status(404).json({ message: 'Quest not found' });
        }

        if (quest.status === 'completed') {
            return res.status(400).json({ message: 'Quest already completed' });
        }

        // Mark complete
        quest.status = 'completed';
        await quest.save();

        // Award XP
        // Award XP
        const user = await User.findById(userId);
        user.xp = (user.xp || 0) + quest.xp_reward;

        // Update Daily Goal Progress
        // Check if last_active was today, if not, reset daily_xp first (simple check)
        const today = new Date().toDateString();
        const lastActive = new Date(user.last_active).toDateString();

        if (today !== lastActive) {
            user.daily_xp = 0;
        }

        user.daily_xp = (user.daily_xp || 0) + quest.xp_reward;
        user.last_active = new Date();

        // Check for level up or badges? (simplified for now)
        user.completed_lessons.push(quest._id.toString());

        await user.save();

        return res.json({
            success: true,
            message: 'Quest completed! XP awarded.',
            xp_earned: quest.xp_reward,
            new_total_xp: user.xp
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
