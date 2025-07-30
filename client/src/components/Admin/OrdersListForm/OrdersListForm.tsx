import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Table,
  Container,
  Row,
  Col,
  FormControl,
  Button,
  Spinner,
} from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';
import type { Order, Service } from '../../../types/orderTypes';
import { useAuth } from '../../../context/AuthContext';
import { getAllServices } from '../../../services/service.service';
import orderService from '../../../services/order.service';
import EditOrderModal from '../EditOrderModal/EditOrderModal';
import ViewOrderModal from '../ViewOrderModal/ViewOrderModal';
import { FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { TbTrash } from 'react-icons/tb';

const OrdersListForm: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const limit = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await orderService.getAllOrders(
          token,
          currentPage,
          limit,
          debouncedSearchTerm
        );
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching orders.');
        setOrders([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;
      try {
        const response = await getAllServices(token);
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setError('Unexpected data format received from services API');
        }
      } catch (err) {
        setError('Failed to fetch services.');
      }
    };
    fetchServices();
  }, [token]);

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const onViewClick = async (order: Order) => {
    if (!token) return;
    setLoadingOrder(true);
    try {
      const response = await orderService.getOrderById(token, order.order_id);
      if (response) {
        setSelectedOrder(response);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details.');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteClick = (orderId: number) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!token || orderToDelete === null) return;

    try {
      await orderService.deleteOrder(token, orderToDelete);
      toast.success('Order deleted successfully.');
      setOrders(orders.filter((order) => order.order_id !== orderToDelete));
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order.');
    } finally {
      handleCloseDeleteModal();
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className="badge bg-warning">In progress</span>;
      case 2:
        return <span className="badge bg-success">Completed</span>;
      case 3:
        return <span className="badge bg-secondary">Received</span>;
      default:
        return <span className="badge bg-light text-dark">Unknown</span>;
    }
  };

  return (
    <>
      <Container fluid>
        <Row className="align-items-center mb-3">
          <Col xs={8} md={10}>
            <h2 className="m-0">Orders List</h2>
          </Col>
          <Col xs={4} md={2} className="d-flex justify-content-end">
            <Button
              variant="danger"
              onClick={() => navigate('/admin/order')}
              className="add-new-button"
            >
              Add New Order
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12}>
            <FormControl
              type="text"
              placeholder="Search by customer name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '50vh' }}
          >
            <ScaleLoader color="#ff4d30" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center mt-4">
            <h4>No orders found.</h4>
            <p>There are no orders matching your search criteria.</p>
          </div>
        ) : (
          <div
            style={{
              overflowX: 'auto',
              maxHeight: '1000px',
              border: '1px solid #dee2e6',
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Order Date</th>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td onClick={() => onViewClick(order)}>
                      <strong>
                        {order.customer_first_name} {order.customer_last_name}
                      </strong>
                      <div>{order.customer_phone_number}</div>
                      <div>{order.customer_email}</div>
                    </td>
                    <td onClick={() => onViewClick(order)}>
                      <strong>{`${order.vehicle_make} ${order.vehicle_model}`}</strong>
                      <div>{order.vehicle_year}</div>
                      <div>{order.vehicle_vin_number}</div>
                    </td>
                    <td onClick={() => onViewClick(order)}>
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td onClick={() => onViewClick(order)}>
                      {`${order.employee_first_name} ${order.employee_last_name}`}
                    </td>
                    <td>{getStatusBadge(Number(order.order_status))}</td>
                    <td className="view-edit-icons">
                      {loadingOrder &&
                      selectedOrder?.order_id === order.order_id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <FaExternalLinkAlt
                            size={18}
                            className="icon"
                            onClick={() =>
                              window.open(
                                `/order/${order.order_hash}`,
                                '_blank'
                              )
                            }
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                            title="View Order Details"
                          />
                          <FaEdit
                            size={18}
                            className="icon"
                            onClick={() => handleEditClick(order)}
                            style={{ cursor: 'pointer', marginLeft: '3px' }}
                            title="Edit Order"
                          />
                          <FaTrash
                            size={18}
                            className="icon"
                            onClick={() => handleDeleteClick(order.order_id)}
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                            title="Delete Order"
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <Row className="mt-3">
          <Col className="d-flex justify-content-center gap">
            <Button
              variant="danger"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="me-2 pagination-button mr-2"
            >
              First
            </Button>
            <Button
              variant="danger"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="me-2 pagination-button mr-2"
            >
              Previous
            </Button>
            <span className="align-self-center mr-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="danger"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ms-2 pagination-button mr-2"
            >
              Next
            </Button>
            <Button
              variant="danger"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="ms-2 pagination-button"
            >
              Last
            </Button>
          </Col>
        </Row>
      </Container>
      <EditOrderModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        order={selectedOrder}
        services={services}
      />
      <ViewOrderModal
        show={showViewModal}
        handleClose={handleCloseViewModal}
        order={selectedOrder}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="#e63946"
        icon={<TbTrash size={24} />}
      />
    </>
  );
};

export default OrdersListForm;

