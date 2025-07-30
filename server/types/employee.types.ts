export interface Employee {
  employee_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'mechanic' | 'service_advisor';
  active_employee?: number;
}
