"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfCustomerExists = checkIfCustomerExists;
exports.createCustomer = createCustomer;
exports.getAllCustomers = getAllCustomers;
exports.getCustomersCount = getCustomersCount;
exports.getCustomerById = getCustomerById;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
// Import the query function from the db.config.js file
const db_config_1 = __importDefault(require("../config/db.config"));
// Import the bcrypt module
const bcrypt_1 = __importDefault(require("bcrypt"));
// A function to check if customer exists in the database
async function checkIfCustomerExists(email) {
    const query = 'SELECT * FROM customer_identifier WHERE customer_email = ?';
    const rows = await db_config_1.default.query(query, [email]);
    return rows.length > 0;
}
// A function to create a new customer
async function createCustomer(customer) {
    let createdCustomer = {};
    try {
        // Generate a hash for the customer
        const salt = await bcrypt_1.default.genSalt(10);
        const customer_hash = await bcrypt_1.default.hash(customer.customer_email, salt);
        // Insert the email, phone number, and hash into the customer_identifier table
        const query1 = 'INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)';
        const result1 = await db_config_1.default.query(query1, [
            customer.customer_email,
            customer.customer_phone_number,
            customer_hash,
        ]);
        if (result1.affectedRows !== 1) {
            return false;
        }
        // Get the customer id from the insert
        const customer_id = result1.insertId;
        // Insert the remaining data into the customer_info table
        const query2 = 'INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)';
        await db_config_1.default.query(query2, [
            customer_id,
            customer.customer_first_name,
            customer.customer_last_name,
            customer.active_customer_status,
        ]);
        // construct the customer object to return
        createdCustomer = {
            customer_id: customer_id,
        };
    }
    catch (err) {
        console.error(err);
        return false; // Return false on error
    }
    // Return the created customer object
    return createdCustomer;
}
// A function to get all customers with pagination and search
async function getAllCustomers(page, limit, searchTerm) {
    const offset = (page - 1) * limit;
    let queryParams = [];
    let query = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_added_date,
      cinfo.customer_first_name,
      cinfo.customer_last_name,
      cinfo.active_customer_status
    FROM 
      customer_identifier AS ci
    JOIN 
      customer_info AS cinfo ON ci.customer_id = cinfo.customer_id
  `;
    if (searchTerm) {
        query += ` WHERE cinfo.customer_first_name LIKE ? OR cinfo.customer_last_name LIKE ? OR ci.customer_email LIKE ?`;
        const searchTermLike = `%${searchTerm}%`;
        queryParams.push(searchTermLike, searchTermLike, searchTermLike);
    }
    query += ` ORDER BY ci.customer_id DESC LIMIT ? OFFSET ?;`;
    queryParams.push(limit, offset);
    const rows = await db_config_1.default.query(query, queryParams);
    return rows;
}
// A function to get the total count of customers with search
async function getCustomersCount(searchTerm) {
    let query = `
    SELECT COUNT(*) as total 
    FROM customer_identifier AS ci 
    JOIN customer_info AS cinfo ON ci.customer_id = cinfo.customer_id
  `;
    let queryParams = [];
    if (searchTerm) {
        query += ` WHERE cinfo.customer_first_name LIKE ? OR cinfo.customer_last_name LIKE ? OR ci.customer_email LIKE ?`;
        const searchTermLike = `%${searchTerm}%`;
        queryParams.push(searchTermLike, searchTermLike, searchTermLike);
    }
    const rows = await db_config_1.default.query(query, queryParams);
    return rows[0].total;
}
// A function to get a single customer by ID
async function getCustomerById(customerId) {
    const query = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_hash,
      cinfo.customer_first_name,
      cinfo.customer_last_name,
      cinfo.active_customer_status
    FROM 
      customer_identifier AS ci
    JOIN 
      customer_info AS cinfo ON ci.customer_id = cinfo.customer_id
    WHERE 
      ci.customer_id = ?`;
    const rows = await db_config_1.default.query(query, [customerId]);
    if (rows && rows.length > 0) {
        return rows[0];
    }
    return null;
}
// A function to update a customer
async function updateCustomer(customerId, customer) {
    try {
        // Update customer_info table
        const query1 = `
      UPDATE customer_info 
      SET 
        customer_first_name = ?, 
        customer_last_name = ?, 
        active_customer_status = ? 
      WHERE 
        customer_id = ?`;
        await db_config_1.default.query(query1, [
            customer.customer_first_name,
            customer.customer_last_name,
            customer.active_customer_status,
            customerId,
        ]);
        // Update customer_identifier table
        const query2 = `
      UPDATE customer_identifier 
      SET 
        customer_phone_number = ? 
      WHERE 
        customer_id = ?`;
        await db_config_1.default.query(query2, [customer.customer_phone_number, customerId]);
        return { customer_id: customerId, ...customer };
    }
    catch (error) {
        console.error('Error updating customer:', error);
        return false;
    }
}
// A function to delete a customer
async function deleteCustomer(id) {
    try {
        // First, check if customer exists
        const query = 'SELECT COUNT(*) as count FROM customer_identifier WHERE customer_id = ?';
        const countResult = await db_config_1.default.query(query, [id]);
        // Try different ways to access the count
        let count = 0;
        if (Array.isArray(countResult) && countResult.length > 0) {
            const firstElement = countResult[0];
            if (Array.isArray(firstElement) && firstElement.length > 0) {
                // Case: [[{count: 1}]]
                count = firstElement[0]?.count || 0;
            }
            else if (firstElement &&
                typeof firstElement === 'object' &&
                'count' in firstElement) {
                // Case: [{count: 1}]
                count = firstElement.count || 0;
            }
        }
        const customerExists = count > 0;
        if (!customerExists) {
            return {
                success: false,
                message: 'No customer found with the specified ID',
                rowsAffected: 0,
            };
        }
        // 1. Get all order_ids for this customer first
        const ordersResult = await db_config_1.default.query('SELECT order_id FROM orders WHERE customer_id = ?', [id]);
        const orders = Array.isArray(ordersResult) ? ordersResult[0] : [];
        if (Array.isArray(orders) && orders.length > 0) {
            const orderIds = orders.map((order) => order.order_id);
            // Delete from order_services first (depends on order_id)
            if (orderIds.length > 0) {
                await db_config_1.default.query('DELETE FROM order_services WHERE order_id IN (?)', [
                    orderIds,
                ]);
                // Delete from order_status (depends on order_id)
                await db_config_1.default.query('DELETE FROM order_status WHERE order_id IN (?)', [
                    orderIds,
                ]);
                // Delete from order_info (depends on order_id)
                await db_config_1.default.query('DELETE FROM order_info WHERE order_id IN (?)', [
                    orderIds,
                ]);
            }
            // Now delete from orders (depends on customer_id and vehicle_id)
            await db_config_1.default.query('DELETE FROM orders WHERE customer_id = ?', [id]);
        }
        // 2. Delete from customer_vehicle_info (depends on customer_id)
        await db_config_1.default.query('DELETE FROM customer_vehicle_info WHERE customer_id = ?', [id]);
        // 3. Delete from customer_info (depends on customer_id)
        await db_config_1.default.query('DELETE FROM customer_info WHERE customer_id = ?', [id]);
        // 4. Finally, delete from customer_identifier (primary table)
        const result = await db_config_1.default.query('DELETE FROM customer_identifier WHERE customer_id = ?', [id]);
        const resultObj = Array.isArray(result) ? result[0] : result;
        const rowsAffected = resultObj?.affectedRows || 0;
        if (rowsAffected > 0) {
            return {
                success: true,
                message: 'Customer and all related data deleted successfully',
                rowsAffected: rowsAffected,
            };
        }
        else {
            return {
                success: false,
                message: 'Failed to delete customer',
                rowsAffected: 0,
            };
        }
    }
    catch (err) {
        console.error('Error deleting customer:', err);
        throw err; // Re-throw the error to be handled by the controller
    }
}
