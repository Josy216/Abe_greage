// Import the express module
import express from 'express';

// Create an instance of express
const router = express.Router();

// Import the login controller for funcition
import { logIn } from '../controller/login.controller';

// Route to log in an employee
router.post('/employee/login', logIn);

// Export the router
export default router;