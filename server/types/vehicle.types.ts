export interface Vehicle {
  vehicle_id?: number;
  customer_id: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  active_vehicle?: number;
}
