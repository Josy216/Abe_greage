// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// Function to get all orders with pagination and search
const getAllOrders = async (
  token: string,
  page: number,
  limit: number,
  searchTerm: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    searchTerm,
  });

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };

  const response = await fetch(`${api_url}/api/orders?${params.toString()}`, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

// Function to create a new order
const createOrder = async (token: string, orderData: any) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(orderData),
  };
  const response = await fetch(`${api_url}/api/order`, requestOptions);
  return response;
};

// Function to update an order
const updateOrder = async (token: string, _orderId: number, orderData: any) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(orderData),
  };
  const response = await fetch(`${api_url}/api/order`, requestOptions);
  return response;
};

// Function to get a single order by ID
const getOrderById = async (token: string, orderId: number) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/order/${orderId}`, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  const data = await response.json();
  
  // Process the first order in the response array
  if (data.orders && data.orders.length > 0) {
    const order = data.orders[0];
    
    // Parse the services string into an array of objects
    if (typeof order.services === 'string') {
      try {
        // Handle the case where services is a stringified array of objects
        const servicesArray = JSON.parse(`[${order.services.replace(/\\/g, '')}]`);
        // Filter out null service entries
        order.order_services = servicesArray.filter((s: any) => s.service_id !== null);
      } catch (error) {
        console.error('Error parsing services:', error);
        order.order_services = [];
      }
      delete order.services; // Remove the original services string
    } else {
      order.order_services = [];
    }
    
    // Ensure all expected fields are present with defaults
    return {
      ...order,
      order_description: order.additional_request || '',
      order_status: order.order_status ? Number(order.order_status) : 1, // Default to 1 (In Progress) if not set
      order_date: order.order_date || new Date().toISOString(),
      order_services: order.order_services || [],
      estimated_completion_date: order.estimated_completion_date || null,
      completion_date: order.completion_date || null,
    };
  }
  
  throw new Error('No order found with the specified ID');
};

// Function to delete order by ID
const deleteOrder = async (token: string, orderId: number) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/order/${orderId}`, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
  return response.json();
};

// Function to get a single order by hash
const getOrderByHash = async (token: string, orderHash: string) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/order/hash/${orderHash}`, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  const data = await response.json();
  
  // Process the first order in the response array
  if (data.orders && data.orders.length > 0) {
    const order = data.orders[0];
    
    // Ensure services is an array and handle any potential parsing
    if (!Array.isArray(order.services)) {
      order.services = [];
    }
    
    // Ensure all expected fields are present with defaults
    return {
      ...order,
      order_description: order.additional_request || '',
      order_status: order.order_status ? Number(order.order_status) : 1,
      order_date: order.order_date || new Date().toISOString(),
      estimated_completion_date: order.estimated_completion_date || null,
      completion_date: order.completion_date || null,
    };
  }
  
  throw new Error('No order found with the specified hash');
};

// Function to update service status
const updateServiceStatus = async (token: string, orderId: number, serviceId: number, status: string) => {
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({ status }),
  };
  const response = await fetch(
    `${api_url}/api/orders/${orderId}/services/${serviceId}/status`,
    requestOptions
  );
  
  if (!response.ok) {
    throw new Error('Failed to update service status');
  }
  
  return response.json();
};

const getOrdersByCustomerId = async (customerId: number, token: string) => {
  const response = await fetch(`${api_url}/api/order/user/${customerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch orders');
  }
  const data = await response.json();
  
  return data;
};

const orderService = {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrderById,
  getOrderByHash,
  updateServiceStatus,
  getOrdersByCustomerId,
  deleteOrder,
};

export default orderService;
