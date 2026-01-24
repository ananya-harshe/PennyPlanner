import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generatePennyTip = async () => {
  try {
    const prompt = 'You are Penny, a friendly frog financial advisor. Give one short sentence money tip for teenagers. Be encouraging and use frog emojis. Keep it under 100 characters. Only respond with the tip, no other text.';
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    // Fallback tips if API fails
    const tips = [
      "Try the 24-hour rule before making purchases! 🐸",
      "Automate your savings - set it and forget it! 🐸",
      "Track every penny - it adds up faster than you think! 🐸",
      "Pay yourself first - save before you spend! 🐸",
      "Build an emergency fund with 3-6 months of expenses! 🐸"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
};

export const generatePennyMessage = async (context = 'general') => {
  try {
    const contextPrompts = {
      home: 'Give an encouraging message to start the day. Keep it under 50 words.',
      learn: 'Give an encouraging message about learning. Keep it under 50 words.',
      lesson_start: 'Give a motivating message to start a quiz. Keep it under 50 words.',
      profile: 'Praise the user for their progress. Keep it under 50 words.'
    };

    const prompt = `You are Penny, a cheerful frog financial advisor. ${contextPrompts[context] || contextPrompts.home} Only respond with the message, no other text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    const messages = {
      home: "Hop to it! Ready to learn something new today? 🐸",
      learn: "Each lesson is a hop toward financial freedom! 🐸",
      lesson_start: "Let's ribbit-et! Time to ace this quiz! 🐸",
      profile: "Look at all you've accomplished! I'm so proud! 🐸"
    };
    return messages[context] || messages.home;
  }
};
