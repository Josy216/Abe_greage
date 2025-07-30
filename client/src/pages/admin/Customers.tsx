import CustomersList from '../../components/Admin/CustomersList/CustomersList';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const Customers: React.FC = () => {
  return (
    <AdminLayout>
      <CustomersList />
    </AdminLayout>
  );
};

export default Customers;
