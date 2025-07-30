"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express module
const express_1 = __importDefault(require("express"));
// Import the install controller
const install_controller_1 = require("../controller/install.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Create an instance of express
const router = express_1.default.Router();
// Create a route to install the database
router.get('/install', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, install_controller_1.install);
// Export the router to be used in other files
exports.default = router;
