import React, { useEffect, useState } from 'react';
import { Badge, Spinner, Dropdown, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import orderService from '../services/order.service';
import './OrderDetail.css';
import { useAuth } from '../context/AuthContext';
import { statusMap } from '../util';
import EditOrderModal from '../components/Admin/EditOrderModal/EditOrderModal';
import { FaEdit } from 'react-icons/fa';
import { getAllServices } from '../services/service.service';
import type { Service } from '../types/orderTypes';

// Main component for displaying order details
const OrderDetail: React.FC = () => {
  const { orderHash } = useParams<{ orderHash: string }>();
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const { employee, isAdmin } = useAuth();
  const token = employee?.employee_token;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderHash],
    queryFn: () => {
      if (!token || !orderHash) throw new Error('Token and orderHash are required');
      return orderService.getOrderByHash(token, orderHash);
    },
    enabled: !!orderHash && !!token,
  });

  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;
      try {
        const response = await getAllServices(token);
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          console.error('Unexpected data format received from services API');
        }
      } catch (err) {
        console.error('Failed to fetch services.');
      }
    };
    fetchServices();
  }, [token]);

  if (!orderHash) {
    return <div>Order hash is missing from the URL</div>;
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div>Error loading order details.</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy, h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const calculateProgress = (services: any[]) => {
    if (!services || services.length === 0) return 0;
    const completedServices = services.filter(
      (s) => s.service_status === 'completed'
    ).length;
    return Math.round((completedServices / services.length) * 100);
  };

  const numericStatusMap: { [key: number]: keyof typeof statusMap } = {
    1: 'in_progress',
    2: 'completed',
    3: 'pending',
    4: 'delayed',
  };

  const getStatusBadge = (status: number) => {
    const statusKey = numericStatusMap[status];
    const statusInfo = statusMap[statusKey];

    if (!statusInfo) {
      return <Badge bg="secondary">Unknown</Badge>;
    }
    return <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const handleStatusUpdate = async (serviceId: number, status: string) => {
    try {
      await orderService.updateServiceStatus(token, order.order_id, serviceId, status);

      await queryClient.invalidateQueries({
        queryKey: ['order', orderHash],
      });

    } catch (err) {
      console.error('Failed to update service status:', err);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const ServiceStatusBadge = ({ status }: { status: string }) => {
    const statusInfo = statusMap[status as keyof typeof statusMap];

    if (!statusInfo) {
        return <Badge bg="secondary">{status}</Badge>;
    }

    return <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  return (
    <>
      <section className="services-section overflow-hidden">
        <div className="auto-container">
          <div className="sec-title style-two">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">
                {order.customer_first_name} {order.customer_last_name}
              </h2>
              <div className="d-flex flex-column align-items-center">
                <div>
                  <div className="mt-3">
                    {getStatusBadge(Number(order.order_status))}
                  </div>
                </div>
                {isAdmin && (
                  <span
                    className="ms-3 mt-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Order{' '}
                    <Button
                      variant="light"
                      size="sm"
                      className="ms-3"
                      title={'Edit Order'}
                    >
                      <FaEdit />
                    </Button>
                  </span>
                )}
              </div>
            </div>
            <div className="text">
              You can track the progress of your order using this page. We will
              constantly update this page to let you know how we are
              progressing. As soon as we are done with the order, the status
              will turn green. That means your car is ready for pickup.
            </div>
          </div>

          <div className="row g-2">
            <div className="col-lg-6 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>CUSTOMER</h5>
                <h2>
                  {order.customer_first_name} {order.customer_last_name}
                </h2>
                <p className="mb-0">Email: {order.customer_email}</p>
                <p className="mb-0">Phone: {order.customer_phone_number}</p>
                <p className="mb-0">
                  Active Customer: {order.customer_active ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div className="col-lg-6 service-block-one">
              <div className="inner-box hvr-float-shadow">
                <h5>CAR IN SERVICE</h5>
                <h2>
                  {order.vehicle_year} {order.vehicle_make}{' '}
                  {order.vehicle_model}
                </h2>
                <p className="mb-0">VIN: {order.vehicle_vin_number}</p>
                <p className="mb-0">Year: {order.vehicle_year}</p>
                <p className="mb-0">Color: {order.vehicle_color || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="hvr-float-shadow p-4 w-100">
                <div className="row">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-calendar-check fs-3 me-2 text-primary"></i>
                      <div>
                        <p className="mb-0 text-muted">Order Date</p>
                        <h3 className="mb-0" style={{ fontWeight: '560' }}>
                          {formatDate(order.order_date)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-person-gear fs-3 me-2 text-primary"></i>
                      <div>
                        <p className="mb-0 text-muted">Vehicle</p>
                        <h3 className="mb-0" style={{ fontWeight: '560' }}>
                          {order.vehicle_make} {order.vehicle_model} (
                          {order.vehicle_year})
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card border-0">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="mb-0">Requested Services</h4>
                          <span className="badge bg-warning">
                            {order.services?.length || 0} Services
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Progress</span>
                            <span>
                              {calculateProgress(order.services || [])}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: '10px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${calculateProgress(
                                  order.services || []
                                )}%`,
                              }}
                              aria-valuenow={calculateProgress(
                                order.services || []
                              )}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>

                        {order.services && order.services.length > 0 ? (
                          <ul className="service-list">
                            {order.services.map((service: any, index: any) => (
                              <li
                                key={service.service_id || index}
                                className={`service-item ${
                                  service.service_completed ? 'completed' : ''
                                }`}
                              >
                                <div className="service-name">
                                  <ServiceStatusBadge
                                    status={service.service_status}
                                  />
                                  <div>
                                    <h3>
                                      {service.service_name ||
                                        `Service #${index + 1}`}
                                    </h3>
                                    <p>{service.service_description}</p>
                                  </div>
                                </div>
                                {isAdmin && (
                                  <Dropdown>
                                    <Dropdown.Toggle variant="light" size="sm">
                                      Update Status
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {[
                                        'pending',
                                        'in_progress',
                                        'completed',
                                        'delayed',
                                      ].map((status) => (
                                        <Dropdown.Item
                                          key={status}
                                          onClick={() =>
                                            handleStatusUpdate(
                                              service.service_id,
                                              status
                                            )
                                          }
                                        >
                                          {status.replace('_', ' ')}
                                        </Dropdown.Item>
                                      ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted mb-0">
                            No services selected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditOrderModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        order={order}
        services={services}
      />
    </>
  );
};

export default OrderDetail;
