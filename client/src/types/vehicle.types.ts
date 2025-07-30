export interface Vehicle {
  vehicle_id: number;
  vehicle_year: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_type: string;
  vehicle_mileage: string;
  vehicle_tag: string;
  vehicle_serial: string;
  vehicle_color: string;
  customer_id: number;
}

export type VehicleFormData = Omit<Vehicle, 'vehicle_id' | 'active_vehicle'>;
