import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
// Import the auth hook
import { useAuth } from '../../../context/AuthContext';
// Import the date-fns library
import { format } from 'date-fns'; // To properly format the date on the table
// Import the getAllEmployees function
import employeeService from '../../../services/employee.service';
import { FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { ScaleLoader } from 'react-spinners';
import ConfirmationModal from '../../shared/ConfirmationModal';

const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState<any>([]);
  const [apiError, setApiError] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<any>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // States for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [employeeToDeleteName, setEmployeeToDeleteName] = useState<string>('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // 10 employees per page

  // To get the logged in employee token
  const { employee } = useAuth();
  const token = employee?.employee_token || '';
  const loggedInEmployeeId = employee?.employee_id;

  // Debounce the search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchEmployees = () => {
      setIsLoading(true);
      employeeService
        .getAllEmployees(token, currentPage, limit, debouncedSearchTerm)
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
            setEmployees(data.data.employees);
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
    fetchEmployees();
  }, [token, currentPage, limit, debouncedSearchTerm]);

  // Reset to page 1 whenever the debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleDeleteClick = (employeeId: number, employeeName: string) => {
    setEmployeeToDelete(employeeId);
    setEmployeeToDeleteName(employeeName);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      employeeService
        .deleteEmployee(token, employeeToDelete)
        .then((response) => {
          if (response.ok) {
            setEmployees((prevEmployees: any) =>
              prevEmployees.filter(
                (emp: any) => emp.employee_id !== employeeToDelete
              )
            );
          } else {
            console.error('Failed to delete employee');
          }
        })
        .catch((err) => {
          console.error('Error deleting employee:', err);
        })
        .finally(() => {
          setShowDeleteModal(false);
          setEmployeeToDelete(null);
          setEmployeeToDeleteName('');
        });
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
    setEmployeeToDeleteName('');
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '50vh' }}
      >
        <ScaleLoader color="#ff4d30" />
      </div>
    );
  }

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
              <div className="d-flex justify-content-between align-items-center">
                <div className="contact-title">
                  <h2>Employees</h2>
                </div>
                <button
                  onClick={() => navigate('/admin/add-employee')}
                  className="btn btn-danger"
                >
                  Add New Employee
                </button>
              </div>
              <div className="form-group col-md-12 px-0">
                <input
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="form-control mb-4 p-3"
                />
              </div>
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
                      <th>Active</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Added Date</th>
                      <th>Role</th>
                      <th>Edit/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length > 0 ? (
                      employees.map((employee: any) => (
                        <tr key={employee.employee_id}>
                          <td>{employee.active_employee ? 'Yes' : 'No'}</td>
                          <td>{employee.employee_first_name}</td>
                          <td>{employee.employee_last_name}</td>
                          <td>{employee.employee_email}</td>
                          <td>{employee.employee_phone}</td>
                          <td>
                            {format(
                              new Date(employee.added_date),
                              'MM - dd - yyyy | kk:mm'
                            )}
                          </td>
                          <td>{employee.company_role_name}</td>
                          <td>
                            <div className="edit-delete-icons">
                              <Link
                                to={`/admin/employees/${employee.employee_id}`}
                                style={{
                                  pointerEvents:
                                    employee.employee_id === loggedInEmployeeId
                                      ? 'none'
                                      : 'auto', // Disable click for the logged-in user's row
                                  opacity:
                                    employee.employee_id === loggedInEmployeeId
                                      ? 0.3
                                      : 1,
                                }}
                              >
                                <FaEdit />
                              </Link>{' '}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteClick(
                                    employee.employee_id,
                                    `${employee.employee_first_name} ${employee.employee_last_name}`
                                  );
                                }}
                                disabled={
                                  employee.employee_id === loggedInEmployeeId
                                }
                                style={{
                                  cursor:
                                    employee.employee_id === loggedInEmployeeId
                                      ? 'not-allowed'
                                      : 'pointer',
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  color:
                                    employee.employee_id === loggedInEmployeeId
                                      ? '#ccc'
                                      : '#000',
                                }}
                                title={
                                  employee.employee_id === loggedInEmployeeId
                                    ? 'Cannot delete your own account'
                                    : 'Delete employee'
                                }
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
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

          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            title="Confirm Delete"
            message={`Are you sure you want to delete ${employeeToDeleteName}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}
    </>
  );
};

export default EmployeesList;
