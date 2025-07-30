// Import the query function from the db.config.js file
import db from '../config/db.config';
import { Service } from '../types/service.types';

// Function to add a new service
async function addServices(formData: Service) {
  try {
    const query =
      'INSERT INTO common_services (service_name, service_description) VALUES (?, ?)';
    const rows: any = await db.query(query, [
      formData.service_name,
      formData.service_description,
    ]);
    if (rows.affectedRows !== 1) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Function to get all services
async function getAllService(): Promise<Service[]> {
  try {
    const query =
      'SELECT service_id, service_name, service_description FROM common_services';
    const rows = await db.query<Service[]>(query);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Function to edit a service
async function editServices(formData: Service) {
  try {
    const query =
      'UPDATE common_services SET service_name = ?, service_description = ? WHERE service_id = ?';
    const rows: any = await db.query(query, [
      formData.service_name,
      formData.service_description,
      formData.service_id,
    ]);
    if (rows.affectedRows !== 1) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Function to delete a service
async function deleteService(service_id: number) {
  try {
    const query = `DELETE FROM common_services WHERE service_id = ?`;
    const result: any = await db.query(query, [service_id]);
    return result.affectedRows > 0; // Return true if a row was deleted
  } catch (err) {
    console.error('Error deleting service:', err);
    return false;
  }
}

export { addServices, getAllService, editServices, deleteService };
