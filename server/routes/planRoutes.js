// routes/planRoutes.js
import express from 'express';
import { getAllPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllPlans);
router.post('/', authorizeRoles('admin'), createPlan);
router.put('/:id', authorizeRoles('admin'), updatePlan);
router.delete('/:id', authorizeRoles('admin'), deletePlan);

export default router;