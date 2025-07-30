import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import vehicleService from '../../../services/vehicle.service';

const AddVehicleForm: React.FC<{ onClose: () => void, customerId: number, onVehicleAdded: () => void }> = ({ onClose, customerId, onVehicleAdded }) => {
  const [vehicle_year, setVehicleYear] = useState<number>(new Date().getFullYear());
  const [vehicle_make, setVehicleMake] = useState<string>('');
  const [vehicle_model, setVehicleModel] = useState<string>('');
  const [vehicle_type, setVehicleType] = useState<string>('');
  const [vehicle_mileage, setVehicleMileage] = useState<string>('');
  const [vehicle_tag, setVehicleTag] = useState<string>('');
  const [vehicle_serial, setVehicleSerial] = useState<string>('');
  const [vehicle_color, setVehicleColor] = useState<string>('');

  const [success, setSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');

  const { employee } = useAuth();
  const token = employee?.employee_token;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setServerError('Authentication token is missing.');
      return;
    }

    const vehicleData = {
      customer_id: customerId,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    };

    vehicleService.addVehicle(token, vehicleData)
      .then((response: Response) => {
        if (response.ok) {
          setSuccess(true);
          onVehicleAdded();
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          response.json().then((data) => {
            setServerError(data.message || 'Failed to add vehicle.');
          });
        }
      })
      .catch((error: Error) => {
        setServerError(error.message || 'An unexpected error occurred.');
      });
  };

  return (
    <section className="contact-section bg-white">
      <div className="auto-container">
        <div className="contact-title mx-auto" style={{ width: '80%', marginBottom: '0' }}>
          <h2>Add a new Vehicle</h2>
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
                        value={vehicle_year}
                        onChange={(e) => setVehicleYear(parseInt(e.target.value))}
                        placeholder="Vehicle Year"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_make"
                        value={vehicle_make}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        placeholder="Vehicle Make"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_model"
                        value={vehicle_model}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Vehicle Model"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_type"
                        value={vehicle_type}
                        onChange={(e) => setVehicleType(e.target.value)}
                        placeholder="Vehicle Type"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_mileage"
                        value={vehicle_mileage}
                        onChange={(e) => setVehicleMileage(e.target.value)}
                        placeholder="Vehicle Mileage"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_tag"
                        value={vehicle_tag}
                        onChange={(e) => setVehicleTag(e.target.value)}
                        placeholder="Vehicle Tag"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_serial"
                        value={vehicle_serial}
                        onChange={(e) => setVehicleSerial(e.target.value)}
                        placeholder="Vehicle Serial Number"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_color"
                        value={vehicle_color}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        placeholder="Vehicle Color"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Add Vehicle</span>
                      </button>
                      {success && (
                        <p style={{ color: 'green' }}>
                          Vehicle added successfully!
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
}

export default AddVehicleForm;