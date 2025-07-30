import { Request, Response } from 'express';
import { login } from '../services/login.service';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;

// Handle employee login 
async function logIn(req: Request, res: Response) {
  try {
    const employeeData: any = req.body;
    const employee: any = await login(employeeData);
    if (employee.status === "fail") {
      res.status(403).json({
        status: employee.status,
        message: employee.message,
      });
    }
    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_role: employee.data.company_role_id,
      employee_first_name: employee.data.employee_first_name,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    const sendBack = {
      employee_token: token,
    };
    res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: sendBack,
    });
  } catch (error) {
    res.status(403).json({
      status: 'fail',
      message: 'Error while login'
    });
  }
}

export { logIn };