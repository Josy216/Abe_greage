import AddCustomerForm from '../../components/Admin/AddCustomerForm/AddCustomerForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const AddCustomer: React.FC = () => {
  return (
    <AdminLayout>
      <AddCustomerForm />
    </AdminLayout>
  );
};

export default AddCustomer;
