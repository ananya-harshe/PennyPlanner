import Lesson from '../models/Lesson.js';

export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ id: req.params.id });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
