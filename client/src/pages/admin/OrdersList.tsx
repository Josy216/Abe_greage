import OrdersListFormContainer from '../../components/Admin/OrdersListForm/OrdersListForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const OrdersList: React.FC = () => {
  return (
    <AdminLayout>
      <div className="contact-section px-3">
        <div className="contact-title">
          <OrdersListFormContainer />
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersList;
