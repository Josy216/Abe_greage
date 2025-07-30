"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express module
const express_1 = __importDefault(require("express"));
// Create an instance of express
const router = express_1.default.Router();
// Import the install routes
const install_routes_1 = __importDefault(require("./install.routes"));
// Import the employee routes
const employee_routes_1 = __importDefault(require("./employee.routes"));
// Import the login routes
const login_routes_1 = __importDefault(require("./login.routes"));
// Import the service routes
const service_routes_1 = __importDefault(require("./service.routes"));
// Import the customer routes
const customer_routes_1 = __importDefault(require("./customer.routes"));
// Import the vehicle routes
const vehicle_routes_1 = __importDefault(require("./vehicle.routes"));
// Import the order routes
const order_routes_1 = __importDefault(require("./order.routes"));
// Non-API routes
router.use(install_routes_1.default);
// API routes
router.use('/api', employee_routes_1.default);
router.use('/api', login_routes_1.default);
router.use('/api', service_routes_1.default);
router.use('/api', customer_routes_1.default);
router.use('/api', vehicle_routes_1.default);
router.use('/api', order_routes_1.default);
// Export the router to be used in other files
exports.default = router;
