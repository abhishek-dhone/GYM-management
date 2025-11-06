// routes/trainerRoutes.js
import express from 'express';
import { getAllTrainers, createTrainer, updateTrainer, deleteTrainer } from '../controllers/trainerController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllTrainers);
router.post('/', authorizeRoles('admin'), createTrainer);
router.put('/:id', authorizeRoles('admin'), updateTrainer);
router.delete('/:id', authorizeRoles('admin'), deleteTrainer);

export default router;