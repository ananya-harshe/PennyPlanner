import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
let model;

const initGemini = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Updated to use gemini-2.5-flash (the current available model)
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
};

const generateWithRetry = async (prompt, retries = 3) => {
  const model = initGemini();
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      if ((error.status === 429 || error.message.includes('429')) && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.log(`⚠️ Gemini 429 (Rate Limit). Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

export const generatePennyTip = async (transactions = []) => {
  try {
    let contextStr = "";
    if (transactions.length > 0) {
      // Create a brief summary of transactions
      const summary = transactions.slice(0, 5).map(t =>
        `${t.category}: $${t.amount}`
      ).join(', ');
      contextStr = `Recent spending: ${summary}.`;
    }

    const prompt = `You are Penny, a financial advisor frog 🐸. 
    ${contextStr}
    Based on this spending, give one specific tip. if they spent a lot on "want" categories, mention it gently.
    Example: "I see you spent $15 on coffee! Try making it at home? 🐸"
    Keep it under 140 characters. Use frog emojis.`;
    const text = await generateWithRetry(prompt);
    return text;
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
    const text = await generateWithRetry(prompt);
    return text;
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

// Chat function for the chatbot
export const chatWithPenny = async (userMessage, transactions = []) => {
  try {
    let contextStr = "";
    if (transactions.length > 0) {
      const summary = transactions.slice(0, 5).map(t =>
        `${t.category}: $${t.amount} (${t.type})`
      ).join(', ');
      contextStr = `User's recent transactions: ${summary}. Reference these if relevant to the advice.`;
    }

    const prompt = `You are Penny, a friendly and knowledgeable financial advisor frog 🐸. 
    You help teens and young adults learn about money management, budgeting, saving, investing, and credit.
    ${contextStr}
    Keep your responses concise (1-3 sentences), helpful, and encouraging. 
    Use occasional frog emojis to stay in character.
    
    User's question: ${userMessage}
    
    Provide a helpful, friendly response:`;
    const text = await generateWithRetry(prompt);
    return text;
  } catch (error) {
    console.error('Gemini chat error:', error);
    // Fallback responses
    const fallbacks = [
      "Ribbit! That's a great question about money! The key is to always spend less than you earn and save the difference. 🐸",
      "Hop on over to budgeting basics! Track your spending for a week and you'll be amazed where your money goes. 🐸",
      "Great thinking about your finances! Remember: pay yourself first by saving before spending. 🐸"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

// Generate spending insights/compliments
export const generateSpendingInsights = async (transactions = []) => {
  try {
    let contextStr = "User has no transactions yet.";
    if (transactions.length > 0) {
      // Calculate basic stats for context
      const total = transactions.reduce((sum, t) => sum + t.amount, 0);
      const categories = [...new Set(transactions.map(t => t.category))].join(', ');

      contextStr = `Total spent: $${total}. Categories: ${categories}. 
      Recent transactions: ${transactions.slice(0, 5).map(t => `${t.description} ($${t.amount})`).join(', ')}`;
    }

    const prompt = `You are Penny, a supportive financial frog friend 🐸.
    Analyze this spending data: ${contextStr}
    
    Give 1-2 sentences of constructive feedback. 
    focus on the POSITIVE if possible (e.g. "Good job tracking!"), or a gentle suggestion if spending is high on specific wants.
    Always be encouraging and use a frog emoji.
    Respond ONLY with the insight text.`;

    const text = await generateWithRetry(prompt);
    return text;
  } catch (error) {
    console.error('Gemini insights error:', error);
    return "Great job tracking your spending! Keep an eye on those needs vs wants! 🐸";
  }
};

// Generate a quiz based on a lesson topic
export const generateQuizQuestions = async (lessonTopic, userProfile = {}) => {
  try {
    const difficulty = userProfile.xp > 1000 ? 'intermediate' : 'beginner';

    const prompt = `You are Penny, a financial educator frog 🐸. 
    Create a fun, multiple-choice quiz about "${lessonTopic}".
    Target audience: Teens/Young Adults (${difficulty} level).
    
    Generate exactly 3 questions in this JSON format:
    [
      {
        "question": "The question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": 0, // index of correct option (0-3)
        "explanation": "Short, encouraging explanation of why this is correct."
      }
    ]
    
    Make the tone fun and encouraging. Use frog emojis in the explanation only.
    IMPORTANT: Respond ONLY with the JSON array. No markdown formatting.`;

    console.log(`🎯 Generating quiz for topic: "${lessonTopic}" (${difficulty} level)...`);
    const text = await generateWithRetry(prompt);

    // Clean up potential markdown code blocks if the model adds them
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Attempt to extract array if it's wrapped in text
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }

    const questions = JSON.parse(jsonStr);

    // Ensure correct_answer is always a Number, not a string
    const validatedQuestions = questions.map(q => ({
      ...q,
      correct_answer: Number(q.correct_answer)
    }));

    console.log('✨ GEMINI GENERATED QUIZ:', JSON.stringify(validatedQuestions, null, 2));
    console.log(`✅ Successfully generated ${validatedQuestions.length} questions for "${lessonTopic}"`);
    return validatedQuestions;
  } catch (error) {
    console.error('❌ Gemini quiz generation error:', error.message);
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    console.log('⚠️ Falling back to default questions...');

    // Fallback if generation fails
    return [
      {
        question: `What is the most important rule about ${lessonTopic || 'money'}?`,
        options: ['Spend it all', 'Save first, spend later', 'Hide it under a rock', 'Buy flies'],
        correct_answer: 1,
        explanation: 'Saving first ensures you have money for your goals! 🐸'
      },
      {
        question: 'How does compound interest help you?',
        options: ['It doesnt', 'It makes money grow faster', 'It costs money', 'It is a type of frog'],
        correct_answer: 1,
        explanation: 'Compound interest is like magic for your money! 🐸'
      },
      {
        question: 'Why should you track expenses?',
        options: ['To be boring', 'To know where money goes', 'To stop spending', 'To count pennies'],
        correct_answer: 1,
        explanation: 'Knowing where your money goes helps you control it! 🐸'
      }
    ];
  }
};

