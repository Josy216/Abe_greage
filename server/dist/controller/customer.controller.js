"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomerController = addCustomerController;
exports.getAllCustomersController = getAllCustomersController;
exports.getCustomerByIdController = getCustomerByIdController;
exports.updateCustomerController = updateCustomerController;
exports.deleteCustomerController = deleteCustomerController;
const customer_service_1 = require("../services/customer.service");
// Create the add customer controller
async function addCustomerController(req, res) {
    try {
        // Check if a customer with the given email already exists
        const customerExists = await (0, customer_service_1.checkIfCustomerExists)(req?.body?.customer_email);
        if (customerExists) {
            res.status(403).json({
                error: 'This email address is already associated with another customer!',
            });
        }
        else {
            const customerData = req.body;
            // Create the customer
            const customer = await (0, customer_service_1.createCustomer)(customerData);
            if (!customer) {
                res.status(400).json({
                    error: 'Failed to add the customer!',
                });
            }
            else {
                res.status(201).json({
                    status: 'success',
                    message: 'Customer added successfully!',
                    data: customer,
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong on the server!',
        });
    }
}
// Controller to get all customers
async function getAllCustomersController(req, res, next) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const searchTerm = req.query.search || '';
        const customers = await (0, customer_service_1.getAllCustomers)(page, limit, searchTerm);
        const totalCustomers = await (0, customer_service_1.getCustomersCount)(searchTerm);
        if (!customers) {
            res.status(404).json({
                error: 'No customers found!',
            });
        }
        else {
            res.status(200).json({
                status: 'success',
                message: 'Customers retrieved successfully!',
                data: {
                    customers,
                    total: totalCustomers,
                    page,
                    totalPages: Math.ceil(totalCustomers / limit),
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
}
// Controller to get a single customer by ID
async function getCustomerByIdController(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid customer ID' });
            return;
        }
        const customer = await (0, customer_service_1.getCustomerById)(id);
        if (customer) {
            res.status(200).json({ data: customer });
        }
        else {
            res.status(404).json({ error: 'Customer not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong on the server!' });
    }
}
// Controller to update a customer
async function updateCustomerController(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid customer ID' });
            return;
        }
        const customerData = req.body;
        const updatedCustomer = await (0, customer_service_1.updateCustomer)(id, customerData);
        if (updatedCustomer) {
            res.status(200).json({
                status: 'success',
                message: 'Customer updated successfully!',
                data: updatedCustomer,
            });
        }
        else {
            res.status(404).json({ error: 'Failed to update customer or customer not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong on the server!' });
    }
}
// Controller to delete a customer
async function deleteCustomerController(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid customer ID' });
            return;
        }
        const result = await (0, customer_service_1.deleteCustomer)(id);
        if (result.success) {
            res.status(200).json({
                status: 'success',
                message: result.message,
                data: {
                    customer_id: id,
                    rows_affected: result.rowsAffected
                }
            });
        }
        else {
            res.status(404).json({
                error: result.message || 'Customer not found or could not be deleted'
            });
        }
    }
    catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            error: 'Something went wrong while deleting the customer',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
