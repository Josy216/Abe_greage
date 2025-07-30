"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express router
const express_1 = require("express");
const service_controller_1 = require("../controller/service.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Create a new router
const router = (0, express_1.Router)();
// Use the getAllServices controller
router.get('/service', auth_middleware_1.verifyToken, service_controller_1.getAllServices);
// Use the addService controller
router.post('/service', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, service_controller_1.addService);
// Use the editService controller
router.put('/service', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, service_controller_1.editService);
// Use the deleteServiceController controller
router.delete('/service/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, service_controller_1.deleteServiceController);
// Export the router
exports.default = router;
