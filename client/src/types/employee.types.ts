export type EmployeeType = {
  active_employee: number;
  added_date: string; // ISO date string
  company_role_id: number;
  employee_email: string;
  employee_first_name: string;
  employee_id: number;
  employee_info_id: number;
  employee_last_name: string;
  employee_phone: string;
  employee_role_id: number;
};

export interface Employee {
  employee_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'mechanic' | 'service_advisor';
  active_employee?: number;
}

export interface EmployeeFormData
  extends Omit<Employee, 'employee_id' | 'active_employee'> {
  password?: string;
}
