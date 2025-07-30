const api_url = import.meta.env.VITE_API_URL;

// A function to send the login request to the server
const logIn = async (formData: any) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/employee/login`, requestOptions);
  return response;
};

const logOut = () => {
  localStorage.removeItem('employee');
};

// Export the functions
export { logIn, logOut };
