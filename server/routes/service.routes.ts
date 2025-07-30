// Import the express router
import { Router } from 'express';
import {
  addService,
  getAllServices,
  editService,
  deleteServiceController,
} from '../controller/service.controller';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware';

// Create a new router
const router = Router();

// Use the getAllServices controller
router.get('/service', verifyToken, getAllServices);

// Use the addService controller
router.post('/service', verifyToken, isAdmin, addService);

// Use the editService controller
router.put('/service', verifyToken, isAdmin, editService);

// Use the deleteServiceController controller
router.delete('/service/:id', verifyToken, isAdmin, deleteServiceController);

// Export the router
export default router;
