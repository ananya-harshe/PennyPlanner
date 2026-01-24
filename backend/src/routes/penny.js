import express from 'express';
import { getPennyTip, getPennyMessage } from '../controllers/pennyController.js';

const router = express.Router();

router.get('/tip', getPennyTip);
router.get('/message', getPennyMessage);

export default router;
