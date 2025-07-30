"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderController = createOrderController;
exports.getAllOrdersController = getAllOrdersController;
exports.getSingleOrderController = getSingleOrderController;
exports.updateOrderController = updateOrderController;
exports.getOrderByHashController = getOrderByHashController;
exports.updateServiceStatusController = updateServiceStatusController;
exports.updateServiceNotes = updateServiceNotes;
exports.getOrdersByUserIdController = getOrdersByUserIdController;
exports.deleteOrderController = deleteOrderController;
const db_config_1 = __importDefault(require("../config/db.config"));
const order_service_1 = require("../services/order.service");
// Controller to get all orders
async function getAllOrdersController(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const searchTerm = req.query.searchTerm || '';
        const orders = await (0, order_service_1.getAllOrders)(page, limit, searchTerm);
        const totalOrders = await (0, order_service_1.getOrdersCount)(searchTerm);
        const totalPages = Math.ceil(totalOrders / limit);
        res.status(200).json({
            status: 'success',
            message: 'Orders retrieved successfully!',
            data: {
                orders,
                total: totalOrders,
                totalPages,
            },
        });
    }
    catch (error) {
        console.error('Error in getAllOrdersController:', error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong on the server!',
        });
    }
}
// Controller to get single Order
async function getSingleOrderController(req, res) {
    try {
        const orders = await (0, order_service_1.getSingleOrder)(parseInt(req.params.id));
        res.status(200).json({
            orders,
        });
    }
    catch (error) {
        console.error('Error in getAllOrdersController:', error);
        res.status(500).json({
            error: 'Something went wrong on the server!',
        });
    }
}
// Controller to create a new order
async function createOrderController(req, res) {
    try {
        const orderData = req.body;
        const { order_services, additional_request, order_total_price } = orderData;
        // Validation
        if ((!order_services || order_services?.length === 0) &&
            (!additional_request || !additional_request.trim())) {
            res
                .status(400)
                .json({
                error: 'An order must have at least one service or an additional request.',
            });
            return;
        }
        if (additional_request &&
            additional_request.trim() &&
            (!order_total_price || order_total_price <= 0)) {
            res
                .status(400)
                .json({ error: 'A price is required for additional requests.' });
            return;
        }
        const newOrder = await (0, order_service_1.createOrder)(orderData);
        if (!newOrder) {
            res.status(400).json({
                error: 'Failed to create the order!',
            });
        }
        else {
            res.status(201).json({
                status: 'success',
                message: 'Order created successfully!',
                data: newOrder,
            });
        }
    }
    catch (error) {
        console.error('Error in createOrderController:', error);
        res.status(500).json({
            error: 'Something went wrong on the server!',
        });
    }
}
// Controller to update an order
async function updateOrderController(req, res) {
    try {
        const orderData = req.body;
        // Validate required fields
        if (!orderData.order_id) {
            res.status(400).json({ error: 'order_id is required' });
            return;
        }
        const updatedOrder = await (0, order_service_1.updateOrder)(orderData);
        if (!updatedOrder) {
            res.status(404).json({
                error: 'Order not found!',
            });
        }
        else {
            res.status(200).json({
                status: 'success',
                message: 'Order updated successfully!',
            });
        }
    }
    catch (error) {
        console.error('Error in updateOrderController:', error);
        res.status(500).json({
            error: 'Something went wrong on the server!',
        });
    }
}
// Controller to get an order by hash
async function getOrderByHashController(req, res) {
    try {
        const { hash } = req.params;
        const { orders, status } = await (0, order_service_1.getOrderByHash)(hash);
        if (!orders || orders.length === 0) {
            res.status(404).json({
                status: 'error',
                message: 'Order not found',
            });
            return;
        }
        res.status(200).json({
            status,
            message: 'Order fetched successfully!',
            orders,
        });
    }
    catch (error) {
        console.error('Error in getOrderByHashController:', error);
        if (error.message === 'Order not found') {
            res.status(404).json({
                status: 'error',
                message: 'Order not found',
            });
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong on the server!',
            });
        }
    }
}
// Function to update service status
async function updateServiceStatus(orderId, serviceId, status) {
    const query = `
    UPDATE order_services 
    SET service_status = ?
    WHERE order_id = ? AND service_id = ?
  `;
    await db_config_1.default.query(query, [status, orderId, serviceId]);
    // Optionally, update the main order status if all services are completed
    if (status === 'completed') {
        // Check if all services are completed and update order status if needed
        const [rows] = await db_config_1.default.query('SELECT COUNT(*) as total, SUM(CASE WHEN service_status = "completed" THEN 1 ELSE 0 END) as completed FROM order_services WHERE order_id = ?', [orderId]);
        const result = rows[0];
        if (result && result.total > 0 && result.total === result.completed) {
            // Update the order_status table
            await db_config_1.default.query(`
        INSERT INTO order_status (order_id, order_status) 
        VALUES (?, 2) 
        ON DUPLICATE KEY UPDATE order_status = 2
      `, [orderId]);
        }
    }
}
async function updateServiceNotes(req, res) {
    try {
        const { orderId, serviceId } = req.params;
        const { notes } = req.body;
        await db_config_1.default.query('UPDATE order_services SET notes = ? WHERE order_id = ? AND service_id = ?', [notes, orderId, serviceId]);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update service notes' });
    }
}
async function updateServiceStatusController(req, res) {
    try {
        const { orderId, serviceId } = req.params;
        const { status } = req.body;
        await updateServiceStatus(parseInt(orderId), parseInt(serviceId), status);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error in updateServiceStatusController:', error);
        res.status(500).json({ error: 'Failed to update service status' });
    }
}
function getOrdersByUserIdController(req, res) {
    const sendResponse = (statusCode, data) => {
        res.status(statusCode).json(data);
    };
    try {
        const { user_id } = req.params;
        if (!user_id) {
            sendResponse(400, {
                status: 'error',
                message: 'User ID is required',
                data: []
            });
            return;
        }
        const userId = parseInt(user_id, 10);
        if (isNaN(userId)) {
            sendResponse(400, {
                status: 'error',
                message: 'User ID must be a number',
                data: []
            });
            return;
        }
        (0, order_service_1.getOrdersByUserId)(userId)
            .then(orders => {
            sendResponse(200, {
                status: 'success',
                message: orders.length > 0 ? 'Orders retrieved successfully' : 'No orders found for this user',
                data: orders
            });
        })
            .catch(error => {
            sendResponse(500, {
                status: 'error',
                message: 'An error occurred while fetching orders',
                data: []
            });
        });
    }
    catch (error) {
        sendResponse(500, {
            status: 'error',
            message: 'An unexpected error occurred',
            data: []
        });
    }
}
// Controller to delete an order
function deleteOrderController(req, res) {
    const sendResponse = (statusCode, data) => {
        res.status(statusCode).json(data);
    };
    try {
        const { id } = req.params;
        if (!id) {
            sendResponse(400, {
                status: 'error',
                message: 'Order ID is required',
                data: []
            });
            return;
        }
        const orderId = parseInt(id, 10);
        if (isNaN(orderId)) {
            sendResponse(400, {
                status: 'error',
                message: 'Order ID must be a number',
                data: []
            });
            return;
        }
        (0, order_service_1.deleteOrder)(orderId)
            .then(() => {
            sendResponse(200, {
                status: 'success',
                message: 'Order deleted successfully',
                data: []
            });
        })
            .catch((error) => {
            sendResponse(500, {
                status: 'error',
                message: error.message || 'An error occurred while deleting the order',
                data: []
            });
        });
    }
    catch (error) {
        sendResponse(500, {
            status: 'error',
            message: 'An unexpected error occurred',
            data: []
        });
    }
}
