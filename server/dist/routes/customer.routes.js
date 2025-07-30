"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the customer controller
const customer_controller_1 = require("../controller/customer.controller");
// Import the customer controller
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Import the express router
const express_1 = require("express");
// Create a new router
const router = (0, express_1.Router)();
// Use the addCustomerController controller
router.post('/customer', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, customer_controller_1.addCustomerController);
// Use the getAllCustomersController controller
router.get('/customer', auth_middleware_1.verifyToken, customer_controller_1.getAllCustomersController);
// Use the getCustomerByIdController controller
router.get('/customer/:id', auth_middleware_1.verifyToken, customer_controller_1.getCustomerByIdController);
// Use the updateCustomerController controller
router.put('/customer/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, customer_controller_1.updateCustomerController);
// Use the deleteCustomerController controller
router.delete('/customer/:id', customer_controller_1.deleteCustomerController);
exports.default = router;
