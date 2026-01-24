import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const randomizeStreaks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            // Random streak between 1 and 30
            const randomStreak = Math.floor(Math.random() * 30) + 1;

            user.streak = randomStreak;
            await user.save();
            console.log(`Updated ${user.username} ('${user.nickname}') streak -> ${randomStreak}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

randomizeStreaks();
