// Import the database connection
import { randomBytes } from 'crypto';
import conn from '../config/db.config';
import { RowDataPacket } from 'mysql2';

// A function to create a new order
async function getAllOrders(page: number, limit: number, searchTerm: string) {
  const offset = (page - 1) * limit;
  let queryParams: (string | number)[] = [];

  let query = `
    SELECT 
        o.order_id, o.order_date, o.active_order, o.order_hash,
        c.customer_id, c.customer_email, c.customer_phone_number, ci.customer_first_name, ci.customer_last_name,
        v.vehicle_id, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_serial AS vehicle_vin_number,
        e.employee_id, ei.employee_first_name, ei.employee_last_name,
        oi.estimated_completion_date, oi.completion_date, oi.order_total_price, 
        oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer,
        os.order_status,
        GROUP_CONCAT(JSON_OBJECT('service_id', s.service_id, 'service_name', cs.service_name, 'service_completed', s.service_completed)) as services
    FROM orders o
    LEFT JOIN customer_identifier c ON o.customer_id = c.customer_id
    LEFT JOIN customer_info ci ON c.customer_id = ci.customer_id
    LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    LEFT JOIN employee e ON o.employee_id = e.employee_id
    LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
    LEFT JOIN order_info oi ON o.order_id = oi.order_id
    LEFT JOIN order_status os ON o.order_id = os.order_id
    LEFT JOIN order_services s ON o.order_id = s.order_id
    LEFT JOIN common_services cs ON s.service_id = cs.service_id
  `;

  if (searchTerm) {
    query += ` WHERE 
      ci.customer_first_name LIKE ? OR 
      ci.customer_last_name LIKE ? OR 
      c.customer_email LIKE ? OR 
      v.vehicle_model LIKE ?`;
    const searchTermLike = `%${searchTerm}%`;
    queryParams.push(
      searchTermLike,
      searchTermLike,
      searchTermLike,
      searchTermLike
    );
  }

  query += `
    GROUP BY 
      o.order_id, o.order_date, o.active_order, o.order_hash, 
      c.customer_id, c.customer_email, c.customer_phone_number, 
      ci.customer_first_name, ci.customer_last_name, 
      v.vehicle_id, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_serial, 
      e.employee_id, ei.employee_first_name, ei.employee_last_name, 
      oi.estimated_completion_date, oi.completion_date, oi.order_total_price, 
      oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer, 
      os.order_status
    ORDER BY o.order_date DESC
    LIMIT ? OFFSET ?;
  `;

  queryParams.push(limit, offset);

  try {
    const rows = await conn.query<RowDataPacket[]>(query, queryParams);

    const orders = rows.map((order: any) => {
      if (order.services) {
        order.services = JSON.parse(`[${order.services}]`);
      } else {
        order.services = [];
      }
      return order;
    });

    return orders;
  } catch (error) {
    console.error('Error fetching paginated orders:', error);
    throw error;
  }
}

async function getOrdersCount(searchTerm: string) {
  let query = `
    SELECT COUNT(DISTINCT o.order_id) as total
    FROM orders o
    LEFT JOIN customer_identifier c ON o.customer_id = c.customer_id
    LEFT JOIN customer_info ci ON c.customer_id = ci.customer_id
    LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
  `;

  let queryParams: string[] = [];

  if (searchTerm) {
    query += ` WHERE 
      ci.customer_first_name LIKE ? OR 
      ci.customer_last_name LIKE ? OR 
      c.customer_email LIKE ? OR 
      v.vehicle_model LIKE ?`;
    const searchTermLike = `%${searchTerm}%`;
    queryParams.push(
      searchTermLike,
      searchTermLike,
      searchTermLike,
      searchTermLike
    );
  }

  const rows: any = await conn.query(query, queryParams);
  return rows[0].total;
}


// Function to get a single order by its ID
async function getSingleOrder(id: number) {
  try {
    const query = `SELECT 
        o.order_id, o.order_date, o.active_order, o.order_hash,
        c.customer_id, c.customer_email, c.customer_phone_number, ci.customer_first_name, ci.customer_last_name,
        v.vehicle_id, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_serial AS vehicle_vin_number,
        e.employee_id, ei.employee_first_name, ei.employee_last_name,
        oi.estimated_completion_date, oi.completion_date, oi.order_total_price, 
        oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer,
        os.order_status,
        GROUP_CONCAT(JSON_OBJECT('service_id', s.service_id, 'service_name', cs.service_name, 'service_completed', s.service_completed)) as services
    FROM orders o
    LEFT JOIN customer_identifier c ON o.customer_id = c.customer_id
    LEFT JOIN customer_info ci ON c.customer_id = ci.customer_id
    LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    LEFT JOIN employee e ON o.employee_id = e.employee_id
    LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
    LEFT JOIN order_info oi ON o.order_id = oi.order_id
    LEFT JOIN order_status os ON o.order_id = os.order_id
    LEFT JOIN order_services s ON o.order_id = s.order_id
    LEFT JOIN common_services cs ON s.service_id = cs.service_id
    WHERE o.order_id = ?
    GROUP BY o.order_id, o.order_date, o.active_order, o.order_hash, c.customer_id, c.customer_email, c.customer_phone_number, ci.customer_first_name, ci.customer_last_name, v.vehicle_id, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_serial, e.employee_id, ei.employee_first_name, ei.employee_last_name, oi.estimated_completion_date, oi.completion_date, oi.order_total_price, oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer, os.order_status
    ORDER BY o.order_date DESC;`;
    const rows = await conn.query<RowDataPacket[]>(query, [id]);
    return rows;
  } catch (error) {
    console.error('Error fetching single order:', error);
    throw error;
  }
}

