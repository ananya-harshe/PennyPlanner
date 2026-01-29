import DailyQuest from '../models/DailyQuest.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import axios from 'axios';

// Get today's daily quests for user
export const getDailyQuests = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's quests
        let dailyQuests = await DailyQuest.find({
            user_id: userId,
            created_date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).sort({ created_at: -1 });

        // If no quests exist for today, generate them
        if (dailyQuests.length === 0) {
            dailyQuests = await generateDailyQuests(userId);
        }

        // Update quest progress based on Nessie transactions
        dailyQuests = await updateDailyQuestProgress(userId, dailyQuests);

        res.status(200).json({ success: true, data: dailyQuests });
    } catch (error) {
        console.error('Error getting daily quests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch daily quests' });
    }
};

// Generate daily quests for a user
export const generateDailyQuests = async (userId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        // Check if already generated today
        const existingQuests = await DailyQuest.findOne({
            user_id: userId,
            created_date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingQuests) {
            return [existingQuests];
        }

        // Create daily quests
        const dailyQuests = [
            {
                user_id: userId,
                title: '💳 Make a Transaction',
                description: 'Make at least 1 transaction today to track your spending',
                type: 'Daily Transaction',
                requirement: 'Make 1 transaction',
                requirement_type: 'transaction_count',
                requirement_value: 1,
                xp_reward: 25,
                progress: 0,
                target: 1,
                created_date: today,
                expires_at: tomorrow,
                status: 'active'
            },
            {
                user_id: userId,
                title: '📊 Account Check-in',
                description: 'Review your account and transactions for the day',
                type: 'Daily Check-in',
                requirement: 'View your account details',
                requirement_type: 'account_check',
                xp_reward: 15,
                progress: 0,
                target: 1,
                created_date: today,
                expires_at: tomorrow,
                status: 'active'
            },
            {
                user_id: userId,
                title: '🎯 Daily Savings Goal',
                description: 'Try to keep your spending under $50 today',
                type: 'Daily Saving',
                requirement: 'Keep spending under $50',
                requirement_type: 'transaction_amount',
                requirement_value: 50,
                xp_reward: 30,
                progress: 0,
                target: 50,
                created_date: today,
                expires_at: tomorrow,
                status: 'active'
            }
        ];

        const createdQuests = await DailyQuest.insertMany(dailyQuests);
        return createdQuests;
    } catch (error) {
        console.error('Error generating daily quests:', error);
        throw error;
    }
};

// Check and update daily quest progress based on transactions
export const updateDailyQuestProgress = async (userId, dailyQuests = null) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get user to fetch accountID
        const user = await User.findById(userId);
        if (!user || !user.accountID) {
            console.warn('⚠️ User has no accountID, cannot fetch Nessie transactions');
            return dailyQuests || [];
        }

        // Fetch today's purchases from Nessie API
        let todayTransactions = [];
        try {
            const nessieUrl = `http://api.nessieisreal.com/accounts/${user.accountID}/purchases?key=${process.env.NESSIE}`;
            const response = await axios.get(nessieUrl);
            
            if (response.data && Array.isArray(response.data)) {
                // Filter transactions for today based on purchase_date
                const todayDateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                
                todayTransactions = response.data.filter(transaction => {
                    const purchaseDateStr = transaction.purchase_date ? transaction.purchase_date.split('T')[0] : null;
                    return purchaseDateStr === todayDateStr;
                });
                
                console.log(`✅ Fetched ${todayTransactions.length} transactions from Nessie for today (${todayDateStr})`);
            }
        } catch (nessieError) {
            console.error('⚠️ Error fetching from Nessie API:', nessieError.message);
            // Fallback to local database if Nessie fails
            todayTransactions = await Transaction.find({
                user_id: userId,
                date: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            });
        }

        // Get today's active daily quests if not provided
        if (!dailyQuests || dailyQuests.length === 0) {
            dailyQuests = await DailyQuest.find({
                user_id: userId,
                created_date: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            });
        }

        // Update quest progress
        for (const quest of dailyQuests) {
            let updatedProgress = 0;

            if (quest.requirement_type === 'transaction_count') {
                // Count transactions
                updatedProgress = todayTransactions.length;
                console.log(`📊 Transaction count quest: ${updatedProgress}/${quest.target}`);
            } else if (quest.requirement_type === 'transaction_amount') {
                // Sum transaction amounts
                updatedProgress = todayTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
                console.log(`💰 Transaction amount quest: $${updatedProgress.toFixed(2)}/$${quest.requirement_value}`);
                
                // For savings goals: if spending exceeds the limit, mark as failed/expired
                if (updatedProgress > quest.requirement_value && quest.status === 'active' && quest.type ) {
                    quest.status = 'expired';
                    console.log(`❌ Daily savings goal failed: Spent $${updatedProgress.toFixed(2)} (limit: $${quest.requirement_value})`);
                    await quest.save();
                    continue;
                }
                
                // For savings goals that haven't failed, set progress to target if under limit
                if (updatedProgress <= quest.requirement_value) {
                    updatedProgress = quest.target;
                }
            } else if (quest.requirement_type === 'account_check') {
                // Account check - mark as progress if they opened the page
                updatedProgress = 1; // Just viewing counts as checking
            }

            // Only update if progress changed
            if (quest.progress !== updatedProgress) {
                quest.progress = updatedProgress;
                quest.markModified('progress');
            }

            // Check if quest is completed (but not for failed savings goals)
            if (updatedProgress >= quest.target && quest.status !== 'completed' && quest.status !== 'expired') {
                quest.status = 'completed';
                quest.completed_at = new Date();
                console.log(`✅ Daily quest completed: ${quest.title}`);
            }

            await quest.save();
        }

        return dailyQuests;
    } catch (error) {
        console.error('Error updating daily quest progress:', error);
        throw error;
    }
};

// Complete a daily quest and award XP
export const completeDailyQuest = async (req, res) => {
    try {
        const { questId } = req.params;
        const userId = req.user.id;

        const dailyQuest = await DailyQuest.findOne({
            _id: questId,
            user_id: userId
        });

        if (!dailyQuest) {
            return res.status(404).json({ success: false, message: 'Daily quest not found' });
        }

        if (dailyQuest.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Quest already completed' });
        }

        // Check if expired
        if (new Date() > dailyQuest.expires_at) {
            dailyQuest.status = 'expired';
            await dailyQuest.save();
            return res.status(400).json({ success: false, message: 'Quest has expired' });
        }

        // Mark as completed
        dailyQuest.status = 'completed';
        dailyQuest.completed_at = new Date();
        await dailyQuest.save();

        // Award XP to user
        const user = await User.findById(userId);
        user.xp = (user.xp || 0) + dailyQuest.xp_reward;
        user.daily_xp = (user.daily_xp || 0) + dailyQuest.xp_reward;
        user.last_active = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Daily quest completed! XP awarded.',
            xp_earned: dailyQuest.xp_reward,
            new_total_xp: user.xp,
            new_daily_xp: user.daily_xp
        });
    } catch (error) {
        console.error('Error completing daily quest:', error);
        res.status(500).json({ success: false, message: 'Failed to complete daily quest' });
    }
};

// Cleanup expired quests
export const cleanupExpiredQuests = async () => {
    try {
        const result = await DailyQuest.updateMany(
            {
                status: 'active',
                expires_at: { $lt: new Date() }
            },
            { status: 'expired' }
        );
        console.log(`✅ Marked ${result.modifiedCount} expired daily quests`);
    } catch (error) {
        console.error('❌ Error cleaning up expired quests:', error);
    }
};
