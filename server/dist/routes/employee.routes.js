"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the employee controller
const employee_controller_1 = require("../controller/employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Import the express router
const express_1 = require("express");
// Create a new router
const router = (0, express_1.Router)();
// Use the createEmployees controller
router.post('/employee', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, employee_controller_1.createEmployees);
// Use the getAllEmployees controller
router.get('/employees', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, employee_controller_1.getAllEmployees);
// Use the getSingleEmployee controller
router.get('/employee/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, employee_controller_1.getSingleEmployee);
// Use the updateEmployee controller
router.put('/employee', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, employee_controller_1.updateEmployee);
// Use the deleteEmployee controller
router.delete('/employee/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, employee_controller_1.deleteEmployee);
// Export the router
exports.default = router;
