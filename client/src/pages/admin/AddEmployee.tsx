import AddEmployeeForm from '../../components/Admin/AddEmployeeForm/AddEmployeeForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const AddEmployee: React.FC = () => {
  return (
    <AdminLayout>
      <AddEmployeeForm />
    </AdminLayout>
  );
};

export default AddEmployee;
