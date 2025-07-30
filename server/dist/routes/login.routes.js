"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express module
const express_1 = __importDefault(require("express"));
// Create an instance of express
const router = express_1.default.Router();
// Import the login controller
const login_controller_1 = require("../controller/login.controller");
// Route to log in an employee
router.post('/employee/login', login_controller_1.logIn);
// Export the router
exports.default = router;
