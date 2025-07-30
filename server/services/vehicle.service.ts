import conn from '../config/db.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Vehicle } from '../types/vehicle.type';

// Function to add a new vehicle
const addVehicle = async (vehicleData: Vehicle): Promise<any> => {
  const {
    customer_id,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial,
    vehicle_color,
  } = vehicleData;

  const query = `
    INSERT INTO customer_vehicle_info (
      customer_id, 
      vehicle_year, 
      vehicle_make, 
      vehicle_model, 
      vehicle_type, 
      vehicle_mileage, 
      vehicle_tag, 
      vehicle_serial, 
      vehicle_color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  try {
    const result = await conn.query(query, [
      customer_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    ]);
    return result;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

// Function to get vehicles by customer ID
const getVehiclesByCustomerId = async (customerId: number) => {
  const query = 'SELECT * FROM customer_vehicle_info WHERE customer_id = ?';
  try {
    const rows = await conn.query(query, [customerId]);
    return rows;
  } catch (error) {
    console.error(`Error fetching vehicles for customer ${customerId}:`, error);
    throw error;
  }
};

// Function to update a vehicle
const updateVehicle = async (
  vehicleId: number,
  vehicleData: Partial<Vehicle>
): Promise<any> => {
  // customer_id should not be updated.
  const { customer_id, ...updateFields } = vehicleData;

  const fieldEntries = Object.entries(updateFields).filter(
    ([key, value]) => value !== undefined
  );

  if (fieldEntries.length === 0) {
    return Promise.resolve({ message: 'No fields to update.' });
  }

  const setClause = fieldEntries.map(([key]) => `${key} = ?`).join(', ');
  const values = fieldEntries.map(([, value]) => value);

  const query = `UPDATE customer_vehicle_info SET ${setClause} WHERE vehicle_id = ?`;
  values.push(vehicleId);

  try {
    const result = await conn.query(query, values);
    return result;
  } catch (error) {
    console.error(`Error updating vehicle ${vehicleId}:`, error);
    throw error;
  }
};

// Function to get a single vehicle
const getSingleVehicle = async (vehicleId: number) => {
  const query = 'SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?';
  try {
    const rows = await conn.query(query, [vehicleId]);
    return rows;
  } catch (error) {
    console.error(`Error fetching vehicle ${vehicleId}:`, error);
    throw error;
  }
};

interface OrderRow extends RowDataPacket {
  order_id: number;
}

// Function to delete a vehicle
const deleteVehicle = async (vehicleId: number) => {
  try {
    // Validate vehicle ID
    if (!vehicleId || isNaN(vehicleId)) {
      const errorMsg = `Invalid vehicle ID: ${vehicleId}`;
      console.error(errorMsg);
      return {
        success: false,
        message: 'Invalid vehicle ID',
        rowsAffected: 0,
      };
    }

    // Check if vehicle exists using a more direct approach
    const checkQuery =
      'SELECT COUNT(*) as count FROM customer_vehicle_info WHERE vehicle_id = ?';
    const [checkResult] = await conn.query<RowDataPacket[]>(checkQuery, [
      vehicleId,
    ]);

    // Handle different result formats
    let count = 0;
    if (Array.isArray(checkResult) && checkResult.length > 0) {
      count = checkResult[0].count || 0;
    } else if (
      checkResult &&
      typeof checkResult === 'object' &&
      'count' in checkResult
    ) {
      count = checkResult.count;
    }

    if (count === 0) {
      // Log all vehicles for debugging
      try {
        const [allVehicles] = await conn.query<RowDataPacket[]>(
          'SELECT vehicle_id FROM customer_vehicle_info'
        );
      } catch (error) {
        console.error('Error fetching vehicle list:', error);
      }

      return {
        success: false,
        message: 'No vehicle found with the specified ID',
        rowsAffected: 0,
      };
    }

    // 1. Find all orders that reference this vehicle
    const ordersQuery = 'SELECT order_id FROM orders WHERE vehicle_id = ?';
    const [ordersResult] = await conn.query<RowDataPacket[]>(ordersQuery, [vehicleId]);
    
    // Handle different possible result formats
    let orderIds: number[] = [];
    if (Array.isArray(ordersResult)) {
      orderIds = ordersResult.map((row: any) => row.order_id).filter(Boolean);
    } else if (ordersResult && typeof ordersResult === 'object') {
      // Handle case where it's a single row
      orderIds = [ordersResult.order_id].filter(Boolean);
    }
    
    // Create a comma-separated string of order IDs for the IN clause
    const orderIdsString = orderIds.join(',');

    if (orderIds.length > 0) {
      
      try {
        // 2. Delete related order_services
        const servicesResult = await conn.query<ResultSetHeader>(
          `DELETE FROM order_services WHERE order_id IN (${orderIdsString})`
        );
        const servicesHeader = Array.isArray(servicesResult) ? servicesResult[0] : servicesResult;

        // 3. Delete related order_status
        const statusResult = await conn.query<ResultSetHeader>(
          `DELETE FROM order_status WHERE order_id IN (${orderIdsString})`
        );
        const statusHeader = Array.isArray(statusResult) ? statusResult[0] : statusResult;

        // 4. Delete related order_info
        const infoResult = await conn.query<ResultSetHeader>(
          `DELETE FROM order_info WHERE order_id IN (${orderIdsString})`
        );
        const infoHeader = Array.isArray(infoResult) ? infoResult[0] : infoResult;

        // 5. Delete the orders
        const ordersResult = await conn.query<ResultSetHeader>(
          `DELETE FROM orders WHERE order_id IN (${orderIdsString})`
        );
        const ordersHeader = Array.isArray(ordersResult) ? ordersResult[0] : ordersResult;
        
      } catch (error) {
        console.error('Error deleting related orders:', error);
        throw new Error(`Failed to delete related orders: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      console.error('No related orders found for this vehicle.');
    }

    // 6. First, update orders to set vehicle_id to NULL
    if (orderIds.length > 0) {
      const updateQuery = `UPDATE orders SET vehicle_id = NULL WHERE order_id IN (${orderIdsString})`;
      const updateResult = await conn.query<ResultSetHeader>(updateQuery);
      const updateHeader = Array.isArray(updateResult) ? updateResult[0] : updateResult;
    }

    // 7. Now delete the vehicle
    const deleteQuery = 'DELETE FROM customer_vehicle_info WHERE vehicle_id = ?';
    const result = await conn.query<ResultSetHeader>(deleteQuery, [vehicleId]);
    const resultHeader = Array.isArray(result) ? result[0] : result;
    
    if (resultHeader.affectedRows === 0) {
      console.error('Failed to delete vehicle: No rows affected');
      return {
        success: false,
        message: 'Failed to delete vehicle',
        rowsAffected: 0
      };
    }
    
    return {
      success: true,
      message: 'Vehicle and all related data deleted successfully',
      rowsAffected: resultHeader.affectedRows,
    };
  } catch (error) {
    console.error(`Error deleting vehicle ${vehicleId}:`, error);
    throw error;
  }
};

export {
  addVehicle,
  getVehiclesByCustomerId,
  updateVehicle,
  getSingleVehicle,
  deleteVehicle,
};
