// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// Function to add a new customer
const addCustomer = async (token: string, customerData: any) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(customerData),
  };
  const response = await fetch(`${api_url}/api/customer`, requestOptions);
  return response;
};

// Function to get all customers
const getAllCustomers = async (
  token: string,
  page: number,
  limit: number,
  searchTerm: string
) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(
    `${api_url}/api/customer?page=${page}&limit=${limit}&search=${searchTerm}`,
    requestOptions
  );
  return response;
};

// Function to get a single customer by ID
const getCustomerById = async (token: string, id: number) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/customer/${id}`, requestOptions);
  const data = await response.json();
  return { data };
};

// Function to update a customer
const updateCustomer = async (token: string, id: number, customerData: any) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(customerData),
  };
  const response = await fetch(`${api_url}/api/customer/${id}`, requestOptions);
  return response;
};

// Function to delete a customer
const deleteCustomer = async (token: string, id: number) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/customer/${id}`, requestOptions);
  return response;
};

const customerService = {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

export default customerService;
