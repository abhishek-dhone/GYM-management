// routes/statsRoutes.js
import express from 'express';
import { getDashboardStats, getMembershipBreakdown } from '../controllers/statsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All stats routes require authentication
router.use(authenticateToken);

// GET dashboard statistics
router.get('/', getDashboardStats);

// GET membership breakdown
router.get('/breakdown', getMembershipBreakdown);

export default router;