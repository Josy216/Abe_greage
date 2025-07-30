import { Request, Response } from 'express';
import { 
  addVehicle as addVehicleService, 
  getVehiclesByCustomerId as getVehiclesByCustomerIdService, 
  updateVehicle as updateVehicleService,
  getSingleVehicle as getSingleVehicleService,
  deleteVehicle as deleteVehicleService
} from '../services/vehicle.service';

// Controller to handle adding a new vehicle
const addVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const newVehicle = await addVehicleService(req.body);
    if (newVehicle) {
        res.status(201).json({ 
            message: 'Vehicle added successfully!', 
            data: newVehicle 
        });
    } else {
        res.status(400).json({
            error: 'Failed to add the vehicle!'
        });
    }
  } catch (error) {
    console.error('Error in addVehicle controller:', error);
    res.status(500).json({ message: 'Error adding vehicle.', error });
  }
};

// Controller to get vehicles by customer ID
const getVehiclesByCustomerIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = parseInt(req.params.customer_id, 10);
    if (isNaN(customerId)) {
      res.status(400).json({ message: 'Invalid customer ID.' });
      return;
    }
    const vehicles = await getVehiclesByCustomerIdService(customerId);
    res.status(200).json({ data: vehicles });
  } catch (error) {
    console.error('Error in getVehiclesByCustomerId controller:', error);
    res.status(500).json({ message: 'Error fetching vehicles.', error });
  }
};

// Controller to update a vehicle
const updateVehicleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicle_id, 10);
    if (isNaN(vehicleId)) {
      res.status(400).json({ message: 'Invalid vehicle ID.' });
      return;
    }
    const updatedVehicle = await updateVehicleService(vehicleId, req.body);
    res.status(200).json({ message: 'Vehicle updated successfully!', data: updatedVehicle });
  } catch (error) {
    console.error('Error in updateVehicle controller:', error);
    res.status(500).json({ message: 'Error updating vehicle.', error });
  }
};

// Controller to get a single vehicle
const getSingleVehicleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicle_id, 10);
    if (isNaN(vehicleId)) {
      res.status(400).json({ message: 'Invalid vehicle ID.' });
      return;
    }
    const vehicle = await getSingleVehicleService(vehicleId);
    res.status(200).json({ data: vehicle });
  } catch (error) {
    console.error('Error in getSingleVehicle controller:', error);
    res.status(500).json({ message: 'Error fetching vehicle.', error });
  }
};

// Controller to delete a vehicle
const deleteVehicleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicle_id, 10);
    if (isNaN(vehicleId)) {
      res.status(400).json({ message: 'Invalid vehicle ID.' });
      return;
    }
    const deletedVehicle = await deleteVehicleService(vehicleId);
    res.status(200).json({ message: 'Vehicle deleted successfully!', data: deletedVehicle });
  } catch (error) {
    console.error('Error in deleteVehicle controller:', error);
    res.status(500).json({ message: 'Error deleting vehicle.', error });
  }
};

export {
  addVehicle,
  getVehiclesByCustomerIdController,
  updateVehicleController,
  getSingleVehicleController,
  deleteVehicleController
};
