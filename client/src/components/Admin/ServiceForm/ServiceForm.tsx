import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import { addService, getAllServices, updateService, deleteService } from '../../../services/service.service';
import type { ServiceFormData } from '../../../types/service.types';
import { useAuth } from '../../../context/AuthContext';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const ServiceForm: React.FC = () => {
  const [allServices, setAllServices] = useState<ServiceFormData[] | null>(
    null
  );
  const [serviceName, setServiceName] = useState<string>('');
  const [serviceDesc, setServiceDesc] = useState<string>('');
  const [editingService, setEditingService] = useState<ServiceFormData | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [serviceToDeleteName, setServiceToDeleteName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { employee } = useAuth();
  const token = employee?.employee_token || '';

  // Ref for the edit form
  const editFormRef = useRef<HTMLDivElement>(null);
  const addFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Call the getAllServices function
    getAllServices(token)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            toast.error('Please login again');
          } else if (res.status === 403) {
            toast.error('You are not authorized to view this page');
          } else {
            toast.error('Failed to load services. Please try again later');
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data?.data?.length > 0) {
          setAllServices(data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load services');
      });
  }, [token]);

  // Scroll to edit form when editingService changes
  useEffect(() => {
    if (editingService && editFormRef.current) {
      const timer = setTimeout(() => {
        editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [editingService]);

  const handleEditClick = (service: ServiceFormData) => {
    setEditingService(service);
    setServiceName(service.service_name);
    setServiceDesc(service.service_description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!editingService) return;

    const updatedService = {
      service_id: editingService.service_id,
      service_name: serviceName,
      service_description: serviceDesc,
    };

    updateService(token, updatedService)
      .then((res) => {
        if (res.ok) {
          setAllServices((prevServices) =>
            prevServices
              ? prevServices.map((service) =>
                  service.service_id === updatedService.service_id
                    ? { ...service, ...updatedService }
                    : service
                )
              : null
          );
          setEditingService(null);
          setServiceName('');
          setServiceDesc('');
          toast.success('Service updated successfully');
        } else {
          toast.error('Failed to update service');
        }
      })
      .catch((err) => {
        console.error('Error updating service:', err);
        toast.error('Failed to update service');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData: ServiceFormData = {
      service_name: serviceName,
      service_description: serviceDesc,
    };

    addService(token, formData)
      .then(res => res.json())
      .then(data => {
        if(data.success){
          toast.success('Service added successfully');
          setAllServices(prev => (prev ? [...prev, data.data] : [data.data]));
          setServiceName('');
          setServiceDesc('');
        } else {
          toast.error(data.message || 'Failed to add service');
        }
      })
      .catch((err) => {
        console.error('Error adding service:', err);
        toast.error('Failed to add service');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteClick = (serviceId: number, serviceName: string) => {
    setServiceToDelete(serviceId);
    setServiceToDeleteName(serviceName);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      setLoading(true);
      deleteService(token, serviceToDelete)
        .then((response) => {
          if (response.ok) {
            setAllServices(
              (prevServices) =>
                prevServices?.filter(
                  (service) => service.service_id !== serviceToDelete
                ) || null
            );
            toast.success('Service deleted successfully');
          } else {
            toast.error('Failed to delete service');
          }
        })
        .catch((err) => {
          console.error('Error deleting service:', err);
          toast.error('Error deleting service');
        })
        .finally(() => {
          setShowDeleteModal(false);
          setServiceToDelete(null);
          setServiceToDeleteName('');
          setLoading(false);
        });
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
    setServiceToDeleteName('');
  };

  const filteredServices = allServices?.filter((service) =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="services-section overflow-hidden">
        <div className="auto-container">
          <div className="d-flex justify-content-between align-items-center px-3">
            <div className="sec-title style-two">
              <h2>All Services</h2>
            </div>
            <div className="d-flex justify-content-end mb-4">
                <button 
                    className="btn btn-danger"
                    onClick={() => addFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                    Add Service
                </button>
            </div>
          </div>

          <div className="form-group col-md-12">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a service..."
              className="form-control mb-4 p-3"
            />
          </div>

          <div className="row px-3">
            {filteredServices?.map((service) => (
              <div key={service.service_id} className="col-lg-12 service-block-one">
                <div className="inner-box hvr-float-shadow d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column justify-content-center">
                    <h2>{service.service_name}</h2>
                    <h5>{service.service_description}</h5>
                  </div>
                  <div
                    className="edit-delete-icons"
                    style={{ width: '60px', marginLeft: 'auto' }}
                  >
                    <button
                      onClick={() => handleEditClick(service)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <FaEdit color="red" size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (service?.service_id) {
                          handleDeleteClick(service.service_id, service.service_name);
                        }
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#000',
                        padding: '5px',
                        marginLeft: '10px',
                      }}
                      title="Delete service"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editingService && (
          <div className="form-column bg-white mt-3 mx-3" ref={editFormRef}>
            <div className="inner-column p-5">
              <div className="contact-form">
                <form id="edit-form" onSubmit={handleEditSubmit}>
                  <div className="row clearfix">
                    <div className="sec-title style-two ml-3">
                      <h2>Edit Service</h2>
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="form_subject"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Service Name"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <textarea
                        name="form_message"
                        value={serviceDesc}
                        onChange={(e) => setServiceDesc(e.target.value)}
                        placeholder="Service Description"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>{loading ? <ScaleLoader color="#fff" /> : 'UPDATE SERVICE'}</span>
                      </button>
                      <button
                        className="theme-btn btn-style-one ml-2"
                        type="button"
                        onClick={() => {
                          setEditingService(null);
                          setServiceName('');
                          setServiceDesc('');
                        }}
                      >
                        <span>CANCEL</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {!editingService && (
          <div className="form-column bg-white mt-3 mx-3" ref={addFormRef}>
            <div className="inner-column p-5">
              <div className="contact-form">
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="sec-title style-two ml-3">
                      <h2>Add a new Service</h2>
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="form_subject"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Service Name"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <textarea
                        name="form_message"
                        value={serviceDesc}
                        onChange={(e) => setServiceDesc(e.target.value)}
                        placeholder="Service Description"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>{loading ? <ScaleLoader color='#fff' /> : 'ADD SERVICE'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete Service"
          message={`Are you sure you want to delete the service "${serviceToDeleteName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </section>
    </>
  );
};

export default ServiceForm;
