import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a goal title'],
        trim: true,
        maxlength: 50
    },
    target_amount: {
        type: Number,
        required: [true, 'Please provide a target amount']
    },
    current_amount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    },
    type: {
        type: String,
        enum: ['savings', 'spending_limit'],
        default: 'savings'
    },
    category: { // e.g. 'food' if it's a spending limit on food
        type: String
    },
    icon: { // For UI display (e.g., 'car', 'house', 'piggy-bank')
        type: String,
        default: 'piggy-bank'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Calculate progress percentage virtually
goalSchema.virtual('progress').get(function () {
    if (this.target_amount === 0) return 0;
    return Math.min((this.current_amount / this.target_amount) * 100, 100);
});

// Ensure virtuals are included in JSON
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

export default mongoose.model('Goal', goalSchema);
