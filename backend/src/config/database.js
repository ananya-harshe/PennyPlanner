import mongoose from 'mongoose';

export let isDbConnected = false;

export const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isDbConnected = true;
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
      isDbConnected = false;
      setTimeout(() => connectDB(0), retryDelay);
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isDbConnected = false;
    });
    
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.error(`❌ Database connection error (attempt ${retryCount + 1}/${maxRetries + 1}):`, error.message);
    
    if (retryCount < maxRetries) {
      console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectDB(retryCount + 1);
    } else {
      console.error('❌ Max retries reached. Server will run without database connection.');
      console.error('💡 To fix: Add your IP to MongoDB Atlas whitelist or use a local MongoDB instance.');
      // Don't exit - let the server run without DB
      return null;
    }
  }
};

// Check if database is connected
export const checkDbConnection = () => isDbConnected;
