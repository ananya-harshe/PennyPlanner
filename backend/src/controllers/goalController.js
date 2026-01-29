import Goal from '../models/Goal.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user_id: req.user.id }).sort({ created_at: -1 });
        res.status(200).json({ success: true, count: goals.length, data: goals });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
    try {
        // Basic validation
        if (!req.body.title || !req.body.target_amount) {
            return res.status(400).json({ success: false, error: 'Please provide title and target amount' });
        }

        const goal = await Goal.create({
            user_id: req.user.id,
            ...req.body
        });

        res.status(201).json({ success: true, data: goal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a goal (e.g. add money to savings)
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ success: false, error: 'Goal not found' });
        }

        // Ensure user owns goal
        if (goal.user_id.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ success: false, error: 'Goal not found' });
        }

        if (goal.user_id.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await goal.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get Insight (Compare spending vs goals)
// @route   GET /api/goals/insights
// @access  Private
export const getGoalInsights = async (req, res) => {
    try {
        const goals = await Goal.find({ user_id: req.user.id });

        // Simple insight logic: usually AI would do this, but for now we do simple math
        let insights = [];

        // Check savings progress
        const activeSavings = goals.filter(g => g.type === 'savings' && g.current_amount < g.target_amount);
        if (activeSavings.length > 0) {
            // Find closest to completion
            const sorted = activeSavings.sort((a, b) => b.progress - a.progress);
            const top = sorted[0];
            insights.push({
                type: 'positive',
                message: `You're ${Math.round(top.progress)}% of the way to your "${top.title}" goal! Keep it up! 🚀`
            });
        }

        res.status(200).json({ success: true, insights });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add money to a goal
// @route   PUT /api/goals/:id/add-money
// @access  Private
export const addMoneyToGoal = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
        }

        let goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ success: false, message: 'Goal not found' });
        }

        // Ensure user owns goal
        if (goal.user_id.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Add money to goal
        goal.current_amount = (goal.current_amount || 0) + parseFloat(amount);

        // Check if goal is completed
        if (goal.current_amount >= goal.target_amount) {
            goal.completed = true;
            goal.completed_at = new Date();
        }

        await goal.save();

        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
