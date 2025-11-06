// routes/classRoutes.js
import express from 'express';
import { getAllClasses, createClass, updateClass, deleteClass } from '../controllers/classController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllClasses);
router.post('/', authorizeRoles('admin'), createClass);
router.put('/:id', authorizeRoles('admin'), updateClass);
router.delete('/:id', authorizeRoles('admin'), deleteClass);

export default router;