import type { Vehicle } from '../types/vehicle.types';
const api_url = import.meta.env.VITE_API_URL;

const addVehicle = async (token: string, vehicleData: Omit<Vehicle, 'vehicle_id'>) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(vehicleData),
  };
  const response = await fetch(`${api_url}/api/vehicle`, requestOptions);
  return response;
};

const getVehiclesByCustomerId = async (customerId: number, token: string) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/vehicles/${customerId}`, requestOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch vehicles');
  }
  return response.json();
};

const updateVehicle = async (vehicleId: number, vehicleData: Partial<Vehicle>, token: string) => {
  const response = await fetch(`${api_url}/api/vehicle/${vehicleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(vehicleData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update vehicle');
  }
  return response.json();
};

const getSingleVehicle = async (vehicleId: number, token: string) => {
  const response = await fetch(`${api_url}/api/vehicle/${vehicleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch vehicle');
  }
  return response.json();
};

const deleteVehicle = async (vehicleId: number, token: string) => {
  const response = await fetch(`${api_url}/api/vehicle/${vehicleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete vehicle');
  }
  
  return response.json();
};

const vehicleService = {
  addVehicle,
  getVehiclesByCustomerId,
  updateVehicle,  
  getSingleVehicle,
  deleteVehicle,
};

export {
  addVehicle,
  getVehiclesByCustomerId,
  updateVehicle,
  getSingleVehicle,
  deleteVehicle,
};

export default vehicleService;
