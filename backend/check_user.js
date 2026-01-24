import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ username: 'adamhorvitz' });
        if (user) {
            console.log(`User found: ${user.username} (${user._id})`);
        } else {
            console.log('User "adamhorvitz" not found.');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
