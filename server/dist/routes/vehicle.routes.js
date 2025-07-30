"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express router
const express_1 = require("express");
const vehicle_controller_1 = require("../controller/vehicle.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Create a new router
const router = (0, express_1.Router)();
// Use the addVehicle controller
router.post('/vehicle', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, vehicle_controller_1.addVehicle);
// Use the updateVehicleController controller
router.put('/vehicle/:vehicle_id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, vehicle_controller_1.updateVehicleController);
// Use the getVehiclesByCustomerIdController controller
router.get('/vehicles/:customer_id', auth_middleware_1.verifyToken, vehicle_controller_1.getVehiclesByCustomerIdController);
// Use the getSingleVehicleController controller
router.get('/vehicle/:vehicle_id', auth_middleware_1.verifyToken, vehicle_controller_1.getSingleVehicleController);
// Use the deleteVehicleController controller
router.delete('/vehicle/:vehicle_id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, vehicle_controller_1.deleteVehicleController);
// Export the router
exports.default = router;
