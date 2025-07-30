"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfEmployeeExists = checkIfEmployeeExists;
exports.createEmployee = createEmployee;
exports.getEmployeeByEmail = getEmployeeByEmail;
exports.getAllEmployee = getAllEmployee;
exports.getSingleEmployees = getSingleEmployees;
exports.updateEmployees = updateEmployees;
exports.deleteEmployees = deleteEmployees;
exports.getEmployeesCount = getEmployeesCount;
// Import the query function from the db.config.js file
const db_config_1 = __importDefault(require("../config/db.config"));
// Import the bcrypt module
const bcrypt_1 = __importDefault(require("bcrypt"));
// A function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
    const query = 'SELECT * FROM employee WHERE employee_email = ? ';
    const rows = await db_config_1.default.query(query, [email]);
    if (rows.length > 0) {
        return true;
    }
    return false;
}
// A function to create a new employee
async function createEmployee(employee) {
    let createdEmployee = {};
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt_1.default.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(employee.employee_password, salt);
        // Insert the email in to the employee table
        const query = 'INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)';
        const rows = await db_config_1.default.query(query, [
            employee.employee_email,
            employee.active_employee,
        ]);
        if (rows.affectedRows !== 1) {
            return false;
        }
        // Get the employee id from the insert
        const employee_id = rows.insertId;
        // Insert the remaining data in to the employee_info, employee_pass, and employee_role tables
        const query2 = 'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)';
        const rows2 = await db_config_1.default.query(query2, [
            employee_id,
            employee.employee_first_name,
            employee.employee_last_name,
            employee.employee_phone,
        ]);
        const query3 = 'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)';
        const rows3 = await db_config_1.default.query(query3, [employee_id, hashedPassword]);
        const query4 = 'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)';
        const rows4 = await db_config_1.default.query(query4, [
            employee_id,
            employee.company_role_id,
        ]);
        // construct to the employee object to return
        createdEmployee = {
            employee_id: employee_id,
        };
    }
    catch (err) {
        console.error(err);
    }
    // Return the employee object
    return createdEmployee;
}
// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
    const query = `
    SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?
  `;
    const rows = await db_config_1.default.query(query, [employee_email]);
    return rows;
}
// A function to get all employees with pagination and search
async function getAllEmployee(page, limit, searchTerm) {
    const offset = (page - 1) * limit;
    let queryParams = [];
    let query = `
    SELECT 
      e.employee_id, e.employee_email, e.active_employee, e.added_date,
      ei.employee_first_name, ei.employee_last_name, ei.employee_phone,
      cr.company_role_name
    FROM employee AS e
    JOIN employee_info AS ei ON e.employee_id = ei.employee_id
    JOIN employee_role AS er ON e.employee_id = er.employee_id
    JOIN company_roles AS cr ON er.company_role_id = cr.company_role_id
  `;
    if (searchTerm) {
        query += ` WHERE ei.employee_first_name LIKE ? OR ei.employee_last_name LIKE ? OR e.employee_email LIKE ?`;
        const searchTermLike = `%${searchTerm}%`;
        queryParams.push(searchTermLike, searchTermLike, searchTermLike);
    }
    query += ` ORDER BY e.employee_id DESC LIMIT ? OFFSET ?;`;
    queryParams.push(limit, offset);
    const rows = await db_config_1.default.query(query, queryParams);
    return rows;
}
// A function to get the total count of employees with search
async function getEmployeesCount(searchTerm) {
    let query = 'SELECT COUNT(*) as total FROM employee e JOIN employee_info ei ON e.employee_id = ei.employee_id';
    let queryParams = [];
    if (searchTerm) {
        query += ` WHERE ei.employee_first_name LIKE ? OR ei.employee_last_name LIKE ? OR e.employee_email LIKE ?`;
        const searchTermLike = `%${searchTerm}%`;
        queryParams.push(searchTermLike, searchTermLike, searchTermLike);
    }
    const rows = await db_config_1.default.query(query, queryParams);
    return rows[0].total;
}
// A function to get all employees
async function getSingleEmployees(id) {
    const query = `SELECT 
      e.employee_id,
      e.employee_email,
      e.active_employee,
      e.added_date,
      ei.employee_info_id,
      ei.employee_first_name,
      ei.employee_last_name,
      ei.employee_phone,
      er.employee_role_id,
      er.company_role_id
  FROM employee e
  LEFT JOIN employee_info ei
      ON e.employee_id = ei.employee_id
  LEFT JOIN employee_role er
      ON e.employee_id = er.employee_id
  WHERE e.employee_id = ?;
`;
    const rows = await db_config_1.default.query(query, [id]);
    return rows;
}
// A function to update an employee
async function updateEmployees(employee) {
    try {
        const query1 = `
      UPDATE employee 
      SET active_employee = ? 
      WHERE employee_id = ?
    `;
        const result1 = await db_config_1.default.query(query1, [
            employee.active_employee,
            employee.employee_id,
        ]);
        const query2 = `
      UPDATE employee_info 
      SET employee_first_name = ?, employee_last_name = ?, employee_phone = ?
      WHERE employee_id = ?
    `;
        const result2 = await db_config_1.default.query(query2, [
            employee.employee_first_name,
            employee.employee_last_name,
            employee.employee_phone,
            employee.employee_id,
        ]);
        const query3 = `
      UPDATE employee_role 
      SET company_role_id = ?
      WHERE employee_id = ?
    `;
        const result3 = await db_config_1.default.query(query3, [
            employee.company_role_id,
            employee.employee_id,
        ]);
        // Check if rows existed (matched), even if no actual change
        if (result1.warningStatus === 0 &&
            result2.warningStatus === 0 &&
            result3.warningStatus === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error('Error updating employee:', err);
        return false;
    }
}
// A function to delete an employee
async function deleteEmployees(employee_id) {
    try {
        await db_config_1.default.query(`DELETE FROM employee_info WHERE employee_id = ?`, [
            employee_id,
        ]);
        await db_config_1.default.query(`DELETE FROM employee_pass WHERE employee_id = ?`, [
            employee_id,
        ]);
        await db_config_1.default.query(`DELETE FROM employee_role WHERE employee_id = ?`, [
            employee_id,
        ]);
        const result = await db_config_1.default.query(`DELETE FROM employee WHERE employee_id = ?`, [employee_id]);
        if (result.affectedRows > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error('Error deleting employee:', err);
        return false;
    }
}
