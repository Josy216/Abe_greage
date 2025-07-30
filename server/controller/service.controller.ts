import { Request, Response } from "express";
import { Service } from '../types/service.types';
import {
  addServices,
  getAllService,
  editServices,
  deleteService,
} from '../services/service.service';

// Controller to add a new service
async function addService(req: Request, res: Response) {
  const newService: Service = req.body;
  const isAdded = await addServices(newService);
  if (!isAdded) {
    res.status(400).json({
      error: 'Failed to add a service!',
    });
  } else {
    res.status(200).json({
      status: 'success',
    });
  }
}

// Controller to get all services
async function getAllServices(req: Request, res: Response) {
  const service = await getAllService();
  if (!service) {
    res.status(400).json({
      error: 'Failed to fetch services!',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: service,
    });
  }
}

// Controller to edit a service
async function editService(req: Request, res: Response) {
  const serviceToUpdate: Service = req.body;
  const isEdited = await editServices(serviceToUpdate);
  if (!isEdited) {
    res.status(400).json({
      error: 'Failed to Edit service!',
    });
  } else {
    res.status(200).json({
      status: 'success',
    });
  }
}

// Controller to delete a service
async function deleteServiceController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const isDeleted = await deleteService(Number(id));
  if (!isDeleted) {
    res.status(400).json({
      error: 'Failed to delete service!',
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Service deleted successfully!',
    });
  }
}

export { addService, getAllServices, editService, deleteServiceController };
