// routes/attendanceRoutes.js
import express from 'express';
import { getTodayAttendance, getAllAttendance, markAttendance } from '../controllers/attendanceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/today', getTodayAttendance);
router.get('/', authorizeRoles('admin'), getAllAttendance);
router.post('/', authorizeRoles('admin'), markAttendance);

export default router;