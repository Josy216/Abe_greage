export interface Appointment {
  appointment_id?: number;
  customer_id: number;
  vehicle_id: number;
  appointment_date: string; // Or Date
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export type AppointmentFormData = Omit<Appointment, 'appointment_id'>;
