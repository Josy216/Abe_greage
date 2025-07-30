import AddOrderForm from '../../components/Admin/AddOrderForm/AddOrderForm';
import { useState } from 'react';
import OrderDetail from '../../components/Admin/OrderDetail/OrderDetail';
import OrderForm from '../../components/Admin/OrderForm/OrderForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const Orders: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  return (
    <AdminLayout>
      <div className="contact-section px-3">
        <div className="contact-title">
          <h2>Create a new Order</h2>
          <div className="progress-container mt-3 mb-4">
            <div className="progress" style={{ height: '10px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                  width:
                    selectedUser && selectedVehicle
                      ? '100%'
                      : selectedUser
                      ? '50%'
                      : '0%',
                  transition: 'width 0.5s ease-in-out',
                }}
                aria-valuenow={
                  selectedUser && selectedVehicle ? 100 : selectedUser ? 50 : 0
                }
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <div
                className={`text-center ${
                  !selectedUser ? 'fw-bold text-success' : ''
                }`}
              >
                <i
                  className={`bi bi-1-circle-fill ${
                    !selectedUser ? 'text-success' : 'text-muted'
                  }`}
                ></i>
                <div>Select Customer</div>
              </div>
              <div
                className={`text-center ${
                  selectedUser && !selectedVehicle ? 'fw-bold text-success' : ''
                } ${!selectedUser ? 'text-muted' : ''}`}
              >
                <i
                  className={`bi ${
                    selectedUser ? 'bi-2-circle-fill' : 'bi-2-circle'
                  } ${selectedUser ? 'text-success' : 'text-muted'}`}
                ></i>
                <div>Select Vehicle</div>
              </div>
              <div
                className={`text-center ${
                  selectedUser && selectedVehicle
                    ? 'fw-bold text-success'
                    : 'text-muted'
                }`}
              >
                <i
                  className={`bi ${
                    selectedUser && selectedVehicle
                      ? 'bi-3-circle-fill'
                      : 'bi-3-circle'
                  } ${
                    selectedUser && selectedVehicle
                      ? 'text-success'
                      : 'text-muted'
                  }`}
                ></i>
                <div>Create Order</div>
              </div>
            </div>
          </div>
        </div>
        {selectedUser && selectedVehicle ? (
          <OrderForm
            customerId={selectedUser}
            vehicleId={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            setSelectedUser={setSelectedUser}
          />
        ) : selectedUser && !selectedVehicle ? (
          <OrderDetail
            customerId={selectedUser}
            setSelectedVehicle={setSelectedVehicle}
            setSelectedUser={setSelectedUser}
          />
        ) : (
          <AddOrderForm setSelectedUser={setSelectedUser} />
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