// Function to create a new order
async function createOrder(order: any) {
  try {
    // 1. Insert into orders table
    const orderHash = randomBytes(16).toString('hex');
    const orderQuery =
      'INSERT INTO orders (customer_id, employee_id, vehicle_id, order_date, active_order, order_hash) VALUES (?, ?, ?, NOW(), ?, ?)';
    const orderResult: any = await conn.query(orderQuery, [
      order.customer_id,
      order.employee_id,
      order.vehicle_id,
      1, // active_order
      orderHash,
    ]);
    const orderId = orderResult.insertId;

    // 2. Insert into order_info table
    const orderInfoQuery =
      'INSERT INTO order_info (order_id, order_total_price, estimated_completion_date, completion_date, additional_request, additional_requests_completed) VALUES (?, ?, ?, ?, ?, ?)';
    await conn.query(orderInfoQuery, [
      orderId,
      order.order_total_price,
      order.estimated_completion_date,
      order.completion_date,
      order.order_description,
      0, // Default additional_requests_completed
    ]);

    // 3. Insert into order_status table
    const orderStatusQuery =
      'INSERT INTO order_status (order_id, order_status) VALUES (?, ?)';
    await conn.query(orderStatusQuery, [orderId, 3]); // 1 for 'Pending' status

    // 4. Insert into order_services table
    if (order.order_services && order.order_services.length > 0) {
      const servicesQuery =
        'INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)';
      for (const service of order.order_services) {
        await conn.query(servicesQuery, [orderId, service.service_id, 0]);
      }
    }

    return { order_id: orderId };
  } catch (err) {
    console.error('Error creating order in service:', err);
    throw err;
  }
}

// Function to update an order
async function updateOrder(
  orderData: any
): Promise<{ success: boolean; message: string }> {
  try {
    const {
      order_description,
      estimated_completion_date,
      completion_date,
      order_services,
      order_status,
    } = orderData;
    const orderId = orderData.order_id;

    // Check if order exists
    const rows = await conn.query<RowDataPacket[]>(
      'SELECT order_id FROM orders WHERE order_id = ?',
      [orderId]
    );
    if (!rows || rows.length === 0) {
      throw new Error(`Order with id ${orderId} does not exist`);
    }

    // 1. Update order status if provided
    if (order_status !== undefined) {
      await conn.query(
        'UPDATE order_status SET order_status = ? WHERE order_id = ?',
        [order_status, orderId]
      );
    }

    // 2. Delete existing order services
    await conn.query('DELETE FROM order_services WHERE order_id = ?', [
      orderId,
    ]);

    await conn.query(
      'UPDATE order_status SET order_status = ? WHERE order_id = ?',
      [order_status, orderId]
    );

    // 3. Update order info
    await conn.query(
      `UPDATE order_info 
       SET additional_request = ?, 
           estimated_completion_date = ?, 
           completion_date = ?
       WHERE order_id = ?`,
      [order_description, estimated_completion_date, completion_date, orderId]
    );

    // 4. Insert new order services
    if (order_services && Array.isArray(order_services)) {
      for (const service of order_services) {
        await conn.query(
          'INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)',
          [
            orderId,
            service.service_id,
            0, // Default value for service_completed
          ]
        );
      }
    }

    return { success: true, message: 'Order updated successfully' };
  } catch (error) {
    console.error('Error updating order in service:', error);
    throw error;
  }
}

