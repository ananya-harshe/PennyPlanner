import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Quiz from '../models/Quiz.js';

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { daily_goal, nickname } = req.body;

        // Update Progress model where daily_goal is effectively stored/used
        // Note: User model also has daily_goal in the schema shown in view_file, 
        // so we should probably update both to stay in sync or prefer one. 
        // The previous view_file showed User has daily_goal, and Progress has daily_goal.
        // I will update BOTH to be safe and consistent.

        if (daily_goal) {
            await User.findByIdAndUpdate(userId, { daily_goal });
            await Progress.findOneAndUpdate({ user_id: userId }, { daily_goal });
        }

        if (nickname) {
            await User.findByIdAndUpdate(userId, { nickname });
        }

        res.json({ message: 'Profile updated successfully', daily_goal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete User
        await User.findByIdAndDelete(userId);

        // Delete Progress
        await Progress.findOneAndDelete({ user_id: userId });

        // Delete Quizzes associated with this user? 
        // Quizzes seem to be specific to lessons not users directly in the basic schema, 
        // but looking at quizController, they are created per lesson. 
        // If we want to be thorough we could, but minimal req is delete account.

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .sort({ xp: -1 })
            .limit(10)
            .select('username nickname xp badges gems streak'); // Select fields to display

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
