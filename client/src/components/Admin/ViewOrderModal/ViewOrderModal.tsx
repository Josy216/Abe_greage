import React from 'react';
import { Modal, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { type Order } from '../../../types/orderTypes';
import { format, parseISO } from 'date-fns';

interface ViewOrderModalProps {
  show: boolean;
  handleClose: () => void;
  order: Order | null;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ show, handleClose, order }) => {
  if (!order) return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Loading Order Details...</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Modal.Body>
    </Modal>
  );

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'PPP p');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: number | string | undefined) => {
    if (status === undefined || status === null) {
      return <Badge bg="secondary">Unknown</Badge>;
    }
    
    const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;
    if (isNaN(statusNum)) {
      return <Badge bg="secondary">Unknown</Badge>;
    }
    
    switch (statusNum) {
      case 1:
        return <Badge bg="warning">In Progress</Badge>;
      case 2:
        return <Badge bg="success">Completed</Badge>;
      case 3:
        return <Badge bg="info">Received</Badge>;
      default:
        return <Badge bg="secondary">Status: {statusNum}</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" style={{marginTop: '10px', zIndex: '9999'}}>
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5>Order Information</h5>
          <hr />
          <Row className="mb-2">
            <Col md={4}><strong>Order ID:</strong></Col>
            <Col md={8}>{order.order_id ?? 'N/A'}</Col>
          </Row>
          {order.order_hash && (
            <Row className="mb-2">
              <Col md={4}><strong>Order Hash:</strong></Col>
              <Col md={8} className="text-truncate" title={order.order_hash}>
                {order.order_hash}
              </Col>
            </Row>
          )}
          <Row className="mb-2">
            <Col md={4}><strong>Order Date:</strong></Col>
            <Col md={8}>{formatDate(order.order_date)}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Status:</strong></Col>
            <Col md={8}>{getStatusBadge(Number(order.order_status))}</Col>
          </Row>
          {(order.order_description || order.additional_request) && (
            <Row className="mb-2">
              <Col md={4}><strong>Description:</strong></Col>
              <Col md={8}>{order.order_description || order.additional_request}</Col>
            </Row>
          )}
          {(order.order_total_price !== null && order.order_total_price !== undefined) && (
            <Row className="mb-2">
              <Col md={4}><strong>Order Total:</strong></Col>
              <Col md={8}>
                {typeof order.order_total_price === 'number' 
                  ? `$${order.order_total_price.toFixed(2)}`
                  : `$${parseFloat(order.order_total_price).toFixed(2)}`}
              </Col>
            </Row>
          )}
        </div>

        <div className="mb-4">
          <h5>Vehicle Information</h5>
          <hr />
          <Row className="mb-2">
            <Col md={4}><strong>Vehicle:</strong></Col>
            <Col md={8}>{`${order.vehicle_year} ${order.vehicle_make} ${order.vehicle_model}`}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>VIN:</strong></Col>
            <Col md={8}>{order.vehicle_vin_number}</Col>
          </Row>
        </div>

        <div className="mb-4">
          <h5>Customer Information</h5>
          <hr />
          <Row className="mb-2">
            <Col md={4}><strong>Customer:</strong></Col>
            <Col md={8}>{`${order.customer_first_name} ${order.customer_last_name}`}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Email:</strong></Col>
            <Col md={8}>{order.customer_email}</Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Phone:</strong></Col>
            <Col md={8}>{order.customer_phone_number}</Col>
          </Row>
        </div>

        <div className="mb-4">
          <h5>Service Information</h5>
          <hr />
          <Row className="mb-2">
            <Col md={4}><strong>Assigned To:</strong></Col>
            <Col md={8}>
              {order.employee_first_name && order.employee_last_name 
                ? `${order.employee_first_name} ${order.employee_last_name}`
                : 'Not assigned'}
            </Col>
          </Row>
          {order.notes_for_internal_use && (
            <Row className="mb-2">
              <Col md={4}><strong>Internal Notes:</strong></Col>
              <Col md={8} className="text-muted">{order.notes_for_internal_use}</Col>
            </Row>
          )}
          {order.notes_for_customer && (
            <Row className="mb-2">
              <Col md={4}><strong>Customer Notes:</strong></Col>
              <Col md={8} className="text-muted">{order.notes_for_customer}</Col>
            </Row>
          )}
          <Row className="mb-2">
            <Col md={4}><strong>Estimated Completion:</strong></Col>
            <Col md={8}>
              {order.estimated_completion_date 
                ? formatDate(order.estimated_completion_date) 
                : 'Not set'}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Actual Completion:</strong></Col>
            <Col md={8}>
              {order.completion_date 
                ? formatDate(order.completion_date) 
                : 'Not completed yet'}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}><strong>Services:</strong></Col>
            <Col md={8}>
              {order.order_services && order.order_services.length > 0 ? (
                <ul className="list-unstyled">
                  {order.order_services.map((service, index) => (
                    <li key={service.service_id || index} className="mb-1">
                      {service.service_name 
                        ? `${service.service_name} (ID: ${service.service_id})`
                        : `Service #${service.service_id || index + 1}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted">No services selected</span>
              )}
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewOrderModal;
