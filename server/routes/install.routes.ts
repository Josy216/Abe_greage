// Import the express module
import express from 'express';
// Import the install controller
import { install } from '../controller/install.controller';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware';

// Create an instance of express framework
const router = express.Router();

// Create a route to install the database tables at once
router.get('/install', verifyToken, isAdmin, install);

// Export the router to be used in other files
export default router;
