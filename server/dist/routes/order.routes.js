"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express router
const express_1 = require("express");
// Import the order controller
const order_controller_1 = require("../controller/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Create a new router
const router = (0, express_1.Router)();
// Route to create a new order
router.post('/order', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, order_controller_1.createOrderController);
// Route to get all orders
router.get('/orders', auth_middleware_1.verifyToken, order_controller_1.getAllOrdersController);
// Route to get single order by order ID
router.get('/order/:id', order_controller_1.getSingleOrderController);
// Route to get order by user ID
router.get('/order/user/:user_id', order_controller_1.getOrdersByUserIdController);
// Route to get order by hash (public endpoint - no token required)
router.get('/order/hash/:hash', order_controller_1.getOrderByHashController);
// Route to update order
router.put('/order', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, order_controller_1.updateOrderController);
// Route to update service status
router.patch('/orders/:orderId/services/:serviceId/status', order_controller_1.updateServiceStatusController);
// Route to update service notes
router.patch('/orders/:orderId/services/:serviceId/notes', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, order_controller_1.updateServiceNotes);
// Route to delete order
router.delete('/order/:id', order_controller_1.deleteOrderController);
// Export the router
exports.default = router;
