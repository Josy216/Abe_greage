import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import type { Vehicle } from '../../../types/vehicle.types';
import {
  updateVehicle,
  deleteVehicle,
} from '../../../services/vehicle.service';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../shared/ConfirmationModal';

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #dc354580;
    cursor: not-allowed;
  }
`;

const EditVehicleForm = ({
  vehicle,
  onClose,
  onVehicleUpdated,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onVehicleUpdated: () => void;
}) => {
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const [formData, setFormData] = useState<Vehicle>(vehicle);
  const [success, setSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(vehicle);
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!token) {
      setServerError('No authentication token found');
      return;
    }

    try {
      await updateVehicle(vehicle.vehicle_id, formData, token);
      setSuccess(true);
      toast.success('Vehicle updated successfully');
      onVehicleUpdated();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update vehicle';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!token) {
      toast.error('No authentication token found');
      return;
    }

    setShowDeleteConfirm(false);
    setIsDeleting(true);

    try {
      await deleteVehicle(vehicle.vehicle_id, token);
      toast.success('Vehicle and all related data deleted successfully');
      onVehicleUpdated();
      onClose();
      navigate(`/admin/customer/${vehicle.customer_id}`);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete vehicle';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="contact-section bg-white">
      <div className="auto-container">
        <div
          className="contact-title mx-auto"
          style={{ width: '80%', marginBottom: '0' }}
        >
          <h2>Edit Vehicle</h2>
          <div>
            <DeleteButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                'Deleting...'
              ) : (
                <>
                  <FaTrash /> Delete Vehicle
                </>
              )}
            </DeleteButton>

            <ConfirmationModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={confirmDelete}
              title="Delete Vehicle"
              message="Are you sure you want to delete this vehicle? This action cannot be undone and will also remove all related service records."
              confirmText={isDeleting ? 'Deleting...' : 'Delete Vehicle'}
              confirmColor="#e63946"
            />
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-10 mx-auto">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && (
                        <div className="validation-error" role="alert">
                          {serverError}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="number"
                        name="vehicle_year"
                        value={formData.vehicle_year}
                        onChange={handleChange}
                        placeholder="Vehicle Year"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_make"
                        value={formData.vehicle_make}
                        onChange={handleChange}
                        placeholder="Vehicle Make"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_model"
                        value={formData.vehicle_model}
                        onChange={handleChange}
                        placeholder="Vehicle Model"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        placeholder="Vehicle Type"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_mileage"
                        value={formData.vehicle_mileage}
                        onChange={handleChange}
                        placeholder="Vehicle Mileage"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_tag"
                        value={formData.vehicle_tag}
                        onChange={handleChange}
                        placeholder="Vehicle Tag"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_serial"
                        value={formData.vehicle_serial}
                        onChange={handleChange}
                        placeholder="Vehicle Serial Number"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_color"
                        value={formData.vehicle_color}
                        onChange={handleChange}
                        placeholder="Vehicle Color"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Update Vehicle</span>
                      </button>
                      <button
                        type="button"
                        className="theme-btn btn-style-one"
                        style={{ marginLeft: '10px', backgroundColor: 'grey' }}
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      {success && (
                        <p style={{ color: 'green', marginTop: '10px' }}>
                          Vehicle updated successfully!
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditVehicleForm;
