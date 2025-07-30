"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployees = createEmployees;
exports.getAllEmployees = getAllEmployees;
exports.getSingleEmployee = getSingleEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
const employee_service_1 = require("../services/employee.service");
// create the add employee controller
async function createEmployees(req, res) {
    const employeeExists = await (0, employee_service_1.checkIfEmployeeExists)(req?.body?.employee_email);
    if (employeeExists) {
        res.status(400).json({
            error: 'This email address is already associated with another employee!',
        });
    }
    else {
        try {
            const employeeData = req.body;
            // Create the employee
            const employee = await (0, employee_service_1.createEmployee)(employeeData);
            if (!employee) {
                res.status(400).json({
                    error: 'Failed to add the employee!',
                });
            }
            else {
                res.status(200).json({
                    status: 'true',
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).json({
                error: 'Something went wrong!',
            });
        }
    }
}
// Create the getAllEmployees controller
async function getAllEmployees(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const searchTerm = req.query.search || '';
        const employees = await (0, employee_service_1.getAllEmployee)(page, limit, searchTerm);
        const totalEmployees = await (0, employee_service_1.getEmployeesCount)(searchTerm);
        if (!employees) {
            res.status(404).json({
                error: 'Failed to get employees!',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {
                employees,
                total: totalEmployees,
                page,
                totalPages: Math.ceil(totalEmployees / limit),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!',
        });
    }
}
// Create the getAllEmployees controller
async function getSingleEmployee(req, res) {
    const { id } = req.params;
    // Call the getAllEmployees method from the employee service 
    const employee = await (0, employee_service_1.getSingleEmployees)(id);
    if (!employee) {
        res.status(400).json({
            error: "Failed to get Single employee!"
        });
    }
    else {
        res.status(200).json({
            status: "success",
            data: employee,
        });
    }
}
// Create the getAllEmployees controller
async function updateEmployee(req, res) {
    const isUpdated = await (0, employee_service_1.updateEmployees)(req?.body);
    if (!isUpdated) {
        res.status(400).json({
            error: 'Failed to update employee!',
        });
    }
    else {
        res.status(200).json({
            status: 'success',
        });
    }
}
// Create the getAllEmployees controller
async function deleteEmployee(req, res) {
    const { id } = req.params;
    const isDeleted = await (0, employee_service_1.deleteEmployees)(Number(id));
    if (!isDeleted) {
        res.status(400).json({
            error: 'Failed to delete employee!',
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            message: 'Employee deleted successfully!',
        });
    }
}
