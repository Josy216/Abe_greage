import dotenv from 'dotenv';
import { NextFunction, Response, Request } from 'express';
dotenv.config();
import jwt from 'jsonwebtoken';
import 'express';
import { getEmployeeByEmail } from '../services/employee.service';

declare module 'express-serve-static-core' {
  interface Request {
    employee_email?: string;
  }
}

interface verify {
  (req: Request, res: Response, next: NextFunction): any;
}

// A function to verify the token received from the frontend
const verifyToken: verify = async (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({
      status: 'fail',
      message: 'No token provided!',
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({
          status: 'fail',
          message: 'Unauthorized!',
        });
      }
      req.employee_email = decoded.employee_email;
      next();
    }
  );
};

// A function to check if the user is an admin
const isAdmin: verify = async (req, res, next) => {
  const employee_email = req.employee_email;
  const employee = await getEmployeeByEmail(employee_email);

  if (employee[0].company_role_id === 3) {
    next();
  } else {
    return res.status(403).send({
      status: 'fail',
      error: 'Not an Admin!',
    });
  }
};

export { verifyToken, isAdmin };