// Function to get an order by its hash
async function getOrderByHash(hash: string) {
  const query = `
    SELECT 
        o.order_id, o.order_date, o.active_order, o.order_hash, os.order_status,
        c.customer_id, c.customer_email, c.customer_phone_number, 
        ci.customer_first_name, ci.customer_last_name,
        v.vehicle_id, v.vehicle_make, v.vehicle_color, v.vehicle_model, v.vehicle_year, 
        v.vehicle_serial AS vehicle_vin_number,
        e.employee_id, ei.employee_first_name, ei.employee_last_name,
        oi.estimated_completion_date, oi.completion_date, oi.order_total_price, 
        oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer,
        IFNULL(
          NULLIF(
            GROUP_CONCAT(
              DISTINCT
              JSON_OBJECT(
                'service_id', s.service_id, 
                'service_name', cs.service_name,
                'service_description', cs.service_description,
                'service_completed', IFNULL(s.service_completed, 0),
                'service_status', IFNULL(s.service_status, 'pending'),
                'notes', s.notes
              )
              ORDER BY cs.service_name
              SEPARATOR ','
            ),
            ''
          ),
          '[]'
        ) as services
    FROM orders o
    LEFT JOIN customer_identifier c ON o.customer_id = c.customer_id
    LEFT JOIN customer_info ci ON c.customer_id = ci.customer_id
    LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    LEFT JOIN employee e ON o.employee_id = e.employee_id
    LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
    LEFT JOIN order_info oi ON o.order_id = oi.order_id
    LEFT JOIN order_status os ON o.order_id = os.order_id
    LEFT JOIN order_services s ON o.order_id = s.order_id
    LEFT JOIN common_services cs ON s.service_id = cs.service_id
    WHERE o.order_hash = ?
    GROUP BY 
      o.order_id, o.order_date, o.active_order, o.order_hash, os.order_status,
      c.customer_id, c.customer_email, c.customer_phone_number,
      ci.customer_first_name, ci.customer_last_name,
      v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_serial, v.vehicle_color,
      e.employee_id, ei.employee_first_name, ei.employee_last_name,
      oi.estimated_completion_date, oi.completion_date, oi.order_total_price,
      oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer;
`;

  try {
    const [rows] = await conn.query<RowDataPacket[]>(query, [hash]);

    let order = null;

    if (rows && !Array.isArray(rows) && rows.order_id) {
      order = { ...rows };
    }
    // Handle case where rows is an array of results
    else if (Array.isArray(rows) && rows.length > 0) {
      order = { ...rows[0] };
    }

    if (order) {
      // Safely parse services
      if (order.services) {
        try {
          // Handle case where services is a string
          if (typeof order.services === 'string') {
            let servicesStr = order.services.trim();
            if (!servicesStr.startsWith('[')) {
              servicesStr = `[${servicesStr}]`;
            }
            order.services = JSON.parse(servicesStr);
          }
        } catch (e) {
          console.error('Raw services string:', order.services);
          order.services = [];
        }
      } else {
        order.services = [];
      }

      const result = {
        orders: [order],
        status: 'success',
      };

      return result;
    }

    throw new Error(`Order not found with hash: ${hash}`);
  } catch (error) {
    console.error('Error in getOrderByHash:', error);
    throw error;
  }
}

// Function to get orders by user ID
async function getOrdersByUserId(userId: number) {
  try {
    // First, verify the customer exists
    const [customerCheck] = await conn.query<RowDataPacket[]>(
      'SELECT customer_id FROM customer_identifier WHERE customer_id = ?',
      [userId]
    );

    if (customerCheck.length === 0) {
      return [];
    }

    const query = `
      SELECT 
        o.order_id,
        o.order_hash,
        o.order_date,
        o.customer_id,
        os.order_status,
        oi.order_total_price,
        oi.estimated_completion_date
      FROM orders o
      LEFT JOIN order_status os ON o.order_id = os.order_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC;
    `;
    
    const rows = await conn.query<RowDataPacket[]>(query, [userId]);

    const orders = rows.map((order: any) => {
      if (order.services) {
        order.services = JSON.parse(`[${order.services}]`);
      } else {
        order.services = [];
      }
      return order;
    });
    return orders;
  } catch (error) {
    throw error;
  }
}

// Function to delete an order
async function deleteOrder(orderId: number) {
  try {
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    if (rows.length === 0) {
      throw new Error(`Order with id ${orderId} does not exist`);
    }
    // Step 1: Delete from order_status
    await conn.query(
      'DELETE FROM order_status WHERE order_id = ?',
      [orderId]
    );

    // Step 2: Delete from order_services
    await conn.query(
      'DELETE FROM order_services WHERE order_id = ?',
      [orderId]
    );

    // Step 3: Delete from order_info
    await conn.query(
      'DELETE FROM order_info WHERE order_id = ?',
      [orderId]
    );

    // Step 4: Finally, delete from orders
    await conn.query(
      'DELETE FROM orders WHERE order_id = ?',
      [orderId]
    );
    
    return true;
  } catch (error) {
    throw error;
  }
}

export {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  getOrderByHash,
  getOrdersByUserId,
  getOrdersCount,
  deleteOrder,
};
