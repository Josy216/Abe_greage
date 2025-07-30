import EmployeesList from '../../components/Admin/EmployeesList/EmployeesList';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const Employees: React.FC = () => {
  return (
    <AdminLayout>
      <EmployeesList />
    </AdminLayout>
  );
};

export default Employees;
