// routes/memberRoutes.js
import express from 'express';
import { 
  getAllMembers, 
  getMemberById, 
  createMember, 
  updateMember, 
  deleteMember,
  getMemberStats
} from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ⚠️ IMPORTANT: Specific routes MUST come BEFORE parameterized routes
// GET member statistics - admin only (MUST BE BEFORE /:id route)
router.get('/stats', authorizeRoles('admin'), getMemberStats);

// GET all members - accessible by all authenticated users
router.get('/', getAllMembers);

// GET single member - accessible by all authenticated users
router.get('/:id', getMemberById);

// POST create member - admin only
router.post('/', authorizeRoles('admin'), createMember);

// PUT update member - admin only
router.put('/:id', authorizeRoles('admin'), updateMember);

// DELETE member - admin only
router.delete('/:id', authorizeRoles('admin'), deleteMember);

export default router;