import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { getQuiz } from './src/controllers/quizController.js';
import User from './src/models/User.js';
import Quiz from './src/models/Quiz.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const mockRes = {
    json: (data) => console.log('Response JSON:', JSON.stringify(data, null, 2)),
    status: (code) => ({ json: (data) => console.log(`Error ${code}:`, data) })
};

async function testQuizGen() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Find a test user or create a mock req.user
    const user = await User.findOne();
    if (!user) {
        console.log('No user found');
        return;
    }

    const req = {
        params: { lessonId: 'intro-to-saving' }, // Mock lesson ID
        user: user
    };

    // Clear existing quiz to force generation
    await Quiz.deleteMany({ lesson_id: 'intro-to-saving' });
    console.log('Cleared existing quizzes for lesson');

    console.log('Requesting quiz...');
    await getQuiz(req, mockRes);

    console.log('Done');
    await mongoose.disconnect();
}

testQuizGen();
