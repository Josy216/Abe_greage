// Import from the env
import type { ServiceFormData } from '../types/service.types';

const api_url = import.meta.env.VITE_API_URL;

async function addService(token: string, formData: ServiceFormData
) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/service`, requestOptions);
  return response;
}

async function getAllServices(token: string) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
  const response = await fetch(`${api_url}/api/service`, requestOptions);
  return response;
}

async function updateService(token: string, formData: ServiceFormData) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/service`, requestOptions);
  return response;
}

async function deleteService(token: string, service_id: number) {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  };
    const response = await fetch(`${api_url}/api/service/${service_id}`, requestOptions);
  return response;
}

export { addService, getAllServices, updateService, deleteService };
