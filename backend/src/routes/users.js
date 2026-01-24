import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, deleteAccount } from '../controllers/userController.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.delete('/me', protect, deleteAccount);

export default router;
