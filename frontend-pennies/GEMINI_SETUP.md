# Gemini API Setup Guide

## For the Advice (Chatbot) Page

### Step 1: Get Your Free Gemini API Key

1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API Key" or "Create API Key"
3. Sign in with your Google account (or create one)
4. Create a new API key
5. Copy the API key

### Step 2: Add to .env File

In `/frontend-pennies/.env`, replace this line:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual API key:
```
VITE_GEMINI_API_KEY=AIzaSyD1234567890abcdef
```

### Step 3: Restart the Dev Server

1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again
3. The Advice page will now use real AI responses

## How It Works

- The app calls Google's Gemini API to generate financial advice
- Penny (the frog) will give personalized responses to your questions
- No API key? You'll see a warning telling you to set it up

## Free Tier Limits

- 60 requests per minute
- Perfect for testing and learning
- You can upgrade to a paid plan if you need more requests

## Example Questions to Ask Penny

- "How can I save money?"
- "What's the best way to invest?"
- "How do I budget my income?"
- "What should I do about credit card debt?"
- "How much should I save each month?"

## Troubleshooting

**Issue**: "I need my API key configured!"
- **Solution**: Make sure VITE_GEMINI_API_KEY is in your .env file and the dev server was restarted

**Issue**: "I'm having trouble connecting to my AI brain"
- **Solution**: Check your internet connection and API key validity

**Issue**: No response after sending a message
- **Solution**: Check browser console (F12) for error messages
