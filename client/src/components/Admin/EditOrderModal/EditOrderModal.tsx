import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { type Order, type Service } from '../../../types/orderTypes';
import { useAuth } from '../../../context/AuthContext';
import orderService from '../../../services/order.service';
import { ScaleLoader } from 'react-spinners';

interface EditOrderModalProps {
  show: boolean;
  handleClose: () => void;
  order: Order | null;
  services: Service[];
}

interface FormData {
  order_description: string;
  estimated_completion_date: string;
  completion_date: string;
  order_completed: number;
  order_services: number[];
  order_status: number;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ show, handleClose, order, services }) => {
  // Debug: Log the services prop to see what's being passed
  const [formData, setFormData] = useState<FormData>({
    order_description: '',
    estimated_completion_date: '',
    completion_date: '',
    order_completed: 0,
    order_services: [],
    order_status: 1 // Default to 'In Progress'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { employee } = useAuth();
  const token = employee?.employee_token;

  useEffect(() => {
    if (order) {
      setFormData({
        order_description: order.order_description || '',
        estimated_completion_date: order.estimated_completion_date || '',
        completion_date: order.completion_date || '',
        order_completed: order.order_completed || 0,
        order_services: Array.isArray(order.order_services) 
          ? order.order_services
              .map(service => service.service_id)
              .filter((id): id is number => id !== null)
          : [],
        order_status: Number(order.order_status) // Ensure order_status is always a number
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !token) {
      console.error('Order data or authentication token is missing');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        order_id: order.order_id,
        order_services: formData.order_services.map(serviceId => ({ service_id: Number(serviceId) })),
        order_status: formData.order_status
      };

      const response = await orderService.updateOrder(token, order.order_id, payload);
      
      if (response.ok) {
        handleClose();
        // Refresh the orders list after successful update
        window.location.reload();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update order:', errorData);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" style={{marginTop: '10px', zIndex: '9999'}}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Order Description
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="order_description"
                value={formData.order_description}
                onChange={(e) => setFormData({ ...formData, order_description: e.target.value })}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Estimated Completion Date
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="datetime-local"
                name="estimated_completion_date"
                value={formData.estimated_completion_date}
                onChange={(e) => setFormData({ ...formData, estimated_completion_date: e.target.value })}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Completion Date
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="datetime-local"
                name="completion_date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Order Status
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                value={formData.order_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_status: parseInt(e.target.value),
                    order_completed: parseInt(e.target.value) === 2 ? 1 : formData.order_completed
                  })
                }
              >
                <option value={1}>In Progress</option>
                <option value={2}>Completed</option>
                <option value={3}>Received</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Order Completed
            </Form.Label>
            <Col sm={9} className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                checked={formData.order_completed === 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_completed: e.target.checked ? 1 : 0,
                  })
                }
                disabled={formData.order_status === 2} // Disable if status is Completed
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Services
            </Form.Label>
            <Col sm={9}>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ced4da', borderRadius: '0.25rem', padding: '0.5rem' }}>
                {services && services.length > 0 ? (
                  services.map(service => (
                    <Form.Check
                      key={service.service_id}
                      type="checkbox"
                      id={`service-${service.service_id}`}
                      label={service.service_name}
                      checked={formData.order_services.includes(service.service_id)}
                      onChange={(e) => {
                        const serviceId = service.service_id;
                        setFormData(prev => ({
                          ...prev,
                          order_services: e.target.checked
                            ? [...prev.order_services, serviceId]
                            : prev.order_services.filter(id => id !== serviceId)
                        }));
                      }}
                      className="mb-2"
                    />
                  ))
                ) : (
                  <div className="text-muted">No services available</div>
                )}
              </div>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" style={{ backgroundColor: '#ff0000', borderRadius: '0px', border: 'none'}} disabled={isLoading}>
            {isLoading ? <ScaleLoader color='#fff' /> : 'Update Order'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditOrderModal;
