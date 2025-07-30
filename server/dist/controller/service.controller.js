"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addService = addService;
exports.getAllServices = getAllServices;
exports.editService = editService;
exports.deleteServiceController = deleteServiceController;
const service_service_1 = require("../services/service.service");
// Controller to add a new service
async function addService(req, res) {
    const newService = req.body;
    const isAdded = await (0, service_service_1.addServices)(newService);
    if (!isAdded) {
        res.status(400).json({
            error: 'Failed to add a service!',
        });
    }
    else {
        res.status(200).json({
            status: 'success',
        });
    }
}
// Controller to get all services
async function getAllServices(req, res) {
    const service = await (0, service_service_1.getAllService)();
    if (!service) {
        res.status(400).json({
            error: 'Failed to fetch services!',
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            data: service,
        });
    }
}
// Controller to edit a service
async function editService(req, res) {
    const serviceToUpdate = req.body;
    const isEdited = await (0, service_service_1.editServices)(serviceToUpdate);
    if (!isEdited) {
        res.status(400).json({
            error: 'Failed to Edit service!',
        });
    }
    else {
        res.status(200).json({
            status: 'success',
        });
    }
}
// Controller to delete a service
async function deleteServiceController(req, res) {
    const { id } = req.params;
    const isDeleted = await (0, service_service_1.deleteService)(Number(id));
    if (!isDeleted) {
        res.status(400).json({
            error: 'Failed to delete service!',
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            message: 'Service deleted successfully!',
        });
    }
}
