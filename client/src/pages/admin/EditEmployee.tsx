import EditEmployeeForm from '../../components/Admin/EditEmployeeForm/EditEmployeeForm';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const EditEmployee: React.FC = () => {
  return (
    <AdminLayout>
      <EditEmployeeForm />
    </AdminLayout>
  );
};

export default EditEmployee;
