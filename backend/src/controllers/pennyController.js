import { generatePennyTip, generatePennyMessage } from '../services/geminiService.js';

export const getPennyTip = async (req, res) => {
  try {
    const tip = await generatePennyTip();
    res.json({ tip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPennyMessage = async (req, res) => {
  try {
    const { context } = req.query;
    const message = await generatePennyMessage(context);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
