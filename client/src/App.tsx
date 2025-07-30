import { Routes, Route } from 'react-router-dom';
import PageLoadingSpinner from './components/shared/PageLoadingSpinner/PageLoadingSpinner';
import Home from './pages/Home';
import Login from './pages/Login';
import AddEmployee from './pages/admin/AddEmployee';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
// Import the css files
import './assets/template_assets/css/bootstrap.css';
import './assets/template_assets/css/style.css';
import './assets/template_assets/css/responsive.css';
import './assets/template_assets/css/color.css';
import './assets/styles/custom.css';

import Unauthorized from './pages/Unauthorized';
import PrivateAuthRoute from './components/Auth/PrivateAuthRoute';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Employees from './pages/admin/Employees';
import EditEmployee from './pages/admin/EditEmployee';
import Services from './pages/admin/Services';
import AddCustomer from './pages/admin/AddCustomer';
import EditCustomer from './pages/admin/EditCustomer';
import CustomerDetail from './pages/admin/CustomerDetail';
import OrdersList from './pages/admin/OrdersList';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import Contact from './pages/Contact';
import About from './pages/About';
import Service from './pages/Service';
import OrderDetail from './pages/OrderDetail';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/404';

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <PageLoadingSpinner />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/order/:orderHash" element={<OrderDetail />} />
        <Route
          path="/admin"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AdminDashBoard />
            </PrivateAuthRoute>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Employees />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddEmployee />
            </PrivateAuthRoute>
          }
        />

        <Route
          path="/admin/employees/:id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <EditEmployee />
            </PrivateAuthRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Services />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customer/:customerId"
          element={<CustomerDetail />}
        />

        <Route
          path="/admin/orders"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <OrdersList />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/order"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Orders />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddCustomer />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customer/edit/:id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <EditCustomer />
            </PrivateAuthRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
