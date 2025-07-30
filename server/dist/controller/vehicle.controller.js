"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleController = exports.getSingleVehicleController = exports.updateVehicleController = exports.getVehiclesByCustomerIdController = exports.addVehicle = void 0;
const vehicle_service_1 = require("../services/vehicle.service");
// Controller to handle adding a new vehicle
const addVehicle = async (req, res) => {
    try {
        const newVehicle = await (0, vehicle_service_1.addVehicle)(req.body);
        if (newVehicle) {
            res.status(201).json({
                message: 'Vehicle added successfully!',
                data: newVehicle
            });
        }
        else {
            res.status(400).json({
                error: 'Failed to add the vehicle!'
            });
        }
    }
    catch (error) {
        console.error('Error in addVehicle controller:', error);
        res.status(500).json({ message: 'Error adding vehicle.', error });
    }
};
exports.addVehicle = addVehicle;
// Controller to get vehicles by customer ID
const getVehiclesByCustomerIdController = async (req, res) => {
    try {
        const customerId = parseInt(req.params.customer_id, 10);
        if (isNaN(customerId)) {
            res.status(400).json({ message: 'Invalid customer ID.' });
            return;
        }
        const vehicles = await (0, vehicle_service_1.getVehiclesByCustomerId)(customerId);
        res.status(200).json({ data: vehicles });
    }
    catch (error) {
        console.error('Error in getVehiclesByCustomerId controller:', error);
        res.status(500).json({ message: 'Error fetching vehicles.', error });
    }
};
exports.getVehiclesByCustomerIdController = getVehiclesByCustomerIdController;
// Controller to update a vehicle
const updateVehicleController = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicle_id, 10);
        if (isNaN(vehicleId)) {
            res.status(400).json({ message: 'Invalid vehicle ID.' });
            return;
        }
        const updatedVehicle = await (0, vehicle_service_1.updateVehicle)(vehicleId, req.body);
        res.status(200).json({ message: 'Vehicle updated successfully!', data: updatedVehicle });
    }
    catch (error) {
        console.error('Error in updateVehicle controller:', error);
        res.status(500).json({ message: 'Error updating vehicle.', error });
    }
};
exports.updateVehicleController = updateVehicleController;
// Controller to get a single vehicle
const getSingleVehicleController = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicle_id, 10);
        if (isNaN(vehicleId)) {
            res.status(400).json({ message: 'Invalid vehicle ID.' });
            return;
        }
        const vehicle = await (0, vehicle_service_1.getSingleVehicle)(vehicleId);
        res.status(200).json({ data: vehicle });
    }
    catch (error) {
        console.error('Error in getSingleVehicle controller:', error);
        res.status(500).json({ message: 'Error fetching vehicle.', error });
    }
};
exports.getSingleVehicleController = getSingleVehicleController;
// Controller to delete a vehicle
const deleteVehicleController = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicle_id, 10);
        if (isNaN(vehicleId)) {
            res.status(400).json({ message: 'Invalid vehicle ID.' });
            return;
        }
        const deletedVehicle = await (0, vehicle_service_1.deleteVehicle)(vehicleId);
        res.status(200).json({ message: 'Vehicle deleted successfully!', data: deletedVehicle });
    }
    catch (error) {
        console.error('Error in deleteVehicle controller:', error);
        res.status(500).json({ message: 'Error deleting vehicle.', error });
    }
};
exports.deleteVehicleController = deleteVehicleController;
