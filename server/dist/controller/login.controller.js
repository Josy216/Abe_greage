"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = logIn;
const login_service_1 = require("../services/login.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
// Handle employee login 
async function logIn(req, res) {
    try {
        const employeeData = req.body;
        const employee = await (0, login_service_1.login)(employeeData);
        if (employee.status === "fail") {
            res.status(403).json({
                status: employee.status,
                message: employee.message,
            });
        }
        const payload = {
            employee_id: employee.data.employee_id,
            employee_email: employee.data.employee_email,
            employee_role: employee.data.company_role_id,
            employee_first_name: employee.data.employee_first_name,
        };
        const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
            expiresIn: "24h",
        });
        const sendBack = {
            employee_token: token,
        };
        res.status(200).json({
            status: "success",
            message: "Employee logged in successfully",
            data: sendBack,
        });
    }
    catch (error) {
        res.status(403).json({
            status: 'fail',
            message: 'Error while login'
        });
    }
}
