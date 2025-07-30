export interface Order {
  order_id: number;
  order_description?: string;
  estimated_completion_date: string | null;
  completion_date: string | null;
  order_completed?: number;
  order_services: OrderService[];
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string | number;
  vehicle_vin_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone_number: string;
  customer_email: string;
  employee_first_name?: string;
  employee_last_name?: string;
  order_date: string;
  order_status: string | number;
  order_hash?: string;
  additional_request?: string;
  order_total_price?: number | string | null;
  notes_for_internal_use?: string | null;
  notes_for_customer?: string | null;
  active_order?: number;
  customer_id?: number;
  vehicle_id?: number;
  employee_id?: number;
  services?: string; // Raw services string from the API
}

export interface OrderService {
  service_id: number | null;
  service_name?: string | null;
  service_completed: number | boolean;
  [key: string]: any; // Allow additional properties
}

export interface Service {
  service_id: number;
  service_name: string;
  service_description: string;
  service_price: number;
}
