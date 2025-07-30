import bcrypt from 'bcrypt';
import { getEmployeeByEmail } from './employee.service';

// Handle employee login
export async function login(employeeData: any) {
  try {
    let returnData = {};
    const employee: any = await getEmployeeByEmail(employeeData.employee_email);
    if (employee.length === 0) {
      returnData = {
        status: 'fail',
        message: 'Employee does not exist',
      };
      return returnData;
    }

    const passwordMatch = await bcrypt.compare(
      employeeData.employee_password,
      employee[0].employee_password_hashed
    );
    if (!passwordMatch) {
      returnData = {
        status: 'fail',
        message: 'Incorrect password',
      };
      return returnData;
    }
    returnData = {
      status: 'success',
      data: employee[0],
    };
    return returnData;
  } catch (error) {
    console.error("error during login: " + error);
    throw error;
  }
}
