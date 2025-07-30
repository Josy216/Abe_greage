// Import the customer controller
import {
  addCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from '../controller/customer.controller';
// Import the customer controller
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

// Import the express router
import { Router } from 'express';

// Create a new router
const router = Router();

// Use the addCustomerController controller
router.post('/customer', verifyToken, isAdmin, addCustomerController);

// Use the getAllCustomersController controller
router.get('/customer', verifyToken, getAllCustomersController);

// Use the getCustomerByIdController controller
router.get('/customer/:id', verifyToken, getCustomerByIdController);

// Use the updateCustomerController controller
router.put('/customer/:id', verifyToken, isAdmin, updateCustomerController);

// Use the deleteCustomerController controller
router.delete('/customer/:id', deleteCustomerController);

export default router;
