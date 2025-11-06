// routes/announcementRoutes.js
import express from 'express';
import { 
  getAllAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from '../controllers/announcementController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllAnnouncements);
router.post('/', authorizeRoles('admin'), createAnnouncement);
router.put('/:id', authorizeRoles('admin'), updateAnnouncement);
router.delete('/:id', authorizeRoles('admin'), deleteAnnouncement);

export default router;