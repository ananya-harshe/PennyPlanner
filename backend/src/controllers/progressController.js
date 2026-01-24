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
      xp_history: progress?.xp_history || [],
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
}


export const redeemReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    const progress = await Progress.findOne({ user_id: userId });

    if (user.xp < amount) {
      return res.status(400).json({ message: 'Insufficient XP' });
    }

    // Deduct from User
    user.xp -= amount;
    await user.save();

    // Deduct from Progress and keep sync
    if (progress) {
      progress.xp = user.xp;
      await progress.save();
    }

    res.json({
      success: true,
      xp: user.xp,
      message: 'Reward redeemed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
