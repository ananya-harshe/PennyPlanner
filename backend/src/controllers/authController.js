import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { isDbConnected } from '../config/database.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Middleware check for database connectivity
const checkDatabaseConnection = (req, res) => {
  if (!isDbConnected) {
    res.status(503).json({
      message: 'Database temporarily unavailable. Please try again in a moment.',
      error: 'DATABASE_UNAVAILABLE'
    });
    return false;
  }
  return true;
};

export const register = async (req, res) => {
  try {
    if (!checkDatabaseConnection(req, res)) return;

    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const nessieRes = await axios.post(`http://api.nessieisreal.com/customers?key=${process.env.NESSIE}`, {
      first_name: username, 
      last_name: "Customer",
      address: {
        street_number: "123",
        street_name: "Main St",
        city: "New York",
        state: "NY",
        zip: "10001"
      }
    });

    const nessieId = nessieRes.data.objectCreated._id;
    console.log(`Nessie id: ${nessieId}`)

    // Create user
    user = await User.create({
      accountID: nessieId,
      username,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        accountID: user.accountID,
        username: user.username,
        email: user.email,
        xp: user.xp,
        streak: user.streak,
        daily_xp: user.daily_xp,
        daily_goal: user.daily_goal,
        badges: user.badges,
        hearts: user.hearts
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!checkDatabaseConnection(req, res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        streak: user.streak,
        daily_xp: user.daily_xp,
        daily_goal: user.daily_goal,
        badges: user.badges,
        hearts: user.hearts
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!checkDatabaseConnection(req, res)) return;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        streak: user.streak,
        daily_xp: user.daily_xp,
        daily_goal: user.daily_goal,
        badges: user.badges,
        hearts: user.hearts
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
