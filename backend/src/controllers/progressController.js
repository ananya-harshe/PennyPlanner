import User from '../models/User.js';
import Progress from '../models/Progress.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const progress = await Progress.findOne({ user_id: userId });

    res.json({
      user_id: user._id,
      username: user.username,
      xp: user.xp,
      daily_xp: user.daily_xp,
      daily_goal: user.daily_goal,
      streak: user.streak,
      hearts: user.hearts,
      gems: user.gems,
      completed_lessons: user.completed_lessons,
      badges: progress?.badges || [],
      last_active: user.last_active
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refillHearts = async (req, res) => {
  try {
    const userId = req.user.id;
    const gemsRequired = 50;

    const user = await User.findById(userId);

    if (user.gems < gemsRequired) {
      return res.status(400).json({ message: 'Not enough gems' });
    }

    user.gems -= gemsRequired;
    user.hearts = 5;
    await user.save();

    res.json({ hearts: 5, gems: user.gems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
