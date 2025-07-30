import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getVehiclesByCustomerId,
} from '../../../services/vehicle.service';
import orderService from '../../../services/order.service';
import { useAuth } from '../../../context/AuthContext';
import customerService from '../../../services/customer.service';
import { Link } from 'react-router-dom';
import AddVehicleForm from '../AddVehicleForm/AddVehicleForm';
import EditVehicleForm from '../EditVehicleForm/EditVehicleForm';

const CustomerDetailForm: React.FC = () => {
  const { customerId } = useParams();
  const [singleCustomer, setSingleCustomer] = useState<any | null>(null);
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  const [openEditVehicle, setOpenEditVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isVehicleUpdated, setIsVehicleUpdated] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const editVehicleFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCustomerAndVehicles = async () => {
      if (customerId && token) {
        try {
          const customerData = await customerService.getCustomerById(
            token,
            parseInt(customerId, 10)
          );
          setSingleCustomer(customerData.data.data);
          if (customerData.data.data?.customer_id) {
            const vehicleData = await getVehiclesByCustomerId(
              customerData.data.data.customer_id,
              token
            );
            const vehiclesData = Array.isArray(vehicleData.data)
              ? vehicleData.data
              : [vehicleData.data];
            setVehicles(vehiclesData);

            const orderData = await orderService.getOrdersByCustomerId(
              customerData.data.data.customer_id,
              token
            );
            setOrders(orderData.data);
          }
        } catch (error) {
          console.error('Failed to fetch customer or vehicle data:', error);
        }
      }
    };

    fetchCustomerAndVehicles();
  }, [customerId, token, isVehicleUpdated]);

  useEffect(() => {
    if (openEditVehicle && editVehicleFormRef.current) {
      editVehicleFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [openEditVehicle]);

  return (
    <section className="history-section pt-5">
      <div className="auto-container">
        <div className="history-block">
          <div className="years">Info</div>
          <div className="content">
            <h4>
              Customer: {singleCustomer?.customer_first_name}{' '}
              {singleCustomer?.customer_last_name}
            </h4>
            <ul className="text">
              <li>
                <span className="font-weight-bold text-black">Email</span>:{' '}
                {singleCustomer?.customer_email}
              </li>
              <li>
                <span className="font-weight-bold text-black">Phone</span>:{' '}
                {singleCustomer?.customer_phone_number}
              </li>
              <li>
                <span className="font-weight-bold text-black">
                  Active Customer
                </span>
                : {singleCustomer?.active_customer_status === 1 ? 'Yes' : 'No'}
              </li>
              <li>
                <span className="font-weight-bold text-black">
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
        </div>
        <div className="history-block position-relative">
          <div className="years">Cars</div>
          <div className="content">
            <h4>Vehicles of {singleCustomer?.customer_first_name}</h4>
            <div className="vehicle-list-container">
              <h3 className="vehicle-list-title">Vehicles</h3>
              {vehicles.length > 0 ? (
                <div>
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.vehicle_id} className="vehicle-card">
                      <button
                        onClick={() => {
                          setOpenEditVehicle(true);
                          setEditingVehicle(vehicle);
                          editVehicleFormRef.current?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }}
                      >
                        <i className="fa fa-edit" style={{ color: 'red' }}></i>
                      </button>
                      <h4>
                        {vehicle.vehicle_year} {vehicle.vehicle_make}{' '}
                        {vehicle.vehicle_model}
                      </h4>
                      <div className="vehicle-details">
                        <p>
                          <strong>Type:</strong> {vehicle.vehicle_type}
                        </p>
                        <p>
                          <strong>Color:</strong> {vehicle.vehicle_color}
                        </p>
                        <p>
                          <strong>VIN:</strong> {vehicle.vehicle_serial}
                        </p>
                        <p>
                          <strong>Tag:</strong> {vehicle.vehicle_tag}
                        </p>
                        <p>
                          <strong>Mileage:</strong> {vehicle.vehicle_mileage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No vehicles found</p>
              )}
            </div>
            {openEditVehicle && editingVehicle && (
              <div ref={editVehicleFormRef}>
                <button                  
                  className="ms-auto p-2 close-btn bg-danger text-white w-2"
                  onClick={() => setOpenEditVehicle(false)}
                >
                  X
                </button>
                <EditVehicleForm
                  vehicle={editingVehicle}
                  onClose={() => setOpenEditVehicle(false)}
                  onVehicleUpdated={() =>
                    setIsVehicleUpdated(!isVehicleUpdated)
                  }
                />
              </div>
            )}
            {openAddVehicle ? (
              <>
                <button
                  className="ms-auto p-2 close-btn bg-danger text-white w-2"
                  onClick={() => setOpenAddVehicle(false)}
                >
                  X
                </button>
                <AddVehicleForm
                  customerId={singleCustomer?.customer_id}
                  onClose={() => setOpenAddVehicle(false)}
                  onVehicleAdded={() => setIsVehicleUpdated(!isVehicleUpdated)}
                />
              </>
            ) : (
              <button
                onClick={() => setOpenAddVehicle(true)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  marginTop: '10px',
                }}
              >
                ADD NEW VEHICLE
              </button>
            )}
          </div>
        </div>
        <div className="history-block pt-2">
          <div className="years">Orders</div>
          <div className="content">
            <h4>
              Orders for {singleCustomer?.customer_first_name}{' '}
              {singleCustomer?.customer_last_name}
            </h4>
            {orders.length === 0 ? (
              <p>No orders found for this customer.</p>
            ) : (
              <div className="space-y-4 my-5">
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-lg">
                          Order #{order.order_id}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Placed on:{' '}
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status:{' '}
                          <span className="font-medium">
                            {order.order_status === 3
                              ? 'Completed'
                              : order.order_status === 2
                              ? 'In Progress'
                              : order.order_status === 1
                              ? 'Pending'
                              : 'Unknown'}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${order.order_total_price.toFixed(2)}
                        </p>
                        <Link
                          to={`/order/${order.order_hash}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    {order.estimated_completion_date && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">
                          Estimated Completion:{' '}
                        </span>
                        <span>
                          {new Date(
                            order.estimated_completion_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerDetailForm;
