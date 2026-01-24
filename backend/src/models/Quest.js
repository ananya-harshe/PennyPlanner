import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
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
        enum: ['Spending Slayer', 'Asset Builder', 'Knowledge Heist', 'Lifestyle Pivot', 'General'],
        default: 'General'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    xp_reward: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    generated_reason: {
        type: String,
        required: true
    },
    questions: {
        type: [{
            question: { type: String, required: true },
            options: { type: [String], required: true },
            correct_answer: { type: Number, required: true },
            explanation: { type: String, required: true },
            context_source: { type: String, enum: ['theory', 'transaction'], default: 'theory' }
        }],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length === 4;
            },
            message: 'Quest must have exactly 4 questions'
        }
    },
    verification_criteria: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Quest', questSchema);
