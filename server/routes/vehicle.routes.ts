// Import the express router
import { Router } from 'express';
import {
  addVehicle,
  getVehiclesByCustomerIdController,
  updateVehicleController,
  getSingleVehicleController,
  deleteVehicleController
} from '../controller/vehicle.controller';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware';

// Create a new router
const router = Router();

// Use the addVehicle controller
router.post('/vehicle', verifyToken, isAdmin, addVehicle);

// Use the updateVehicleController controller
router.put('/vehicle/:vehicle_id', verifyToken, isAdmin, updateVehicleController);

// Use the getVehiclesByCustomerIdController controller
router.get('/vehicles/:customer_id', verifyToken, getVehiclesByCustomerIdController);

// Use the getSingleVehicleController controller
router.get('/vehicle/:vehicle_id', verifyToken, getSingleVehicleController);

// Use the deleteVehicleController controller
router.delete('/vehicle/:vehicle_id', verifyToken, isAdmin, deleteVehicleController);

// Export the router
export default router;
