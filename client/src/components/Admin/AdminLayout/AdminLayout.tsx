import { useAuth } from '../../../context/AuthContext';
import Unauthorized from '../../../pages/Unauthorized';
import LoginForm from '../../LoginForm/LoginForm';
import AdminMenu from '../AdminMenu/AdminMenu';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLogged, isAdmin } = useAuth();

  if (isLogged) {
    if (isAdmin) {
      return (
        <div>
          <div className="container-fluid admin-pages overflow-hidden">
            <div className="row">
              <div className="col-md-3 admin-left-side">
                <AdminMenu />
              </div>
              <div className="col-md-9 admin-right-side">{children}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Unauthorized />;
    }
  } else {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }
};

export default AdminLayout;
