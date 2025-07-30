import ServiceForm from '../../components/Admin/ServiceForm/ServiceForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const Services: React.FC = () => {
  return (
    <AdminLayout>
      <ServiceForm />
    </AdminLayout>
  );
};

export default Services;
