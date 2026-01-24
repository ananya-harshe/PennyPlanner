import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Transaction from './src/models/Transaction.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ username: 'adamhorvitz' });
        if (!user) {
            console.log('User "adamhorvitz" not found.');
            process.exit(0);
        }

        console.log(`User ID: ${user._id}`);

        const count = await Transaction.countDocuments({ user_id: user._id });
        console.log(`Transaction Count: ${count}`);

        if (count > 0) {
            const sample = await Transaction.findOne({ user_id: user._id });
            console.log('Sample Transaction:', sample);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
