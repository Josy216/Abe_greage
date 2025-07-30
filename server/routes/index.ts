// Import the express module
import express from 'express';

// Create an instance of express
const router = express.Router();

// Import the install routes
import installRoutes from './install.routes';

// Import the employee routes
import employeeRoutes from './employee.routes';

// Import the login routes
import loginRoutes from './login.routes';

// Import the service routes
import serviceRoutes from './service.routes';

// Import the customer routes
import customerRoutes from './customer.routes';

// Import the vehicle routes
import vehicleRoutes from './vehicle.routes';

// Import the order routes
import orderRoutes from './order.routes';

// Non-API routes
router.use(installRoutes);

// API routes
router.use('/api', employeeRoutes);
router.use('/api', loginRoutes);
router.use('/api', serviceRoutes);
router.use('/api', customerRoutes);
router.use('/api', vehicleRoutes);
router.use('/api', orderRoutes);

// Export the router to be used in other files
export default router;
