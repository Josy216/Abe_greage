// Import the express router
import { Router } from 'express';
import conn from '../config/db.config';

// Import the order controller
import {
  createOrderController,
  getAllOrdersController,
  getSingleOrderController,
  updateOrderController,
  getOrderByHashController,
  updateServiceNotes,
  updateServiceStatusController,
  getOrdersByUserIdController,
  deleteOrderController,
} from '../controller/order.controller';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware';

// Create a new router
const router = Router();

// Route to create a new order
router.post('/order', verifyToken, isAdmin, createOrderController);

// Route to get all orders
router.get('/orders', verifyToken, getAllOrdersController);

// Route to get single order by order ID
router.get('/order/:id', getSingleOrderController);

// Route to get order by user ID
router.get('/order/user/:user_id', getOrdersByUserIdController);

// Route to get order by hash (public endpoint - no token required)
router.get('/order/hash/:hash', getOrderByHashController);

// Route to update order
router.put('/order', verifyToken, isAdmin, updateOrderController);

// Route to update service status
router.patch(
  '/orders/:orderId/services/:serviceId/status',
  updateServiceStatusController
);

// Route to update service notes
router.patch(
  '/orders/:orderId/services/:serviceId/notes',
  verifyToken,
  isAdmin,
  updateServiceNotes
);

// Route to delete order
router.delete('/order/:id', deleteOrderController);

// Export the router
export default router;
