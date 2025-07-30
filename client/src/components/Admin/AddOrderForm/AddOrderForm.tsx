import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Table } from 'react-bootstrap';
import { useAuth } from "../../../context/AuthContext";
import customerService from "../../../services/customer.service";
import { Link } from "react-router-dom";
import { FaHandPointLeft } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';

interface AddOrderFormProps {
  setSelectedUser: Dispatch<SetStateAction<number | null>>;
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({ setSelectedUser }) => {
  const [customers, setCustomers] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiError, setApiError] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { employee } = useAuth();
  const token = employee?.employee_token || '';

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setCustomers([]);
      return;
    }

    const fetchCustomers = () => {
      setIsLoading(true);
      setApiError(false);
      customerService.getAllCustomers(token, 1, 20, searchQuery)
        .then((res) => {
          if (!res.ok) {
            setApiError(true);
            if (res.status === 401) {
              setApiErrorMessage('Please login again');
            } else if (res.status === 403) {
              setApiErrorMessage('You are not authorized to view this page');
            } else {
              setApiErrorMessage('Please try again later');
            }
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.data && data.data.customers) {
            setCustomers(data.data.customers);
          } else {
            setCustomers([]);
          }
        })
        .catch((err) => {
          console.error(err);
          setApiError(true);
          setApiErrorMessage('An error occurred while fetching customers.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    const debounceTimer = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, token]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <ScaleLoader color="#ff4d30" />
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{paddingInline: '0'}}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Select a Customer</h2>
        <Link to="/admin/orders" className="btn btn-outline-secondary">
          <FaHandPointLeft className="me-2" /> Back to Orders
        </Link>
      </div>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="contact-section" style={{paddingTop: '5px'}}>
            <div className="auto-container">
              <div className="search-bar" style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search for a customer using first name, last name, email address of phone number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
                {searchQuery ? (
                  <div
                style={{
                  overflowX: 'auto',
                  maxHeight: '500px',
                  border: '1px solid #dee2e6',
                }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers?.map((customer: any) => (
                      <tr key={customer.customer_id}>
                        <td>{customer.customer_id}</td>
                        <td>{customer.customer_first_name}</td>
                        <td>{customer.customer_last_name}</td>
                        <td>{customer.customer_email}</td>
                        <td>{customer.customer_phone_number}</td>
                        <td>
                          <div className="edit-delete-icons">
                            <button onClick={() => setSelectedUser(customer.customer_id)}>
                              <FaHandPointLeft />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                    </Table>
                    </div>
              ) : (
                <Link
                  to="/admin/add-customer"
                  className="theme-btn btn-style-one"
                  type="submit"
                  data-loading-text="Please wait..."
                >
                  <span>ADD NEW CUSTOMER</span>
                </Link>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AddOrderForm;
