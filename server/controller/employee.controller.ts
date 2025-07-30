// Import the employee service
import { Request, Response } from 'express';
import {
  checkIfEmployeeExists,
  createEmployee,
  getAllEmployee,
  getSingleEmployees,
  updateEmployees,
  deleteEmployees,
  getEmployeesCount,
} from '../services/employee.service';

// create the add employee controller
async function createEmployees(
  req: Request,
  res: Response
) {
  const employeeExists = await checkIfEmployeeExists(req?.body?.employee_email);
  if (employeeExists) {
    res.status(400).json({
      error: 'This email address is already associated with another employee!',
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await createEmployee(employeeData);
      if (!employee) {
        res.status(400).json({
          error: 'Failed to add the employee!',
        });
      } else {
        res.status(200).json({
          status: 'true',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: 'Something went wrong!',
      });
    }
  }
}

// Create the getAllEmployees controller
async function getAllEmployees(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const searchTerm = (req.query.search as string) || '';

    const employees = await getAllEmployee(page, limit, searchTerm);
    const totalEmployees = await getEmployeesCount(searchTerm);

    if (!employees) {
      res.status(404).json({
        error: 'Failed to get employees!',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        employees,
        total: totalEmployees,
        page,
        totalPages: Math.ceil(totalEmployees / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Something went wrong!',
    });
  }
}

// Create the getAllEmployees controller
async function getSingleEmployee(req: Request, res: Response) {
  const { id } = req.params;
  // Call the getAllEmployees method from the employee service 
  const employee = await getSingleEmployees(id);
  if (!employee) {
    res.status(400).json({
      error: "Failed to get Single employee!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employee,
    });
  }
}

// Create the getAllEmployees controller
async function updateEmployee(
  req: Request,
  res: Response,
) {
  const isUpdated = await updateEmployees(req?.body);
  if (!isUpdated) {
    res.status(400).json({
      error: 'Failed to update employee!',
    });
  } else {
    res.status(200).json({
      status: 'success',
    });
  }
}

// Create the getAllEmployees controller
async function deleteEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const isDeleted = await deleteEmployees(Number(id));
  if (!isDeleted) {
    res.status(400).json({
      error: 'Failed to delete employee!',
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully!',
    });
  }
}

export {
  createEmployees,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
};
