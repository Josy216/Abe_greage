import CustomerDetailForm from "../../components/Admin/CustomerDetailForm/CustomerDetailForm";
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const CustomerDetail: React.FC = () => {
  return (
    <AdminLayout>
      <CustomerDetailForm />
    </AdminLayout>
  );
};

export default CustomerDetail;