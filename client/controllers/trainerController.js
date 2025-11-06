import Trainer from '../models/Trainer.js';

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    const savedTrainer = await trainer.save();
    res.status(201).json(savedTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ message: 'Trainer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};