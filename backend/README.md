# DuoPlanning Backend

Complete backend implementation for the DuoPlanning financial education application.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Then edit `.env` with your API keys:
- `MONGODB_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `JWT_SECRET` - Random secret for JWT tokens

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson

### Quiz
- `GET /api/quiz/:lessonId` - Get quiz for lesson
- `POST /api/quiz/:lessonId/complete` - Complete quiz (requires auth)

### Progress
- `GET /api/progress` - Get user progress (requires auth)
- `POST /api/progress/refill-hearts` - Refill hearts with gems (requires auth)

### Penny (AI Tips)
- `GET /api/penny/tip` - Get random money tip
- `GET /api/penny/message?context=home` - Get encouraging message

### Transactions
- `POST /api/transactions` - Create transaction (requires auth)
- `GET /api/transactions` - Get user transactions (requires auth)

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy_...
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:3000
```

## Testing Endpoints

Health check:
```bash
curl http://localhost:5000/api/health
```

Get lessons:
```bash
curl http://localhost:5000/api/lessons
```

Get Penny tip:
```bash
curl http://localhost:5000/api/penny/tip
```

## Troubleshooting

**MongoDB Connection Error**
- Verify MONGODB_URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure internet connection

**Gemini API Error**
- Verify GEMINI_API_KEY in .env
- Check rate limits (60 requests/minute free tier)
- Fallback tips will be used if API fails

**CORS Error**
- Update FRONTEND_URL in .env
- Ensure frontend is running on correct port

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth and error handling
│   ├── services/        # Business logic (Gemini, etc)
│   ├── config/          # Configuration files
│   ├── seeds/           # Database seed scripts
│   └── index.js         # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## API Keys Used

This backend requires the following API keys:

1. **GEMINI_API_KEY** - Google Generative AI for Penny tips
   - Free tier: 60 requests/minute
   - Sign up: https://makersuite.google.com/app/apikey

2. **MONGODB_URI** - MongoDB Atlas database
   - Free tier: 512MB storage
   - Sign up: https://www.mongodb.com/cloud/atlas

3. **JWT_SECRET** - Generated locally for token signing
   - No external service needed
   - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
