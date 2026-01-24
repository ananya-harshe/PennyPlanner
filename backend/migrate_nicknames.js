import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const itCharacters = [
    "Richie Tozier", "Eddie Kaspbrak", "Bill Denbrough",
    "Beverly Marsh", "Ben Hanscom", "Mike Hanlon",
    "Stan Uris", "Georgie Denbrough", "Henry Bowers",
    "Pennywise", "Patrick Hockstetter", "Victor Criss", "Belch Huggins"
];

const migrateNicknames = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            // Assign a random character, or sequentially if possible to ensure variety
            const charName = itCharacters[i % itCharacters.length];

            user.nickname = charName;
            await user.save();
            console.log(`Updated ${user.username} -> ${charName}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

migrateNicknames();
