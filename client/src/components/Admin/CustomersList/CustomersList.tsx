import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
// Import the auth hook
import { useAuth } from '../../../context/AuthContext';
// Import the date-fns library
import { format } from 'date-fns'; // To properly format the date on the table
// Import the getAllCustomers function
import customerService from '../../../services/customer.service';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../../shared/ConfirmationModal';

const CustomersList: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [apiError, setApiError] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // 10 customers per page
  const { employee } = useAuth();
  const token = employee?.employee_token || '';
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchCustomers = () => {
      setIsLoading(true);
      customerService
        .getAllCustomers(token, currentPage, limit, debouncedSearchTerm)
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
          if (data && data.data) {
            setCustomers(data.data.customers);
            setTotalPages(data.data.totalPages);
          }
        })
        .catch((err) => {
          console.error(err);
          setApiError(true);
          setApiErrorMessage('Something went wrong!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchCustomers();
  }, [token, currentPage, limit, debouncedSearchTerm]);

  // Reset to page 1 whenever the debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleDeleteClick = (customerId: number) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      const response = await customerService.deleteCustomer(
        token,
        customerToDelete
      );
      if (response.ok) {
        // Remove the deleted customer from the list
        setCustomers(
          customers.filter((c: any) => c.customer_id !== customerToDelete)
        );
        toast.success('Customer deleted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('An error occurred while deleting the customer');
    } finally {
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  return (
    <>
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
          <section className="contact-section">
            <div className="auto-container">
              <div className="contact-title">
                <div className="d-flex justify-content-between align-items-center">
                  <h2>Customers</h2>
                  <button
                    onClick={() => navigate('/admin/add-customer')}
                    className="btn btn-danger"
                  >
                    Add New Customer
                  </button>
                </div>
              </div>
              <div className="search-bar" style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search for a customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                  }}
                >
                  <ScaleLoader color="#dc3545" />
                </div>
              ) : (
                <div
                  style={{
                    overflowX: 'auto',
                    maxHeight: '500px',
                    border: '1px solid #dee2e6',
                  }}
                >
                  <Table striped bordered hover style={{ marginBottom: 0 }}>
                    <thead
                      style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'white',
                        zIndex: 1,
                      }}
                    >
                      <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Added Date</th>
                        <th>Active</th>
                        <th>Profile</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length > 0 ? (
                        customers.map((customer: any) => (
                          <tr key={customer.customer_id}>
                            <td>{customer.customer_id}</td>
                            <td>{customer.customer_first_name}</td>
                            <td>{customer.customer_last_name}</td>
                            <td>{customer.customer_email}</td>
                            <td>{customer.customer_phone_number}</td>
                            <td>
                              {customer.customer_added_date
                                ? format(
                                    new Date(customer.customer_added_date),
                                    'MM - dd - yyyy | kk:mm'
                                  )
                                : 'N/A'}
                            </td>
                            <td>
                              {customer.active_customer_status ? 'Yes' : 'No'}
                            </td>
                            <td>
                              <Link
                                to={`/admin/customer/${customer.customer_id}`}
                                className="btn btn-sm btn-outline-danger"
                                title="View Profile"
                              >
                                View Profile
                              </Link>
                            </td>
                            <td>
                              <div className="edit-delete-icons">
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/admin/customer/edit/${customer.customer_id}`}
                                    className=""
                                  >
                                    <FaEdit color="red" />
                                  </Link>
                                  <button
                                    onClick={() =>
                                      handleDeleteClick(customer.customer_id)
                                    }
                                    title="Delete Customer"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center">
                            No customers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
              {/* Pagination Controls */}
              <div
                className="pagination-controls"
                style={{ marginTop: '20px', textAlign: 'center' }}
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="btn btn-danger"
                  style={{ marginRight: '5px' }}
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="btn btn-danger"
                  style={{ marginRight: '5px' }}
                >
                  Previous
                </button>
                <span style={{ margin: '0 10px' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-danger"
                  style={{ marginRight: '5px' }}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="btn btn-danger"
                >
                  Last
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        confirmColor="#dc3545"
      />
    </>
  );
};

export default CustomersList;
