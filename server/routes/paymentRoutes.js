// routes/paymentRoutes.js
import express from 'express';
import { getAllPayments, createPayment, updatePaymentStatus } from '../controllers/paymentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRoles('admin'), getAllPayments);
router.post('/', authorizeRoles('admin'), createPayment);
router.patch('/:id', authorizeRoles('admin'), updatePaymentStatus);

export default router;