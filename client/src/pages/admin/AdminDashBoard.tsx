import Dashboard from "../../components/Admin/Dashboard/Dashboard";
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import type React from 'react';

const AdminDashBoard: React.FC = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminDashBoard;