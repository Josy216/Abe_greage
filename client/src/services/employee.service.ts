// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// A function to send post request to create a new employee
const createEmployee = async (formData: any, employeeToken: string) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': employeeToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/employee`, requestOptions);
  return response;
};

// A function to send get request to get all employees
const getAllEmployees = async (
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
    `${api_url}/api/employees?page=${page}&limit=${limit}&search=${searchTerm}`,
    requestOptions
  );
  return response;
};

// A function to send get request to get all employees
const getSingleEmployee = async (token: string, id: number) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  };
  const response = await fetch(`${api_url}/api/employee/${id}`, requestOptions);
  return response;
}

// A function to send get request to get all employees
export interface EmployeeFormData {
  employee_id: number | undefined,
  employee_first_name: string | undefined;
  employee_last_name: string | undefined;
  employee_phone: string | undefined;
  active_employee: number | undefined;
  company_role_id: number | undefined;
}

const updateEmployee = async (token: string, formData: EmployeeFormData) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/employee`, requestOptions);
  return response;
};

async function deleteEmployee(token: string, employee_id: number) {
  const response = await fetch(`${api_url}/api/employee/${employee_id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

// Export all the functions
const employeeService = {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
};
export default employeeService;
