import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Progress from './src/models/Progress.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const updateXP = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'son@gmail.com';
        const newXP = 10000;

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User ${email} not found`);
            process.exit(1);
        }

        user.xp = newXP;
        await user.save();
        console.log(`Updated User ${email} XP to ${newXP}`);

        const progress = await Progress.findOne({ user_id: user._id });
        if (progress) {
            progress.xp = newXP;
            await progress.save();
            console.log(`Updated Progress for ${email} XP to ${newXP}`);
        } else {
            // Create progress if missing?
            console.log('Progress record not found, creating one...');
            await Progress.create({ user_id: user._id, xp: newXP });
            console.log('Created Progress record');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateXP();
