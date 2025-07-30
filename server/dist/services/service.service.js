"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addServices = addServices;
exports.getAllService = getAllService;
exports.editServices = editServices;
exports.deleteService = deleteService;
// Import the query function from the db.config.js file
const db_config_1 = __importDefault(require("../config/db.config"));
// Function to add a new service
async function addServices(formData) {
    try {
        const query = 'INSERT INTO common_services (service_name, service_description) VALUES (?, ?)';
        const rows = await db_config_1.default.query(query, [
            formData.service_name,
            formData.service_description,
        ]);
        if (rows.affectedRows !== 1) {
            return false;
        }
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
// Function to get all services
async function getAllService() {
    try {
        const query = 'SELECT service_id, service_name, service_description FROM common_services';
        const rows = await db_config_1.default.query(query);
        return rows;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}
// Function to edit a service
async function editServices(formData) {
    try {
        const query = 'UPDATE common_services SET service_name = ?, service_description = ? WHERE service_id = ?';
        const rows = await db_config_1.default.query(query, [
            formData.service_name,
            formData.service_description,
            formData.service_id,
        ]);
        if (rows.affectedRows !== 1) {
            return false;
        }
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
// Function to delete a service
async function deleteService(service_id) {
    try {
        const query = `DELETE FROM common_services WHERE service_id = ?`;
        const result = await db_config_1.default.query(query, [service_id]);
        return result.affectedRows > 0; // Return true if a row was deleted
    }
    catch (err) {
        console.error('Error deleting service:', err);
        return false;
    }
}
