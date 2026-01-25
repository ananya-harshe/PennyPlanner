import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './src/models/User.js';
import Progress from './src/models/Progress.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const TARGET_USERNAME = 'adamhorvitz';
const NEW_XP = 50000;

async function setXP() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: TARGET_USERNAME });
    if (!user) {
      console.log(`User "${TARGET_USERNAME}" not found`);
      process.exit(1);
    }

    user.xp = NEW_XP;
    await user.save();
    console.log(`Updated User "${TARGET_USERNAME}" (${user.email}) XP to ${NEW_XP}`);

    let progress = await Progress.findOne({ user_id: user._id });
    if (progress) {
      progress.xp = NEW_XP;
      await progress.save();
      console.log(`Updated Progress XP to ${NEW_XP}`);
    } else {
      progress = await Progress.create({ user_id: user._id, xp: NEW_XP });
      console.log('Created Progress record with XP', NEW_XP);
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setXP();
