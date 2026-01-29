import mongoose from 'mongoose';

const dailyQuestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Daily Transaction', 'Daily Saving', 'Daily Check-in', 'Daily Challenge'],
        default: 'Daily Challenge'
    },
    xp_reward: {
        type: Number,
        required: true,
        default: 25
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active'
    },
    // Track what needs to be done
    requirement: {
        type: String,
        required: true, // e.g., "Make 1 transaction", "Save $50", "Check account"
    },
    requirement_type: {
        type: String,
        enum: ['transaction_count', 'transaction_amount', 'account_check', 'custom'],
        required: true
    },
    requirement_value: {
        type: Number,
        required: false // e.g., 1 for transaction count, or 50 for amount
    },
    // Tracking progress
    progress: {
        type: Number,
        default: 0
    },
    target: {
        type: Number,
        required: true
    },
    // Time constraints
    created_date: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    expires_at: {
        type: Date,
        required: true,
        default: () => {
            const date = new Date();
            date.setHours(23, 59, 59, 999);
            return date;
        }
    },
    completed_at: {
        type: Date,
        required: false
    },
    completed_transactions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Transaction',
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for finding active daily quests
dailyQuestSchema.index({ user_id: 1, created_date: 1, status: 1 });
dailyQuestSchema.index({ user_id: 1, expires_at: 1 });

export default mongoose.model('DailyQuest', dailyQuestSchema);
