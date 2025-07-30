import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useAuth } from '../../../context/AuthContext';
import customerService from '../../../services/customer.service';
import { Link } from 'react-router-dom';
import { getVehiclesByCustomerId } from '../../../services/vehicle.service';
import { Table } from 'react-bootstrap';
import { FaHandPointLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface OrderDetailProps {
  customerId: number;
  setSelectedVehicle: Dispatch<SetStateAction<number | null>>;
  setSelectedUser: Dispatch<SetStateAction<number | null>>;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  customerId,
  setSelectedVehicle,
  setSelectedUser,
}) => {
  const [singleCustomer, setSingleCustomer] = useState<any | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const navigate = useNavigate();

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
            const vehicleData = await getVehiclesByCustomerId(customerId, token);
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
  }, [customerId, token]);

  return (
    <>
      <div
        className="order-detail contact-section"
        style={{ padding: '5px 0 0 15px' }}
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
                <Link to={`/admin/customer/edit/${customerId}`}>
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
              onClick={() => {
                setSelectedUser(null);
              }}
            >
              X
            </button>
          </div>
        </div>

        <div
          className="vehicle-list-container bg-white p-3 rounded"
          style={{
            boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
          }}
        >
          <h3 className="vehicle-list-title">Choose a vehicle</h3>
          {vehicles.length > 0 ? (
            <div>
              <div
                style={{
                  overflowX: 'auto',
                  maxHeight: '500px',
                  border: '1px solid #dee2e6',
                }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Tag</th>
                      <th>Serial</th>
                      <th>Color</th>
                      <th>Mileage</th>
                      <th>Choose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles?.map((vehicle: any) => (
                      <tr key={vehicle.vehicle_id}>
                        <td>{vehicle.vehicle_year}</td>
                        <td>{vehicle.vehicle_make}</td>
                        <td>{vehicle.vehicle_model}</td>
                        <td>{vehicle.vehicle_tag}</td>
                        <td>{vehicle.vehicle_serial}</td>
                        <td>{vehicle.vehicle_color}</td>
                        <td>{vehicle.vehicle_mileage}</td>
                        <td>
                          <div className="edit-delete-icons">
                            <button
                              onClick={() =>
                                setSelectedVehicle(vehicle.vehicle_id)
                              }
                            >
                              <FaHandPointLeft />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            <p>No vehicles found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
