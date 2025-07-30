import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useAuth } from '../../../context/AuthContext';
import customerService from '../../../services/customer.service';
import { Link } from 'react-router-dom';
import { getSingleVehicle } from '../../../services/vehicle.service';
import { Table } from 'react-bootstrap';
import { FaHandPointLeft } from 'react-icons/fa';
import EditVehicleForm from '../EditVehicleForm/EditVehicleForm';
import type { ServiceFormData } from '../../../types/service.types';
import { getAllServices } from '../../../services/service.service';
import orderService from '../../../services/order.service';
import toast from 'react-hot-toast';

interface OrderDetailProps {
  customerId: number;
  vehicleId: number;
  setSelectedVehicle: Dispatch<SetStateAction<number | null>>;
  setSelectedUser: Dispatch<SetStateAction<number | null>>;
}

const OrderForm: React.FC<OrderDetailProps> = ({ customerId, vehicleId, setSelectedVehicle, setSelectedUser }) => {
  const [singleCustomer, setSingleCustomer] = useState<any | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [openEditVehicle, setOpenEditVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isVehicleUpdated, setIsVehicleUpdated] = useState(false);
  const [allServices, setAllServices] = useState<ServiceFormData[] | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [additionalRequest, setAdditionalRequest] = useState('');
  const [additionalPrice, setAdditionalPrice] = useState('');
  const [success, setSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { employee } = useAuth();
  const token = employee?.employee_token;
  useEffect(() => {
    const fetchCustomerAndVehicles = async () => {
      if (customerId && token) {
        try {
          const customerData = await customerService.getCustomerById(
            token,
            customerId
          );
          setSingleCustomer(customerData.data.data);
          if (customerId) {
            const vehicleData = await getSingleVehicle(vehicleId, token);
            const vehiclesData = Array.isArray(vehicleData.data)
              ? vehicleData.data
              : [vehicleData.data];
            setVehicles(vehiclesData);
          }
        } catch (error) {
          console.error('Failed to fetch customer or vehicle data:', error);
        }
      }
    };

    fetchCustomerAndVehicles();

    const fetchServices = async () => {
      try {
        const response = await getAllServices(token);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setAllServices(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchServices();
    }
  }, [customerId, token, vehicleId, openEditVehicle]);

  const handleServiceChange = (serviceId: number) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(serviceId)
        ? prevSelectedServices.filter((id) => id !== serviceId)
        : [...prevSelectedServices, serviceId]
    );
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    if (!employee?.employee_id || !token) {
      alert('You must be logged in to create an order.');
      return;
    }

    const newErrors: { [key: string]: string } = {};
    if (selectedServices.length === 0 && !additionalRequest.trim()) {
      newErrors.form = 'Please select a service or enter an additional request.';
    }

    if (additionalRequest.trim() && !additionalPrice.trim()) {
      newErrors.additionalPrice = 'Price is required for additional requests.';
    } else if (additionalRequest.trim() && isNaN(parseFloat(additionalPrice))) {
      newErrors.additionalPrice = 'Please enter a valid price.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderServices = selectedServices.map((id) => ({ service_id: id }));

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);
    const formattedEstimatedDate = estimatedDate.toISOString().slice(0, 19).replace('T', ' ');

    const orderData = {
      employee_id: employee.employee_id,
      customer_id: customerId,
      vehicle_id: vehicleId,
      order_description: additionalRequest,
      estimated_completion_date: formattedEstimatedDate,
      completion_date: null,
      order_completed: 0,
      order_services: orderServices,
      additional_request: additionalRequest,
      notes_for_internal_use: '',
      notes_for_customer: '',
      order_total_price: parseFloat(additionalPrice) || 0,
      additional_requests_completed: 0,
    };

    try {
      await orderService.createOrder(token, orderData);
      toast.success('Order created successfully');
      setSuccess(true);
      setSelectedServices([]);
      setAdditionalPrice('');
      setAdditionalRequest('');
      setServerError('');
      setTimeout(() => {
        setSelectedUser(null);
        setSelectedVehicle(null);
      }, 2000);
    } catch (error: any) {
      setSelectedServices([]);
      setAdditionalPrice('');
      setAdditionalRequest('');
      setServerError(error.message);
      setSuccess(false);
    }
  };

  return (
    <>
      <div
        className="order-detail contact-section"
        style={{ padding: '5px 0 0' }}
      >
        <div
          className="content bg-white p-3 shadow-m rounded d-flex justify-content-between"
          style={{
            boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
          }}
        >
          <div className="right-side">
            <h4 className="font-weight-bold">
              Customer: {singleCustomer?.customer_first_name}{' '}
              {singleCustomer?.customer_last_name}
            </h4>
            <ul className="text pt-2">
              <li>
                <span
                  className="font-weight-bold text-black"
                  style={{ fontWeight: 'bold', color: 'black' }}
                >
                  Email
                </span>
                : {singleCustomer?.customer_email}
              </li>
              <li>
                <span
                  className="font-weight-bold text-black"
                  style={{ fontWeight: 'bold', color: 'black' }}
                >
                  Phone
                </span>
                : {singleCustomer?.customer_phone_number}
              </li>
              <li>
                <span
                  className="font-weight-bold text-black"
                  style={{ fontWeight: 'bold', color: 'black' }}
                >
                  Active Customer
                </span>
                : {singleCustomer?.active_customer_status === 1 ? 'Yes' : 'No'}
              </li>
              <li>
                <span
                  className="font-weight-bold text-black"
                  style={{ fontWeight: 'bold', color: 'black' }}
                >
                  Edit Customer info
                </span>{' '}
                <Link
                  to={`/admin/customer/edit/${singleCustomer?.customer_id}`}
                >
                  <i className="fa fa-edit" style={{ color: 'red' }}></i>
                </Link>
              </li>
            </ul>
          </div>

          <div className="left-side">
            <button
              className="btn"
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                fontSize: '20px',
              }}
              onClick={() => setSelectedUser(null)}
            >
              X
            </button>
          </div>
        </div>

        <div className="mt-3">
          {vehicles &&
            vehicles.map((vehicle: any) => (
              <div
                key={vehicle.vehicle_id}
                className="content bg-white p-3 shadow-m rounded d-flex justify-content-between"
                style={{
                  boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              >
                <div className="left-side">
                  <h4 className="font-weight-bold">{vehicle.vehicle_make}</h4>
                  <ul className="text pt-2">
                    <li>
                      <span
                        className="font-weight-bold text-black"
                        style={{ fontWeight: 'bold', color: 'black' }}
                      >
                        Color
                      </span>
                      : {vehicle.vehicle_color}
                    </li>
                    <li>
                      <span
                        className="font-weight-bold text-black"
                        style={{ fontWeight: 'bold', color: 'black' }}
                      >
                        Vehicle Tag
                      </span>
                      : {vehicle.vehicle_tag}
                    </li>
                    <li>
                      <span
                        className="font-weight-bold text-black"
                        style={{ fontWeight: 'bold', color: 'black' }}
                      >
                        Year
                      </span>
                      : {vehicle.vehicle_year}
                    </li>
                    <li>
                      <span
                        className="font-weight-bold text-black"
                        style={{ fontWeight: 'bold', color: 'black' }}
                      >
                        Mileage
                      </span>
                      : {vehicle.vehicle_mileage}
                    </li>
                    <li>
                      <span
                        className="font-weight-bold text-black"
                        style={{ fontWeight: 'bold', color: 'black' }}
                      >
                        Serial Number
                      </span>
                      : {vehicle.vehicle_serial}
                    </li>
                    <li>
                      <span
                        className="font-weight-bold text-black"
                        style={{ fontWeight: 'bold', color: 'black' }}
                      >
                        Edit Vehicle info
                      </span>{' '}
                      <button
                        onClick={() => {
                          setEditingVehicle(vehicle);
                          setOpenEditVehicle(true);
                        }}
                      >
                        <i className="fa fa-edit" style={{ color: 'red' }}></i>
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="left-side">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      fontSize: '20px',
                    }}
                    onClick={() => setSelectedVehicle(null)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
        </div>

        {openEditVehicle && editingVehicle ? (
          <>
            <button
              className="ms-auto p-2 close-btn bg-danger text-white w-2"
              onClick={() => setOpenEditVehicle(false)}
            >
              X
            </button>
            <EditVehicleForm
              vehicle={editingVehicle}
              onClose={() => setOpenEditVehicle(false)}
              onVehicleUpdated={() => setIsVehicleUpdated(!isVehicleUpdated)}
            />
          </>
        ) : null}
      </div>

      {/* Choose Service Section */}
      <div className="contact-section" style={{ padding: '5px 0 0 0' }}>
        <div
          className="content bg-white p-3 shadow-m rounded"
          style={{
            boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
          }}
        >
          <h2 className="mb-4">Choose service</h2>
          {allServices?.map((service) => (
            <div
              key={service.service_id}
              className="d-flex justify-content-between align-items-center mb-3 p-3 border shadow-sm"
            >
              <div>
                <h5>{service.service_name}</h5>
                <p className="mb-0">{service.service_description}</p>
              </div>
              <input
                type="checkbox"
                style={{ width: '20px', height: '20px', marginLeft: '15px' }}
                checked={selectedServices.includes(service.service_id!)}
                onChange={() => handleServiceChange(service.service_id!)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Requests Section */}
      <div className="form-column bg-white mx-0 mt-3">
        <div className="inner-column p-4">
          <div className="contact-form">
            <form id="contact-form" onSubmit={handleOrderSubmit}>
              <div className="row clearfix">
                <div className="sec-title style-two ml-3 overflow-hidden">
                  <h2>Additional requests</h2>
                </div>

                <div className="form-group col-md-12">
                  {serverError && (
                    <div className="validation-error" role="alert">
                      {serverError}
                    </div>
                  )}
                  {errors.form && (
                    <div className="validation-error" role="alert">
                      {errors.form}
                    </div>
                  )}
                </div>

                <div className="form-group col-md-12">
                  <textarea
                    name="form_message"
                    value={additionalRequest}
                    onChange={(e) => setAdditionalRequest(e.target.value)}
                    placeholder="Service Description"
                  ></textarea>
                </div>

                <div className="form-group col-md-12">
                  <input
                    type="text"
                    name="form_subject"
                    value={additionalPrice}
                    onChange={(e) => setAdditionalPrice(e.target.value)}
                    placeholder="Price"
                  />
                  {errors.additionalPrice && (
                    <div className="validation-error" role="alert">
                      {errors.additionalPrice}
                    </div>
                  )}
                </div>

                <div className="form-group col-md-12">
                  <button
                    className="theme-btn btn-style-one"
                    type="submit"
                    data-loading-text="Please wait..."
                  >
                    <span>SUBMIT ORDER</span>
                  </button>

                  {success && (
                    <p style={{ color: 'green' }}>Order added successfully!</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderForm;
