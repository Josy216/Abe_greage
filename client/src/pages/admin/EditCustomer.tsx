import EditCustomerForm from '../../components/Admin/EditCustomerForm/EditCustomerForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const EditCustomer: React.FC = () => {
  return (
    <AdminLayout>
      <EditCustomerForm />
    </AdminLayout>
  );
};

export default EditCustomer;
