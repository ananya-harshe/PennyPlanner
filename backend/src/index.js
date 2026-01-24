import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import lessonRoutes from './routes/lessons.js';
import quizRoutes from './routes/quiz.js';
import progressRoutes from './routes/progress.js';
import pennyRoutes from './routes/penny.js';
import transactionRoutes from './routes/transactions.js';
import userRoutes from './routes/users.js';
import questRoutes from './routes/quests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
origin: (origin, callback) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://penny-three.vercel.app', // Your Vercel App
    process.env.FRONTEND_URL
  ];

  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    console.log('Blocked by CORS. Origin:', origin);
    callback(new Error('Not allowed by CORS'));
  }
},
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/penny', pennyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quests', questRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
