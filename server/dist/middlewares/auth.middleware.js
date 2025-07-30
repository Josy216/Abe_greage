"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("express");
const employee_service_1 = require("../services/employee.service");
// A function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            status: 'fail',
            message: 'No token provided!',
        });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                status: 'fail',
                message: 'Unauthorized!',
            });
        }
        req.employee_email = decoded.employee_email;
        next();
    });
};
exports.verifyToken = verifyToken;
// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
    const employee_email = req.employee_email;
    const employee = await (0, employee_service_1.getEmployeeByEmail)(employee_email);
    if (employee[0].company_role_id === 3) {
        next();
    }
    else {
        return res.status(403).send({
            status: 'fail',
            error: 'Not an Admin!',
        });
    }
};
exports.isAdmin = isAdmin;
