// Import the employee controller
import {
  createEmployees,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controller/employee.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

// Import the express router
import { Router } from 'express';

// Create a new router
const router = Router();

// Use the createEmployees controller
router.post('/employee', verifyToken, isAdmin, createEmployees);

// Use the getAllEmployees controller
router.get('/employees', verifyToken, isAdmin, getAllEmployees);

// Use the getSingleEmployee controller
router.get('/employee/:id', verifyToken, isAdmin, getSingleEmployee);

// Use the updateEmployee controller
router.put('/employee', verifyToken, isAdmin, updateEmployee);

// Use the deleteEmployee controller
router.delete('/employee/:id', verifyToken, isAdmin, deleteEmployee);

// Export the router
export default router;